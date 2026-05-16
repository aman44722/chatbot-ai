const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
    {
        sender: { type: String, enum: ["bot", "user"], required: true },
        text: { type: String, default: "" },
        questionId: { type: String, default: null },
    },
    { timestamps: true, _id: false }
);

const ConversationSchema = new mongoose.Schema(
    {
        chatbotId: { type: String, required: true, index: true },
        sessionId: { type: String, required: true },
        mode: { type: String, default: "flow" },
        status: { type: String, default: "active" },
        userName: { type: String, default: null },
        flow: { type: [mongoose.Schema.Types.Mixed], default: [] },
        messages: { type: [MessageSchema], default: [] },
    },
    { timestamps: true }
);

ConversationSchema.index({ chatbotId: 1, sessionId: 1 }, { unique: true });

module.exports = mongoose.model("Conversation", ConversationSchema);
