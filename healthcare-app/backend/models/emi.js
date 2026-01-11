const mongoose = require("mongoose");

const emiSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  amount: { type: Number, required: true },
  emiAmount: { type: Number, required: true },
  tenure: { type: Number, required: true }, // in months
  interestRate: { type: Number, default: 0 }, // 0% for first 3 months
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  remainingAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["Active", "Completed", "Overdue", "Cancelled"], 
    default: "Active" 
  },
  startDate: { type: Date, default: Date.now },
  nextPaymentDate: Date,
  paymentHistory: [{
    amount: Number,
    paymentDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["Paid", "Pending", "Failed"], default: "Paid" }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("EMI", emiSchema);
