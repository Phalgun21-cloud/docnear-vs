const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: String,
  specialist: String,
  location: {
    lat: Number,
    lng: Number
  },
  rating: Number,
  active: Boolean,
  availableSlots: [String]
});

module.exports = mongoose.model("Doctor", doctorSchema);
