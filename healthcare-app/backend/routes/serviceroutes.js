const router = require("express").Router();
const { getAllServices, getServiceById, createService } = require("../controllers/servicecontroller");
const { authenticate } = require("../middleware/auth");

router.get("/", getAllServices);
router.get("/:id", getServiceById);
router.post("/", authenticate, createService);

module.exports = router;
