const Bot = require("../models/Bot");
const User = require("../models/User");

exports.createBot = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user.id;

        const bot = new Bot({
            userId,
            name: name || 'My Chatbot',
        });

        await bot.save();
        res.status(201).json({ message: "Bot created successfully", bot });
    } catch (error) {
        console.error("Error creating bot:", error);
        res.status(500).json({ message: "Failed to create bot" });
    }
};

exports.getBots = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        let bots;
        if (user.role === 'admin') {
            bots = await Bot.find().populate('userId', 'fullName email').sort({ createdAt: -1 });
        } else {
            bots = await Bot.find({ userId }).sort({ createdAt: -1 });
        }

        res.json(bots);
    } catch (error) {
        console.error("Error fetching bots:", error);
        res.status(500).json({ message: "Failed to fetch bots" });
    }
};

exports.getBot = async (req, res) => {
    try {
        const bot = await Bot.findById(req.params.id).populate('userId', 'fullName email');
        if (!bot) return res.status(404).json({ message: "Bot not found" });
        res.json(bot);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch bot" });
    }
};

exports.updateBot = async (req, res) => {
    try {
        const { name, status, botSettings, flowSetupSetting } = req.body;
        const bot = await Bot.findById(req.params.id);
        if (!bot) return res.status(404).json({ message: "Bot not found" });

        if (name) bot.name = name;
        if (status) bot.status = status;
        if (botSettings && typeof botSettings === 'object') {
            bot.botSettings = {
                ...bot.botSettings.toObject(),
                ...botSettings,
            };
        }
        if (flowSetupSetting?.question?.list && Array.isArray(flowSetupSetting.question.list)) {
            bot.flowSetupSetting = {
                ...bot.flowSetupSetting?.toObject?.() || {},
                question: { list: flowSetupSetting.question.list },
            };
        }

        await bot.save();
        res.json({ message: "Bot updated successfully", bot });
    } catch (error) {
        console.error("Error updating bot:", error);
        res.status(500).json({ message: "Failed to update bot" });
    }
};

exports.deleteBot = async (req, res) => {
    try {
        const bot = await Bot.findByIdAndDelete(req.params.id);
        if (!bot) return res.status(404).json({ message: "Bot not found" });
        res.json({ message: "Bot deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete bot" });
    }
};

exports.getBotSettings = async (req, res) => {
    try {
        const bot = await Bot.findById(req.params.id).select("botSettings defaultLanguage languagePrefStatement");
        if (!bot) return res.status(404).json({ message: "Bot not found" });
        const data = bot.botSettings ? bot.botSettings.toObject() : {};
        data.defaultLanguage = bot.defaultLanguage;
        data.languagePrefStatement = bot.languagePrefStatement;
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bot settings" });
    }
};

exports.getBotFlow = async (req, res) => {
    try {
        const bot = await Bot.findById(req.params.id).select("flowSetupSetting");
        if (!bot) return res.status(404).json({ message: "Bot not found" });
        res.json(bot.flowSetupSetting);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bot flow" });
    }
};

exports.getBotWhitelist = async (req, res) => {
    try {
        const bot = await Bot.findById(req.params.id).select("whitelist userId");
        if (!bot) return res.status(404).json({ message: "Bot not found" });
        if (String(bot.userId) !== req.user.id) return res.status(403).json({ message: "Forbidden" });
        res.json({ ok: true, whitelist: bot.whitelist || [] });
    } catch (error) {
        res.status(500).json({ message: "Error fetching whitelist" });
    }
};

exports.saveBotWhitelist = async (req, res) => {
    try {
        const { domains } = req.body;
        const list = Array.isArray(domains) ? domains : [];
        const clean = list
            .flatMap(d => String(d).split("\n"))
            .map(d => d.trim().toLowerCase().replace(/^https?:\/\//, '').split('/')[0])
            .filter(Boolean);
        const unique = [...new Set(clean)];

        const bot = await Bot.findById(req.params.id);
        if (!bot) return res.status(404).json({ message: "Bot not found" });
        if (String(bot.userId) !== req.user.id) return res.status(403).json({ message: "Forbidden" });

        bot.whitelist = unique;
        await bot.save();
        res.json({ ok: true, whitelist: bot.whitelist, count: bot.whitelist.length });
    } catch (error) {
        res.status(500).json({ message: "Error saving whitelist" });
    }
};

exports.getBotLanguage = async (req, res) => {
    try {
        const bot = await Bot.findById(req.params.id).select("defaultLanguage languagePrefStatement userId");
        if (!bot) return res.status(404).json({ message: "Bot not found" });
        if (String(bot.userId) !== req.user.id) return res.status(403).json({ message: "Forbidden" });
        res.json({ ok: true, language: bot.defaultLanguage, prefStatement: bot.languagePrefStatement });
    } catch (error) {
        res.status(500).json({ message: "Error fetching language settings" });
    }
};

exports.saveBotLanguage = async (req, res) => {
    try {
        const { language, prefStatement } = req.body;
        const bot = await Bot.findById(req.params.id);
        if (!bot) return res.status(404).json({ message: "Bot not found" });
        if (String(bot.userId) !== req.user.id) return res.status(403).json({ message: "Forbidden" });

        bot.defaultLanguage = language;
        bot.languagePrefStatement = prefStatement;
        await bot.save();

        res.json({ ok: true, language: bot.defaultLanguage, prefStatement: bot.languagePrefStatement });
    } catch (error) {
        res.status(500).json({ message: "Error saving language settings" });
    }
};
