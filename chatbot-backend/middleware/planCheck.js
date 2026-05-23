const User = require("../models/User");
const Plan = require("../models/Plan");

const planCheck = (feature) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id).populate("plan");
            if (!user) return res.status(404).json({ message: "User not found" });

            const plan = user.plan;
            if (!plan) return res.status(403).json({ message: "No plan assigned" });

            if (plan.slug === "enterprise") return next();

            if (!plan.features.includes(feature)) {
                return res.status(403).json({
                    message: `Feature "${feature}" not available in your plan`,
                    upgrade: true,
                    plan: plan.slug,
                });
            }

            next();
        } catch (error) {
            res.status(500).json({ message: "Error checking plan" });
        }
    };
};

module.exports = planCheck;
