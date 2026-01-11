const EMI = require("../models/emi");
const Service = require("../models/service");
const Patient = require("../models/patient");

// Calculate EMI details
exports.calculateEMI = async (req, res) => {
  try {
    const { amount, tenure } = req.body;

    if (!amount || !tenure) {
      return res.status(400).json({ message: "Amount and tenure are required" });
    }

    const principal = parseFloat(amount);
    const months = parseInt(tenure);
    const interestRate = 0; // 0% for first 3 months
    const emiAmount = principal / months; // Simple calculation for 0% interest

    res.json({
      success: true,
      emi: {
        principal,
        tenure: months,
        emiAmount: Math.round(emiAmount),
        totalAmount: principal,
        interestRate: 0,
        firstThreeMonths: true
      }
    });
  } catch (error) {
    console.error("Calculate EMI error:", error);
    res.status(500).json({ message: error.message || "Failed to calculate EMI" });
  }
};

// Create EMI plan
exports.createEMI = async (req, res) => {
  try {
    const { patientId, serviceId, amount, tenure } = req.body;

    if (!patientId || !serviceId || !amount || !tenure) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const principal = parseFloat(amount);
    const months = parseInt(tenure);
    const emiAmount = principal / months;
    const interestRate = 0;

    const emi = await EMI.create({
      patientId,
      serviceId,
      amount: principal,
      emiAmount: Math.round(emiAmount),
      tenure: months,
      interestRate,
      totalAmount: principal,
      paidAmount: 0,
      remainingAmount: principal,
      status: "Active",
      nextPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    });

    // Update patient's available credit
    const patient = await Patient.findById(patientId);
    if (patient) {
      patient.availableCredit -= principal;
      await patient.save();
    }

    res.json({
      success: true,
      emi: emi
    });
  } catch (error) {
    console.error("Create EMI error:", error);
    res.status(500).json({ message: error.message || "Failed to create EMI plan" });
  }
};

// Get patient's EMI plans
exports.getPatientEMIs = async (req, res) => {
  try {
    const { patientId } = req.params;

    const emis = await EMI.find({ patientId })
      .populate('serviceId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      emis: emis
    });
  } catch (error) {
    console.error("Get EMIs error:", error);
    res.status(500).json({ message: error.message || "Failed to fetch EMI plans" });
  }
};

// Get EMI details
exports.getEMIById = async (req, res) => {
  try {
    const { id } = req.params;

    const emi = await EMI.findById(id).populate('serviceId').populate('patientId');

    if (!emi) {
      return res.status(404).json({ message: "EMI plan not found" });
    }

    res.json({
      success: true,
      emi: emi
    });
  } catch (error) {
    console.error("Get EMI error:", error);
    res.status(500).json({ message: error.message || "Failed to fetch EMI plan" });
  }
};
