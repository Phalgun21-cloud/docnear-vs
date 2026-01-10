const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientId: mongoose.Schema.Types.ObjectId,
  doctorId: mongoose.Schema.Types.ObjectId,
  status: { type: String, default: "Pending" },
  otp: String
});

module.exports = mongoose.model("Appointment", appointmentSchema);
