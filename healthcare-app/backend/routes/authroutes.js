const router = require("express").Router();
const { signup, verifyOtp, login } = require("../controllers/authcontroller");

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);

module.exports = router;