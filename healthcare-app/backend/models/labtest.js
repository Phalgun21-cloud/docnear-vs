const mongoose = require("mongoose");

const labTestSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  labId: { type: mongoose.Schema.Types.ObjectId, ref: "Lab", required: true },
  testType: { type: String, required: true },
  testName: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["Pending", "In Progress", "Completed", "Cancelled"], 
    default: "Pending" 
  },
  orderDate: { type: Date, default: Date.now },
  resultDate: Date,
  resultFile: {
    url: String,
    fileName: String,
    uploadedAt: Date
  },
  notes: String,
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("LabTest", labTestSchema);
