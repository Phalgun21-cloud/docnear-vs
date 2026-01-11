const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  otp: String,
  verified: { type: Boolean, default: false },
  phone: String,
  creditLimit: { type: Number, default: 50000 }, // Default credit limit
  availableCredit: { type: Number, default: 50000 },
  insuranceCoverage: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Patient", patientSchema);
