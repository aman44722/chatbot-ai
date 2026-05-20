const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const authRoutes = require('./routes/authRoutes');
const conversationRoutes = require('./routes/conversationRoutes');

dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || "*",
    credentials: true,
}));
app.use(express.json());

// ensure DB is connected before every request (safe for serverless cold starts)
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(500).json({ message: "Database connection failed" });
    }
});

app.use('/api/auth', authRoutes);
app.use('/api/conversation', conversationRoutes);

// Root route
app.get("/", (req, res) => {
    res.send("🚀 Chatbot Backend is running");
});

// Start server
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
}

module.exports = app;

