const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const authRoutes = require('./routes/authRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const botRoutes = require('./routes/botRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const planRoutes = require('./routes/planRoutes');

dotenv.config();

const app = express();

// CORS - simple string origin for Vercel compatibility
const allowedOrigins = [
    "http://localhost:3000",
    "https://chatbot-ai-frontend-chi.vercel.app",
];
if (process.env.ALLOWED_ORIGIN) {
    process.env.ALLOWED_ORIGIN.split(",").forEach(o => allowedOrigins.push(o.trim()));
}
const corsOptions = {
    origin: (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        for (const o of allowedOrigins) {
            if (origin.startsWith(o.replace(/\/+$/, ""))) return cb(null, true);
        }
        cb(null, true);
    },
    credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));

// Global error handler with CORS headers (prevents Vercel crashes)
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.set("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.set("Access-Control-Allow-Credentials", "true");
    res.status(500).json({ message: "Internal server error" });
});

// Middleware to ensure DB is connected before handling requests
app.use('/api', async (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        try {
            await connectDB();
        } catch (e) {
            console.error("DB connection failed:", e.message);
            return res.status(503).json({ message: "Database connection unavailable" });
        }
    }
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/conversation', conversationRoutes);
app.use('/api/bots', botRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/plans', planRoutes);

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

