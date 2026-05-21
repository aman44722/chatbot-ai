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
    reopenConversation,
    getMessagesBySession,
} = require("../controllers/conversationController");

// Public — called by the embedded widget (must be before /:id to avoid route shadowing)
router.post("/init", initConversation);
router.post("/message", saveMessage);
router.post("/request-live", requestLiveAgent);
router.post("/reopen", reopenConversation);
router.get("/session/:chatbotId/:sessionId", getMessagesBySession);

// Protected — owner sees only their conversations
router.get("/list", authenticate, getConversations);
router.patch("/:id/status", authenticate, updateConversationStatus);
router.get("/:id", authenticate, getConversationById);

module.exports = router;
