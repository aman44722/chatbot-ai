const Conversation = require("../models/Conversation");
const { getIO } = require("../socket");

// GET /api/conversation/list  (authenticated)
exports.getConversations = async (req, res) => {
    try {
        const filter = { chatbotId: req.user.id };
        if (req.query.botId) filter.botId = req.query.botId;
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
        const skip = (page - 1) * limit;

        const [conversations, total] = await Promise.all([
            Conversation.find(filter)
                .select("chatbotId botId sessionId userName status updatedAt messages")
                .sort({ updatedAt: -1 })
                .skip(skip)
                .limit(limit),
            Conversation.countDocuments(filter),
        ]);
        res.json({ conversations, total, page, limit, pages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch conversations" });
    }
};

// GET /api/conversation/:id  (authenticated)
exports.getConversationById = async (req, res) => {
    try {
        const filter = { _id: req.params.id, chatbotId: req.user.id };
        if (req.query.botId) filter.botId = req.query.botId;
        const conversation = await Conversation.findOne(filter);
        if (!conversation) return res.status(404).json({ message: "Conversation not found" });
        res.json({ conversation });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch conversation" });
    }
};

// POST /api/conversation/init
exports.initConversation = async (req, res) => {
    const { chatbotId, botId, sessionId, flow, userName } = req.body;
    console.log("📥 INIT called — chatbotId:", chatbotId, "| userName:", userName);

    let convo = await Conversation.findOne({ chatbotId, sessionId });

    if (!convo) {
        convo = await Conversation.create({
            chatbotId,
            botId: botId || undefined,
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

        const io = getIO();
        if (io) {
            io.to(`${convo.chatbotId}:${convo.sessionId}`).emit("status-updated", { chatbotId, sessionId: convo.sessionId, status });
        }

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

        const io = getIO();
        if (io) {
            io.emit("live-request", { chatbotId, sessionId });
        }

        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ message: "Failed to request live agent" });
    }
};

// POST /api/conversation/reopen  (public — called by widget)
exports.reopenConversation = async (req, res) => {
    const { chatbotId, sessionId } = req.body;
    try {
        const convo = await Conversation.findOneAndUpdate(
            { chatbotId, sessionId },
            { status: "active" },
            { new: true }
        );
        if (!convo) return res.status(404).json({ ok: false, message: "Conversation not found" });

        const io = getIO();
        if (io) {
            io.emit("reopen-conversation", { chatbotId, sessionId });
        }

        res.json({ ok: true });
    } catch (err) {
        res.status(500).json({ message: "Failed to reopen conversation" });
    }
};

// GET /api/conversation/session/:chatbotId/:sessionId  (public — widget polls this)
exports.getMessagesBySession = async (req, res) => {
    try {
        const { chatbotId, sessionId } = req.params;
        const convo = await Conversation.findOne({ chatbotId, sessionId })
            .select("messages status userName");
        if (!convo) return res.status(404).json({ ok: false });
        res.json({ ok: true, messages: convo.messages, status: convo.status });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch messages" });
    }
};

// POST /api/conversation/message
exports.saveMessage = async (req, res) => {
    const { chatbotId, botId, sessionId, sender, text, questionId } = req.body;

    let convo = await Conversation.findOne({ chatbotId, sessionId });
    if (!convo) return res.status(404).json({ ok: false });

    if (botId && !convo.botId) {
        convo.botId = botId;
    }

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

    const io = getIO();
    if (io) {
        io.to(`${chatbotId}:${sessionId}`).emit("message-update", { chatbotId, sessionId });
    }

    res.json({ ok: true });
};


