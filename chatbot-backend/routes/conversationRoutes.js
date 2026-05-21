const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const {
    getConversations,
    getConversationById,
    initConversation,
    saveMessage,
    updateConversationStatus,
    requestLiveAgent,
    getMessagesBySession,
} = require("../controllers/conversationController");

// Protected — owner sees only their conversations
router.get("/list", authenticate, getConversations);
router.get("/:id", authenticate, getConversationById);
router.patch("/:id/status", authenticate, updateConversationStatus);

// Public — called by the embedded widget
router.post("/init", initConversation);
router.post("/message", saveMessage);
router.post("/request-live", requestLiveAgent);
router.get("/session/:chatbotId/:sessionId", getMessagesBySession);

module.exports = router;
