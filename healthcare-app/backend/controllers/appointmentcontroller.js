const Appointment = require("../models/appointment");
const Patient = require("../models/patient");
const Doctor = require("../models/doctor");
const Service = require("../models/service");
const { generateOtp } = require("../utils/otp");

exports.bookAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, serviceId, date, time, amount, paymentStatus, emiId } = req.body;

    // Validate input
    if (!patientId || !doctorId) {
      return res.status(400).json({ message: "Patient ID and Doctor ID are required" });
    }

    // Check if patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Check if service exists (if provided)
    if (serviceId) {
      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
    }

    // Create appointment
    const appointment = await Appointment.create({
      patientId,
      doctorId,
      serviceId: serviceId || null,
      date: date || null,
      time: time || null,
      amount: amount || null,
      paymentStatus: paymentStatus || "Pending",
      emiId: emiId || null,
      status: "Pending"
    });

    // Populate info in response
    await appointment.populate('doctorId', 'name specialist rating');
    await appointment.populate('patientId', 'name email');
    if (serviceId) {
      await appointment.populate('serviceId', 'name type basePrice');
    }

    res.status(201).json({ 
      success: true,
      message: "Appointment Requested",
      appointment
    });
  } catch (error) {
    console.error("Book appointment error:", error);
    res.status(500).json({ message: error.message || "Failed to book appointment. Please try again." });
  }
};

exports.acceptAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.status !== "Pending") {
      return res.status(400).json({ message: "Appointment is already processed" });
    }

    const otp = generateOtp();
    appointment.status = "Accepted";
    appointment.otp = otp;
    await appointment.save();

    // Populate doctor info
    await appointment.populate('doctorId', 'name specialist rating');
    await appointment.populate('patientId', 'name email');

    res.json({ 
      message: "Appointment accepted successfully",
      otp,
      appointment
    });
  } catch (error) {
    console.error("Accept appointment error:", error);
    res.status(500).json({ message: error.message || "Failed to accept appointment. Please try again." });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const { userId, role } = req.query;

    if (!userId || !role) {
      return res.status(400).json({ message: "User ID and role are required" });
    }

    let appointments;
    
    if (role === 'patient') {
      appointments = await Appointment.find({ patientId: userId })
        .populate('doctorId', 'name specialist rating active')
        .populate('patientId', 'name email')
        .sort({ createdAt: -1 });
    } else if (role === 'doctor') {
      appointments = await Appointment.find({ doctorId: userId })
        .populate('doctorId', 'name specialist rating active')
        .populate('patientId', 'name email')
        .sort({ createdAt: -1 });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    res.json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    console.error("Get appointments error:", error);
    res.status(500).json({ message: error.message || "Failed to fetch appointments. Please try again." });
  }
};

exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const appointment = await Appointment.findById(id)
      .populate('doctorId', 'name specialist rating active availableSlots')
      .populate('patientId', 'name email');

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({
      success: true,
      appointment
    });
  } catch (error) {
    console.error("Get appointment error:", error);
    res.status(500).json({ message: error.message || "Failed to fetch appointment. Please try again." });
  }
};
