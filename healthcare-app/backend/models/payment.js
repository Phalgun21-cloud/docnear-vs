const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  emiId: { type: mongoose.Schema.Types.ObjectId, ref: "EMI" },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  amount: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    enum: ["UPI", "Card", "Net Banking", "Wallet", "EMI"], 
    default: "UPI" 
  },
  status: { 
    type: String, 
    enum: ["Pending", "Completed", "Failed", "Refunded"], 
    default: "Pending" 
  },
  transactionId: String,
  paymentDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", paymentSchema);
