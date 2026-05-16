const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const {
    getConversations,
    getConversationById,
    initConversation,
    saveMessage,
} = require("../controllers/conversationController");

// Protected — owner sees only their conversations
router.get("/list", authenticate, getConversations);
router.get("/:id", authenticate, getConversationById);

// Public — called by the embedded widget
router.post("/init", initConversation);
router.post("/message", saveMessage);

module.exports = router;
