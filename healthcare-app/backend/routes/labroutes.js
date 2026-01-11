const router = require("express").Router();
const { createLabTest, uploadResult, getPatientTests, getLabTests, getLabTestById, updateTestStatus } = require("../controllers/labcontroller");
const { authenticate } = require("../middleware/auth");

router.post("/create", authenticate, createLabTest);
router.post("/upload-result", authenticate, uploadResult);
router.get("/patient/:patientId", authenticate, getPatientTests);
router.get("/lab/:labId", authenticate, getLabTests);
router.get("/:id", authenticate, getLabTestById);
router.patch("/:id/status", authenticate, updateTestStatus);

module.exports = router;
