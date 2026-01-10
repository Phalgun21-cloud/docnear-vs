const Appointment = require("../models/Appointment");
const { generateOtp } = require("../utils/otp");

exports.bookAppointment = async (req, res) => {
  const { patientId, doctorId } = req.body;

  await Appointment.create({
    patientId,
    doctorId
  });

  res.json({ message: "Appointment Requested" });
};

exports.acceptAppointment = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  const otp = generateOtp();

  appointment.status = "Accepted";
  appointment.otp = otp;
  await appointment.save();

  res.json({ otp });
};
