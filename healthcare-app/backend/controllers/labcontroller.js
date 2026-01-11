const LabTest = require("../models/labtest");
const Lab = require("../models/lab");
const Patient = require("../models/patient");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/lab-results');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `lab-result-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, JPG, JPEG, and PNG files are allowed'));
    }
  }
}).single('resultFile');

// Create lab test order
exports.createLabTest = async (req, res) => {
  try {
    const { patientId, labId, testType, testName, notes, appointmentId } = req.body;

    if (!patientId || !labId || !testType || !testName) {
      return res.status(400).json({ message: "Patient ID, Lab ID, test type, and test name are required" });
    }

    const labTest = await LabTest.create({
      patientId,
      labId,
      testType,
      testName,
      notes: notes || '',
      appointmentId: appointmentId || null,
      status: "Pending"
    });

    await labTest.populate('patientId', 'name email');
    await labTest.populate('labId', 'name email');

    res.json({
      success: true,
      message: "Lab test order created successfully",
      labTest: labTest
    });
  } catch (error) {
    console.error("Create lab test error:", error);
    res.status(500).json({ message: error.message || "Failed to create lab test order" });
  }
};

// Upload lab test result
exports.uploadResult = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || "File upload failed" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      const { testId } = req.body;

      if (!testId) {
        // Delete uploaded file if testId is missing
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: "Test ID is required" });
      }

      const labTest = await LabTest.findById(testId);
      if (!labTest) {
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ message: "Lab test not found" });
      }

      // Update lab test with result file
      labTest.resultFile = {
        url: `/uploads/lab-results/${req.file.filename}`,
        fileName: req.file.originalname,
        uploadedAt: new Date()
      };
      labTest.status = "Completed";
      labTest.resultDate = new Date();
      await labTest.save();

      await labTest.populate('patientId', 'name email');
      await labTest.populate('labId', 'name email');

      res.json({
        success: true,
        message: "Lab test result uploaded successfully",
        labTest: labTest
      });
    } catch (error) {
      // Delete uploaded file on error
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }
      console.error("Upload result error:", error);
      res.status(500).json({ message: error.message || "Failed to upload lab test result" });
    }
  });
};

// Get lab tests for patient
exports.getPatientTests = async (req, res) => {
  try {
    const { patientId } = req.params;

    const labTests = await LabTest.find({ patientId })
      .populate('labId', 'name email')
      .sort({ orderDate: -1 });

    res.json({
      success: true,
      labTests: labTests
    });
  } catch (error) {
    console.error("Get patient tests error:", error);
    res.status(500).json({ message: error.message || "Failed to fetch lab tests" });
  }
};

// Get lab tests for lab
exports.getLabTests = async (req, res) => {
  try {
    const { labId } = req.params;

    const labTests = await LabTest.find({ labId })
      .populate('patientId', 'name email')
      .sort({ orderDate: -1 });

    res.json({
      success: true,
      labTests: labTests
    });
  } catch (error) {
    console.error("Get lab tests error:", error);
    res.status(500).json({ message: error.message || "Failed to fetch lab tests" });
  }
};

// Get lab test by ID
exports.getLabTestById = async (req, res) => {
  try {
    const { id } = req.params;

    const labTest = await LabTest.findById(id)
      .populate('patientId', 'name email')
      .populate('labId', 'name email');

    if (!labTest) {
      return res.status(404).json({ message: "Lab test not found" });
    }

    res.json({
      success: true,
      labTest: labTest
    });
  } catch (error) {
    console.error("Get lab test error:", error);
    res.status(500).json({ message: error.message || "Failed to fetch lab test" });
  }
};

// Update lab test status
exports.updateTestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Pending', 'In Progress', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: "Valid status is required" });
    }

    const labTest = await LabTest.findById(id);
    if (!labTest) {
      return res.status(404).json({ message: "Lab test not found" });
    }

    labTest.status = status;
    if (status === 'Completed' && !labTest.resultDate) {
      labTest.resultDate = new Date();
    }
    await labTest.save();

    res.json({
      success: true,
      message: "Lab test status updated successfully",
      labTest: labTest
    });
  } catch (error) {
    console.error("Update test status error:", error);
    res.status(500).json({ message: error.message || "Failed to update lab test status" });
  }
};
