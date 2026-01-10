const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");

// GET /api/doctors/search?specialist=Cardiologist
router.get("/search", async (req, res) => {
  try {
    const { specialist } = req.query;

    const doctors = await Doctor.find({
      specialist,
      active: true,
    }).sort({ rating: -1 });

    res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
