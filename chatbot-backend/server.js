const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const authRoutes = require('./routes/authRoutes');
const conversationRoutes = require('./routes/conversationRoutes');

dotenv.config();

const app = express();

// CORS first — handle preflight before any other middleware
const allowedOrigins = process.env.ALLOWED_ORIGIN
    ? process.env.ALLOWED_ORIGIN.split(",").map(s => s.trim()).filter(Boolean)
    : ["http://localhost:3000", "https://chatbot-ai-frontend-chi.vercel.app"];

const corsOptions = {
    origin: (origin, cb) => {
        if (!origin || allowedOrigins.some(o => origin.replace(/\/+$/, "").startsWith(o.replace(/\/+$/, "")) || allowedOrigins.some(o => o === origin))) {
            cb(null, true);
        } else {
            cb(null, true);
        }
    },
    credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));

// Rate limiting: 100 requests per minute per IP (skip preflight)
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.method === "OPTIONS",
    message: { message: "Too many requests, please try again later." },
});
app.use("/api/", limiter);

// Connect DB once at startup
connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/conversation', conversationRoutes);

// Root route
app.get("/", (req, res) => {
    res.send("Chatbot Backend is running");
});

// Start server (local dev only; Vercel uses serverless)
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
    const http = require("http");
    const { Server } = require("socket.io");
    const { setIO } = require("./socket");
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: { origin: process.env.ALLOWED_ORIGIN || "*", methods: ["GET", "POST"] },
    });
    setIO(io);

    io.on("connection", (socket) => {
        socket.on("join-conversation", ({ chatbotId, sessionId }) => {
            const room = `${chatbotId}:${sessionId}`;
            socket.join(room);
        });
        socket.on("leave-conversation", ({ chatbotId, sessionId }) => {
            const room = `${chatbotId}:${sessionId}`;
            socket.leave(room);
        });
    });

    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;

