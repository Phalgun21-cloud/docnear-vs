console.log("AUTH ROUTES FILE LOADED");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Patient = require("../models/Patient");

// ================== SIGNUP ==================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await Patient.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Patient.create({
      name,
      email,
      password: hashedPassword,
      otp,
      isVerified: false,
    });

    console.log(`📩 OTP for signup (DEV MODE): ${otp}`);

    res.json({ message: "Signup successful. OTP generated." });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ================== VERIFY OTP ==================
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(404).json({ message: "User not found" });
    }

    if (patient.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    patient.isVerified = true;
    patient.otp = null;
    await patient.save();

    res.json({ message: "Account verified successfully" });
  } catch (error) {
    console.error("OTP Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ================== LOGIN ==================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!patient.isVerified) {
      return res.status(403).json({ message: "Account not verified" });
    }

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: patient._id },
      "SECRET_KEY",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
