const Plan = require("../models/Plan");

exports.getPlans = async (req, res) => {
    try {
        let plans = await Plan.find({ isActive: true }).sort({ sortOrder: 1 });
        if (plans.length === 0) {
            await Plan.seedDefaults();
            plans = await Plan.find({ isActive: true }).sort({ sortOrder: 1 });
        }
        res.json(plans);
    } catch (error) {
        res.status(500).json({ message: "Error fetching plans" });
    }
};

exports.getPlanBySlug = async (req, res) => {
    try {
        const plan = await Plan.findOne({ slug: req.params.slug, isActive: true });
        if (!plan) return res.status(404).json({ message: "Plan not found" });
        res.json(plan);
    } catch (error) {
        res.status(500).json({ message: "Error fetching plan" });
    }
};

exports.seedPlans = async (req, res) => {
    try {
        await Plan.seedDefaults();
        const plans = await Plan.find().sort({ sortOrder: 1 });
        res.json({ message: "Plans seeded", plans });
    } catch (error) {
        res.status(500).json({ message: "Error seeding plans" });
    }
};
