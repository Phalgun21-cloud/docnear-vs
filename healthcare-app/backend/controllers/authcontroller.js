const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateOtp } = require("../utils/otp");
const { sendOtp } = require("../utils/mailer");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Name, email, password, and role are required" });
    }

    // Validate role
    if (!['patient', 'doctor'].includes(role.toLowerCase())) {
      return res.status(400).json({ message: "Role must be either 'patient' or 'doctor'" });
    }

    const isDoctor = role.toLowerCase() === 'doctor';
    const Model = isDoctor ? Doctor : Patient;

    // Check if user already exists (check both models)
    const existingPatient = await Patient.findOne({ email });
    const existingDoctor = await Doctor.findOne({ email });
    
    if (existingPatient || existingDoctor) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const otp = generateOtp();
    const hashed = await bcrypt.hash(password, 10);

    if (isDoctor) {
      // Create doctor profile
      await Doctor.create({
        name,
        email,
        password: hashed,
        otp,
        active: true,
        rating: 0
      });
    } else {
      // Create patient profile
      await Patient.create({
        name,
        email,
        password: hashed,
        otp
      });
    }

    // Try to send OTP
    let emailSent = false;
    let emailError = null;
    try {
      console.log(`📧 Attempting to send OTP to: ${email}`);
      const emailResult = await sendOtp(email, otp);
      emailSent = emailResult?.sent === true;
      if (emailSent) {
        console.log(`✅ OTP email sent successfully to ${email}`);
      } else {
        console.log(`⚠️  OTP email not sent: ${emailResult?.message || emailResult?.error || 'Unknown error'}`);
        emailError = emailResult?.error || emailResult?.message;
        // Log OTP as fallback
        console.log(`📧 OTP for ${email}: ${otp}`);
      }
    } catch (err) {
      emailError = err;
      console.error("❌ Failed to send OTP email:", err.message);
      if (err.code) {
        console.error(`   Error code: ${err.code}`);
      }
      // OTP is still saved in database and logged to console
      console.log(`📧 FALLBACK - OTP for ${email}: ${otp}`);
    }

    // Return response with OTP in development mode if email failed
    const response = { 
      message: emailSent ? "OTP Sent to your email" : "OTP generated (check console/logs)", 
      role: role.toLowerCase() 
    };

    // In development, include OTP in response if email failed
    if (!emailSent && process.env.NODE_ENV !== 'production') {
      response.otp = otp;
      response.note = "Email not configured. Use this OTP for verification.";
    }

    res.json(response);
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: error.message || "Signup failed. Please try again." });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp, role } = req.body;

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Try to find in both Patient and Doctor models
    let user = await Patient.findOne({ email });
    let userRole = 'patient';
    
    if (!user) {
      user = await Doctor.findOne({ email });
      userRole = 'doctor';
    }
    
    if (!user) {
      return res.status(404).json({ message: "User not found. Please sign up first." });
    }

    if (user.otp === otp) {
      user.verified = true;
      await user.save();
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user._id, 
          email: user.email, 
          role: userRole 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({ 
        message: "Verified Successfully",
        role: userRole,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          verified: user.verified
        }
      });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: error.message || "Verification failed. Please try again." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Try to find in both Patient and Doctor models
    let user = await Patient.findOne({ email });
    let userRole = 'patient';
    
    if (!user) {
      user = await Doctor.findOne({ email });
      userRole = 'doctor';
    }
    
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if user is verified
    if (!user.verified) {
      return res.status(401).json({ message: "Please verify your email first. Check your inbox for OTP." });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: userRole 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: "Login successful",
      token,
      role: userRole,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        verified: user.verified
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message || "Login failed. Please try again." });
  }
};
