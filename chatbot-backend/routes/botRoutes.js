const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const {
    createBot,
    getBots,
    getBot,
    updateBot,
    deleteBot,
    getBotSettings,
    getBotFlow,
    getBotWhitelist,
    saveBotWhitelist,
    getBotLanguage,
    saveBotLanguage,
} = require("../controllers/botController");

// Public — used by embedded widget to fetch bot settings
router.get("/:id/settings", getBotSettings);
router.get("/:id/flow", getBotFlow);

// Protected
router.post("/", authenticate, createBot);
router.get("/", authenticate, getBots);
router.get("/:id", authenticate, getBot);
router.put("/:id", authenticate, updateBot);
router.delete("/:id", authenticate, adminOnly, deleteBot);
router.get("/:id/whitelist", authenticate, getBotWhitelist);
router.post("/:id/whitelist", authenticate, saveBotWhitelist);
router.get("/:id/language", authenticate, getBotLanguage);
router.post("/:id/language", authenticate, saveBotLanguage);

module.exports = router;
