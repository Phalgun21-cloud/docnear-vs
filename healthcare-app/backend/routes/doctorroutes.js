const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");

// GET /api/doctors/search?specialist=Cardiologist
router.get("/search", async (req, res) => {
  try {
    const { specialist } = req.query;

    if (!specialist) {
      return res.status(400).json({ 
        success: false,
        message: "Specialist parameter is required" 
      });
    }

    const doctors = await Doctor.find({
      specialist,
      active: true,
      verified: true, // Only show verified doctors
    }).sort({ rating: -1 });

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    console.error("Search doctors error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Failed to search doctors"
    });
  }
});

// GET /api/doctors/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({ 
        success: false,
        message: "Doctor not found" 
      });
    }

    // Don't return password or OTP
    const doctorData = doctor.toObject();
    delete doctorData.password;
    delete doctorData.otp;

    res.status(200).json({
      success: true,
      doctor: doctorData,
    });
  } catch (error) {
    console.error("Get doctor error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message || "Failed to fetch doctor"
    });
  }
});

module.exports = router;
