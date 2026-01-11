const mongoose = require("mongoose");

const labSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  otp: String,
  verified: { type: Boolean, default: false },
  labCode: String,
  phone: String,
  address: String,
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Lab", labSchema);
