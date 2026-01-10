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
    lng: Number,
    address: String,
    formatted_address: String
  },
  rating: { type: Number, default: 0 },
  userRatingsTotal: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  availableSlots: [String],
  googlePlaceId: { type: String, unique: true, sparse: true },
  googleData: {
    placeId: String,
    photos: [String],
    openingHours: Object,
    priceLevel: Number,
    types: [String]
  }
});

module.exports = mongoose.model("Doctor", doctorSchema);
