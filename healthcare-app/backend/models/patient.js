const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  otp: String,
  verified: { type: Boolean, default: false }
});

module.exports = mongoose.model("Patient", patientSchema);
