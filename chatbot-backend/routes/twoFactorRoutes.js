const express = require("express");
const router = express.Router();
const {
    generate2FA, verifyAndEnable2FA, disable2FA, get2FAStatus,
} = require("../controllers/twoFactorController");
const authenticate = require("../middleware/authMiddleware");

router.get("/status", authenticate, get2FAStatus);
router.post("/generate", authenticate, generate2FA);
router.post("/verify", authenticate, verifyAndEnable2FA);
router.post("/disable", authenticate, disable2FA);

module.exports = router;
