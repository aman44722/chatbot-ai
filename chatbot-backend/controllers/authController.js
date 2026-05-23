const User = require("../models/User");
const Bot = require("../models/Bot");
const Plan = require("../models/Plan");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
exports.registerUser = async (req, res) => {
    const { email, password, website, fullName, phone, countryCode, termsAccepted } = req.body;

    if (!email || !password || !website || !fullName || !phone || !countryCode || !termsAccepted) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: "Weak password format" });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "Email already registered" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const freePlan = await Plan.findOne({ slug: "free" });

        const newUser = new User({
            email,
            password: hashedPassword,
            website,
            fullName,
            phone,
            countryCode,
            termsAccepted,
            plan: freePlan ? freePlan._id : undefined,
            planLimits: freePlan ? freePlan.limits : undefined,
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.status(201).json({
            token,
            user: {
                _id: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName,
                role: newUser.role,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // ✅ Correct way: compare entered password with hashed one
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid password" });

        // ✅ Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        let planSlug = null;
        if (user.plan) {
            const plan = await Plan.findById(user.plan);
            planSlug = plan ? plan.slug : null;
        }

        res.status(200).json({
            token,
            user: {
                _id: user._id,
                email: user.email,
                fullName: user.fullName,
                website: user.website,
                phone: user.phone,
                role: user.role,
                plan: planSlug,
                planLimits: user.planLimits,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Login failed" });
    }
};

// Get Layout Settings (Bot Settings)
exports.getLayoutSettings = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Return the user's botSettings (layout settings)
        res.json(user.botSettings);
    } catch (err) {
        res.status(500).json({ message: "Error fetching layout settings" });
    }
};

exports.updateLayoutSettings = async (req, res) => {
    const {
        botSettings = {},
        flowSetupSetting = {},
        email,
        website,
        fullName,
        phone,
        countryCode,
        termsAccepted,
        gst,
    } = req.body;

    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (email) user.email = email;
        if (website) user.website = website;
        if (fullName) user.fullName = fullName;
        if (phone) user.phone = phone;
        if (countryCode) user.countryCode = countryCode;
        if (termsAccepted !== undefined) user.termsAccepted = termsAccepted;
        if (gst) user.gst = gst;
        if (botSettings && typeof botSettings === 'object') {
            user.botSettings = {
                ...user.botSettings.toObject(),
                ...botSettings,
            };
        }
        // Ensure flowSetupSetting.question.list is an array of objects (questions)
        if (
            flowSetupSetting?.question?.list &&
            Array.isArray(flowSetupSetting.question.list)
        ) {
            user.flowSetupSetting = {
                ...user.flowSetupSetting?.toObject?.() || {},
                question: {
                    list: flowSetupSetting.question.list, // Properly update the question list
                },
            };
        }
        await user.save();

        res.status(200).json({
            message: "User updated successfully",
            user,
        });
    } catch (err) {
        console.error("Error updating user:", err.message);
        res.status(500).json({ message: err.message || "Error updating user" });
    }
};


exports.deleteUserAccount = async (req, res) => {
    try {
        const userId = req.user.id || req.user.userId;
        if (!userId) return res.status(400).json({ message: "User ID not found in token" });

        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "Your account has been deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete account" });
    }
};

// Change Password
exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Both old and new passwords are required" });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({ message: "Weak password format" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(401).json({ message: "Old password is incorrect" });

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// // ----------------- NEW: Save Whitelisting URLs -----------------
// exports.saveWhitelistingUrls = async (req, res) => {
//     try {
//         const userId = req.user.id; // set by auth middleware
//         const domains = parseDomains(req.body?.domains);
//         if (!domains.length) {
//             return res.status(400).json({ message: "No valid domains" });
//         }
//         const user = await User.findByIdAndUpdate(
//             userId,
//             { $set: { whitelist: domains } },
//             { new: true }
//         );
//         if (!user) return res.status(404).json({ message: "User not found" });
//         res.json({ ok: true, whitelist: user.whitelist, count: user.whitelist.length });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Failed to save whitelist" });
//     }
// };

// // ----------------- NEW: Install Meta (do I have whitelist?) ----
// exports.getInstallMeta = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const user = await User.findById(userId, { whitelist: 1 });
//         if (!user) return res.status(404).json({ message: "User not found" });
//         res.json({ chatbotId: userId, hasWhitelist: Boolean(user.whitelist?.length) });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Failed to fetch install meta" });
//     }
// };

// // ----------------- NEW: Snippet (only if whitelist present) ----
// exports.getInstallSnippet = async (req, res) => {
//     try {
//         const userId = req.user.id;
//         const user = await User.findById(userId, { whitelist: 1 });
//         if (!user) return res.status(404).json({ message: "User not found" });
//         if (!user.whitelist?.length) {
//             return res.status(412).json({ hasWhitelist: false, message: "Whitelist is empty" });
//         }
//         res.json({
//             chatbotId: userId,
//             hasWhitelist: true,
//             snippet: buildSnippet(userId),
//             whitelist: user.whitelist
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Failed to fetch snippet" });
//     }
// };


// --- Whitelist + Install handlers ---
const url = require("url");

// normalize domains from string or array
function normalizeDomains(input) {
    const arr = Array.isArray(input)
        ? input
        : String(input || "")
            .split(/[\n,]/)
            .map(s => s.trim())
            .filter(Boolean);

    const clean = new Set();
    for (const raw of arr) {
        let host = raw;
        try {
            // ensure we can parse even if schema missing
            const u = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
            host = u.hostname.toLowerCase();
        } catch {
            // fallback: strip protocol-like junk
            host = raw.replace(/^\s*https?:\/\//i, "").split("/")[0].toLowerCase();
        }
        if (host) clean.add(host);
    }
    return Array.from(clean);
}

// POST /api/auth/settings/whitelist
exports.saveWhitelist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { domains } = req.body;
        const list = normalizeDomains(domains);
        if (!list.length) return res.status(400).json({ message: "No valid domains" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // ensure install object exists
        user.install = user.install || {};
        const existing = new Set(user.install.whitelist || []);
        list.forEach(d => existing.add(d));
        user.install.whitelist = Array.from(existing);

        // ensure chatbotId
        if (!user.install.chatbotId) user.install.chatbotId = String(user._id);
        await user.save();

        res.json({ ok: true, whitelist: user.install.whitelist, count: user.install.whitelist.length });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Failed to save whitelist" });
    }
};

// GET /api/auth/install/meta
exports.getInstallMeta = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        const hasWhitelist = (user.install?.whitelist?.length || 0) > 0;
        const bots = await Bot.find({ userId: req.user.id }).limit(1).lean();
        const chatbotId = bots[0]?._id || user.install?.chatbotId || String(user._id);
        res.json({ chatbotId, hasWhitelist });
    } catch (e) {
        res.status(500).json({ message: "Failed to fetch meta" });
    }
};

// GET /api/auth/install/snippet
exports.getInstallSnippet = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const whitelist = user.install?.whitelist || [];
        if (!whitelist.length) {
            return res.status(412).json({ hasWhitelist: false, message: "Whitelist empty" });
        }

        const bots = await Bot.find({ userId: req.user.id }).limit(1).lean();
        const chatbotId = bots[0]?._id || user.install?.chatbotId || String(user._id);

        const apiBase = process.env.API_BASE_URL || "http://localhost:5000/api/auth";
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
        const snippet = `<script>
window.A2BOT_CONFIG = { id: "${chatbotId}", api: "${apiBase}", origin: "${frontendUrl}" };
</script>
<script src="${frontendUrl}/widget.js" async></script>`;

        res.json({ hasWhitelist: true, snippet, whitelist });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Failed to build snippet" });
    }
};


// (optional) GET /api/auth/settings/whitelist to read back
exports.getWhitelist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({
            ok: true,
            whitelist: user.install?.whitelist || [],
            blacklist: user.install?.blacklist || []
        });
    } catch (e) {
        res.status(500).json({ message: "Failed to fetch whitelist" });
    }
};




