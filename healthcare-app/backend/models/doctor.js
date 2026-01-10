const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  otp: String,
  verified: { type: Boolean, default: false },
  specialist: String,
  location: {
    lat: Number,
    lng: Number
  },
  rating: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  availableSlots: [String]
});

module.exports = mongoose.model("Doctor", doctorSchema);
