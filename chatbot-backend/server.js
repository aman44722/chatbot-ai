const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const authRoutes = require('./routes/authRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const botRoutes = require('./routes/botRoutes');

dotenv.config();

const app = express();

// CORS
const allowedOrigins = [
    "http://localhost:3000",
    "https://chatbot-ai-frontend-chi.vercel.app",
];
if (process.env.ALLOWED_ORIGIN) {
    process.env.ALLOWED_ORIGIN.split(",").forEach(o => allowedOrigins.push(o.trim()));
}
app.use(cors({
    origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        cb(null, allowedOrigins.some(o => origin.startsWith(o.replace(/\/+$/, "")) || origin === o));
    },
    credentials: true,
}));

app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));

app.set("trust proxy", 1);
// Rate limiting
app.use("/api/", rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    skip: (req) => req.method === "OPTIONS",
    message: { message: "Too many requests" },
    validate: { trustProxy: false, xForwardedForHeader: false, default: true },
}));

// Middleware to ensure DB is connected before handling requests
app.use('/api', async (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        try {
            await connectDB();
        } catch {
            return res.status(503).json({ message: "Database connection unavailable" });
        }
    }
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/conversation', conversationRoutes);
app.use('/api/bots', botRoutes);

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

