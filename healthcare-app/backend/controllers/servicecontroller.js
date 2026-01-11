const Service = require("../models/service");

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ active: true }).sort({ createdAt: -1 });

    res.json({
      success: true,
      services: services
    });
  } catch (error) {
    console.error("Get services error:", error);
    res.status(500).json({ message: error.message || "Failed to fetch services" });
  }
};

// Get service by ID
exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({
      success: true,
      service: service
    });
  } catch (error) {
    console.error("Get service error:", error);
    res.status(500).json({ message: error.message || "Failed to fetch service" });
  }
};

// Create service
exports.createService = async (req, res) => {
  try {
    const { name, type, description, basePrice, emiAvailable, minEmiAmount, doctorId, labId } = req.body;

    if (!name || !type || !basePrice) {
      return res.status(400).json({ message: "Name, type, and basePrice are required" });
    }

    const service = await Service.create({
      name,
      type,
      description,
      basePrice,
      emiAvailable: emiAvailable !== undefined ? emiAvailable : true,
      minEmiAmount: minEmiAmount || 5000,
      doctorId,
      labId,
      active: true
    });

    res.json({
      success: true,
      service: service
    });
  } catch (error) {
    console.error("Create service error:", error);
    res.status(500).json({ message: error.message || "Failed to create service" });
  }
};
