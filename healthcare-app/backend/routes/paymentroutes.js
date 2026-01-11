const router = require("express").Router();
const { processPayment, processEMIPayment, getPaymentHistory, getPaymentById } = require("../controllers/paymentcontroller");
const { authenticate } = require("../middleware/auth");

router.post("/process", authenticate, processPayment);
router.post("/emi", authenticate, processEMIPayment);
router.get("/history/:patientId", authenticate, getPaymentHistory);
router.get("/:id", authenticate, getPaymentById);

module.exports = router;
