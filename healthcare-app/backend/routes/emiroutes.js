const router = require("express").Router();
const { calculateEMI, createEMI, getPatientEMIs, getEMIById } = require("../controllers/emicontroller");
const { authenticate } = require("../middleware/auth");

router.post("/calculate", calculateEMI);
router.post("/create", authenticate, createEMI);
router.get("/patient/:patientId", authenticate, getPatientEMIs);
router.get("/:id", authenticate, getEMIById);

module.exports = router;
