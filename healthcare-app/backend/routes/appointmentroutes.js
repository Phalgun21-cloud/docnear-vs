const router = require("express").Router();
const { 
  bookAppointment, 
  acceptAppointment, 
  getAppointments,
  getAppointmentById 
} = require("../controllers/appointmentcontroller");

router.get("/", getAppointments);
router.get("/:id", getAppointmentById);
router.post("/book", bookAppointment);
router.post("/accept/:id", acceptAppointment);

module.exports = router;
