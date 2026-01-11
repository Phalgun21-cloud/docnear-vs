const Payment = require("../models/payment");
const EMI = require("../models/emi");
const Patient = require("../models/patient");
const Appointment = require("../models/appointment");

// Mock payment gateway - Simulates payment processing
const mockPaymentGateway = {
  processPayment: async (amount, paymentMethod, patientId) => {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate 95% success rate
    const success = Math.random() > 0.05;
    
    if (success) {
      return {
        success: true,
        transactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        status: 'Completed',
        amount: amount,
        timestamp: new Date()
      };
    } else {
      return {
        success: false,
        error: 'Payment failed. Please try again or use a different payment method.',
        status: 'Failed'
      };
    }
  }
};

// Process payment for appointment/service
exports.processPayment = async (req, res) => {
  try {
    const { patientId, appointmentId, amount, paymentMethod, useEMI, tenure } = req.body;

    if (!patientId || !amount || !paymentMethod) {
      return res.status(400).json({ message: "Patient ID, amount, and payment method are required" });
    }

    // Check patient exists and has sufficient credit if using EMI
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // If using EMI, check credit limit
    if (useEMI) {
      if (amount < 5000) {
        return res.status(400).json({ message: "Minimum amount for EMI is ₹5,000" });
      }
      if (patient.availableCredit < amount) {
        return res.status(400).json({ 
          message: "Insufficient credit. Available credit: ₹" + patient.availableCredit.toLocaleString() 
        });
      }
    }

    // Process payment through mock gateway
    const paymentResult = await mockPaymentGateway.processPayment(amount, paymentMethod, patientId);

    if (!paymentResult.success) {
      return res.status(400).json({ 
        success: false,
        message: paymentResult.error || "Payment processing failed"
      });
    }

    let payment;
    let emiId = null;

    if (useEMI) {
      // Create EMI plan
      const emiAmount = amount / (tenure || 3);
      const emi = await EMI.create({
        patientId,
        serviceId: null, // Will be updated when service is booked
        amount: amount,
        emiAmount: Math.round(emiAmount),
        tenure: tenure || 3,
        interestRate: 0,
        totalAmount: amount,
        paidAmount: 0,
        remainingAmount: amount,
        status: "Active",
        nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });

      emiId = emi._id;

      // Update patient credit
      patient.availableCredit -= amount;
      await patient.save();
    }

    // Create payment record
    payment = await Payment.create({
      patientId,
      emiId: useEMI ? emiId : null,
      amount: amount,
      paymentMethod: paymentMethod,
      status: useEMI ? "Completed" : "Completed",
      transactionId: paymentResult.transactionId,
      paymentDate: new Date()
    });

    // Update appointment if provided
    if (appointmentId) {
      const appointment = await Appointment.findById(appointmentId);
      if (appointment) {
        appointment.paymentStatus = useEMI ? "EMI" : "Paid";
        appointment.amount = amount;
        appointment.emiId = emiId;
        await appointment.save();
      }
    }

    res.json({
      success: true,
      message: useEMI ? "EMI plan created successfully" : "Payment processed successfully",
      payment: payment,
      emiId: emiId,
      transactionId: paymentResult.transactionId
    });
  } catch (error) {
    console.error("Process payment error:", error);
    res.status(500).json({ message: error.message || "Failed to process payment" });
  }
};

// Process EMI payment (monthly payment)
exports.processEMIPayment = async (req, res) => {
  try {
    const { emiId, amount } = req.body;

    if (!emiId || !amount) {
      return res.status(400).json({ message: "EMI ID and amount are required" });
    }

    const emi = await EMI.findById(emiId).populate('patientId');
    if (!emi) {
      return res.status(404).json({ message: "EMI plan not found" });
    }

    if (emi.status !== "Active") {
      return res.status(400).json({ message: "EMI plan is not active" });
    }

    // Process payment
    const paymentResult = await mockPaymentGateway.processPayment(amount, "UPI", emi.patientId._id);

    if (!paymentResult.success) {
      return res.status(400).json({ 
        success: false,
        message: paymentResult.error || "Payment processing failed"
      });
    }

    // Update EMI
    emi.paidAmount += amount;
    emi.remainingAmount -= amount;
    
    // Add to payment history
    emi.paymentHistory.push({
      amount: amount,
      paymentDate: new Date(),
      status: "Paid"
    });

    // Update next payment date
    emi.nextPaymentDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Check if EMI is completed
    if (emi.remainingAmount <= 0) {
      emi.status = "Completed";
      emi.remainingAmount = 0;
    }

    await emi.save();

    // Create payment record
    const payment = await Payment.create({
      patientId: emi.patientId._id,
      emiId: emiId,
      amount: amount,
      paymentMethod: "UPI",
      status: "Completed",
      transactionId: paymentResult.transactionId,
      paymentDate: new Date()
    });

    res.json({
      success: true,
      message: "EMI payment processed successfully",
      payment: payment,
      emi: emi
    });
  } catch (error) {
    console.error("Process EMI payment error:", error);
    res.status(500).json({ message: error.message || "Failed to process EMI payment" });
  }
};

// Get payment history
exports.getPaymentHistory = async (req, res) => {
  try {
    const { patientId } = req.params;

    const payments = await Payment.find({ patientId })
      .populate('emiId')
      .sort({ paymentDate: -1 });

    res.json({
      success: true,
      payments: payments
    });
  } catch (error) {
    console.error("Get payment history error:", error);
    res.status(500).json({ message: error.message || "Failed to fetch payment history" });
  }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id)
      .populate('emiId')
      .populate('patientId');

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({
      success: true,
      payment: payment
    });
  } catch (error) {
    console.error("Get payment error:", error);
    res.status(500).json({ message: error.message || "Failed to fetch payment" });
  }
};
