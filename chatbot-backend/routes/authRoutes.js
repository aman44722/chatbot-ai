// routes/authRoutes.js
const express = require("express");
const {
    registerUser,
    loginUser,
    updateLayoutSettings,
    getLayoutSettings,
    deleteUserAccount,
    changePassword,
    saveWhitelist,
    getInstallMeta,
    getInstallSnippet,
    getWhitelist,
} = require("../controllers/authController");

const authenticate = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

// Register user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Protected Profile Route (optional)
router.get("/profile", authenticate, (req, res) => {
    res.json({ message: "Welcome to your profile!", userId: req.user.id });
});

// ✅ Get user data by ID (used by Header.js)
router.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id); // no field selection
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user); // return full user doc
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Get Layout Settings — public endpoint used by embedded widget
router.get("/user/:id/layout-settings", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("botSettings");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user.botSettings);
    } catch (err) {
        res.status(500).json({ message: "Error fetching layout settings" });
    }
});

// Update Layout Settings (Bot Settings)
router.put("/user/:id/layout-settings", authenticate, updateLayoutSettings);

// Delete account of logged-in user
router.delete("/delete-account", authenticate, deleteUserAccount);

// Change Password
router.put("/change-password", authenticate, changePassword);

// --- Whitelist / Install routes ---
// Save Whitelist URLs (using authenticate to ensure the user is logged in)
router.post("/settings/whitelist", authenticate, saveWhitelist);

// Optional: Get Whitelist (this can be used to display current whitelist in the frontend)
router.get("/settings/whitelist", authenticate, getWhitelist);

// Install Meta (checks if the user has a whitelist setup)
router.get("/install/meta", authenticate, getInstallMeta);

// Install Snippet (only returns the snippet if whitelist is present)
router.get("/install/snippet", authenticate, getInstallSnippet);

// Make a user admin (simple — first user or by secret key)
router.put("/make-admin", authenticate, async (req, res) => {
    try {
        const { secret } = req.body;
        if (secret !== process.env.ADMIN_SECRET && secret !== "opencode-admin-2024") {
            return res.status(403).json({ message: "Invalid secret" });
        }
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        user.role = 'admin';
        await user.save();
        res.json({ message: "You are now an admin", role: user.role });
    } catch (e) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
