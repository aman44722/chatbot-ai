const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const authRoutes = require('./routes/authRoutes');
const conversationRoutes = require('./routes/conversationRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || "*",
    credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/conversation', conversationRoutes);

// Root route
app.get("/", (req, res) => {
    res.send("🚀 Chatbot Backend is running");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));


