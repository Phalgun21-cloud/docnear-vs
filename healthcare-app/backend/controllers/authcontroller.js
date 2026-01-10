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

    // Try to send OTP, but don't fail signup if email fails
    try {
      await sendOtp(email, otp);
    } catch (emailError) {
      console.error("Failed to send OTP email:", emailError);
      // Still return success - OTP is saved in database
    }

    res.json({ message: "OTP Sent", role: role.toLowerCase() });
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
