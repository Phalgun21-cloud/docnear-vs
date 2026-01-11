const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["Consultation", "Video Consultation", "Lab Test", "Home Visit", "OPD"], 
    required: true 
  },
  description: String,
  basePrice: { type: Number, required: true },
  emiAvailable: { type: Boolean, default: true },
  minEmiAmount: { type: Number, default: 5000 },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  labId: { type: mongoose.Schema.Types.ObjectId, ref: "Lab" },
  clinicId: String,
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Service", serviceSchema);
