const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  status: { type: String, enum: ["Pending", "Accepted", "Cancelled", "Completed"], default: "Pending" },
  otp: String,
  date: String,
  time: String,
  amount: Number,
  paymentStatus: { type: String, enum: ["Pending", "Paid", "EMI"], default: "Pending" },
  emiId: { type: mongoose.Schema.Types.ObjectId, ref: "EMI" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Appointment", appointmentSchema);
