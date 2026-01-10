const Patient = require("../models/Patient");
const bcrypt = require("bcryptjs");
const { generateOtp } = require("../utils/otp");
const { sendOtp } = require("../utils/mailer");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  const otp = generateOtp();

  const hashed = await bcrypt.hash(password, 10);

  await Patient.create({
    name,
    email,
    password: hashed,
    otp
  });

  await sendOtp(email, otp);
  res.json({ message: "OTP Sent" });
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const patient = await Patient.findOne({ email });

  if (patient.otp === otp) {
    patient.verified = true;
    await patient.save();
    res.json({ message: "Verified Successfully" });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
};
