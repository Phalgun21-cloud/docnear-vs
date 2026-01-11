const router = require("express").Router();
const { syncUser, getCurrentUser } = require("../controllers/clerkcontroller");
const { authenticate } = require("../middleware/auth");

router.post("/sync", authenticate, syncUser);
router.get("/me", authenticate, getCurrentUser);

module.exports = router;
