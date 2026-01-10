const router = require("express").Router();
const { bookAppointment, acceptAppointment } = require("../controllers/appointmentController");

router.post("/book", bookAppointment);
router.post("/accept/:id", acceptAppointment);

module.exports = router;
