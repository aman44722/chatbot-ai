const Conversation = require("../models/Conversation");

// GET /api/conversation/list  (authenticated — returns conversations for this user's chatbotId)
exports.getConversations = async (req, res) => {
    try {
        const chatbotId = req.user.id;
        const conversations = await Conversation.find({ chatbotId })
            .select("sessionId userName status updatedAt messages")
            .sort({ updatedAt: -1 });
        res.json({ conversations });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch conversations" });
    }
};

// GET /api/conversation/:id  (authenticated)
exports.getConversationById = async (req, res) => {
    try {
        const chatbotId = req.user.id;
        const conversation = await Conversation.findOne({ _id: req.params.id, chatbotId });
        if (!conversation) return res.status(404).json({ message: "Conversation not found" });
        res.json({ conversation });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch conversation" });
    }
};

// POST /api/conversation/init
exports.initConversation = async (req, res) => {
    const { chatbotId, sessionId, flow, userName } = req.body;
    console.log("📥 INIT called — chatbotId:", chatbotId, "| userName:", userName);

    let convo = await Conversation.findOne({ chatbotId, sessionId });

    if (!convo) {
        convo = await Conversation.create({
            chatbotId,
            sessionId,
            mode: "flow",
            status: "active",
            flow,
            messages: [],
            ...(userName ? { userName } : {}),
        });
        console.log("✅ Conversation created — userName saved:", convo.userName);
    } else if (userName && !convo.userName) {
        convo.userName = userName;
        await convo.save();
        console.log("✅ Existing conversation updated — userName:", convo.userName);
    } else {
        console.log("ℹ️ Conversation already exists — userName:", convo.userName);
    }

    res.json({ ok: true });
};


// PATCH /api/conversation/:id/status  (authenticated)
exports.updateConversationStatus = async (req, res) => {
    try {
        const chatbotId = req.user.id;
        const { status } = req.body;
        if (!["active", "closed", "live_requested"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        const convo = await Conversation.findOneAndUpdate(
            { _id: req.params.id, chatbotId },
            { status },
            { new: true }
        );
        if (!convo) return res.status(404).json({ message: "Conversation not found" });
        res.json({ ok: true, status: convo.status });
    } catch (err) {
        res.status(500).json({ message: "Failed to update status" });
    }
};

// POST /api/conversation/request-live  (public — called by widget)
exports.requestLiveAgent = async (req, res) => {
    const { chatbotId, sessionId } = req.body;
    try {
        const convo = await Conversation.findOneAndUpdate(
            { chatbotId, sessionId },
            { status: "live_requested" },
            { new: true }
        );
        if (!convo) return res.status(404).json({ ok: false, message: "Conversation not found" });
        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ message: "Failed to request live agent" });
    }
};

// POST /api/conversation/message
exports.saveMessage = async (req, res) => {
    const { chatbotId, sessionId, sender, text, questionId } = req.body;

    const convo = await Conversation.findOne({ chatbotId, sessionId });
    if (!convo) return res.status(404).json({ ok: false });

    convo.messages.push({ sender, text, questionId });

    // 🔥 USERNAME CAPTURE
    if (sender === "user" && questionId) {
        const q = convo.flow?.find(
            f => f.id === questionId && f.isUserName === true
        );

        if (q) {
            convo.userName = text;
            console.log("✅ USER NAME SET:", text);
        }
    }

    await convo.save();
    res.json({ ok: true });
};


