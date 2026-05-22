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

// CORS first
const allowedOrigins = [
    "http://localhost:3000",
    "https://chatbot-ai-frontend-chi.vercel.app",
];
if (process.env.ALLOWED_ORIGIN) {
    process.env.ALLOWED_ORIGIN.split(",").map(s => s.trim()).filter(Boolean).forEach(o => allowedOrigins.push(o));
}

app.use(cors({
    origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        const match = allowedOrigins.some(o => origin.startsWith(o.replace(/\/+$/, "")) || origin === o);
        cb(null, match || true);
    },
    credentials: true,
}));
app.options("*", cors());

app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));

// Rate limiting: 100 req/min per IP
app.use("/api/", rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    skip: (req) => req.method === "OPTIONS",
    message: { message: "Too many requests, please try again later." },
}));

// Connect DB (handle failure gracefully)
connectDB().catch(err => console.error("DB connection error:", err.message));

app.use('/api/auth', authRoutes);
app.use('/api/conversation', conversationRoutes);

app.get("/", (req, res) => {
    res.send("Chatbot Backend is running");
});

// Local dev only
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
    const http = require("http");
    const { Server } = require("socket.io");
    const { setIO } = require("./socket");
    const server = http.createServer(app);
    const io = new Server(server, { cors: { origin: "*" } });
    setIO(io);

    io.on("connection", (socket) => {
        socket.on("join-conversation", ({ chatbotId, sessionId }) => {
            socket.join(`${chatbotId}:${sessionId}`);
        });
        socket.on("leave-conversation", ({ chatbotId, sessionId }) => {
            socket.leave(`${chatbotId}:${sessionId}`);
        });
    });

    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;

