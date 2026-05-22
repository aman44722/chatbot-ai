const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const compression = require("compression");
const authRoutes = require('./routes/authRoutes');
const conversationRoutes = require('./routes/conversationRoutes');

dotenv.config();

const app = express();

// CORS — allow frontend origins
app.use(cors({
    origin: (origin, cb) => cb(null, true),
    credentials: true,
}));

app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));

// Connect DB (don't crash serverless if unavailable)
connectDB().catch(() => {});

app.use('/api/auth', authRoutes);
app.use('/api/conversation', conversationRoutes);

app.get("/", (req, res) => {
    res.send("Chatbot Backend is running");
});

// Local dev only (Vercel uses serverless)
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
    const http = require("http");
    const { Server } = require("socket.io");
    const { setIO } = require("./socket");
    const server = http.createServer(app);
    const io = new Server(server, { cors: { origin: "*" } });
    setIO(io);
    io.on("connection", (socket) => {
        socket.on("join-conversation", ({ chatbotId, sessionId }) => socket.join(`${chatbotId}:${sessionId}`));
        socket.on("leave-conversation", ({ chatbotId, sessionId }) => socket.leave(`${chatbotId}:${sessionId}`));
    });
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;

