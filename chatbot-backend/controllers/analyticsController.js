const Conversation = require("../models/Conversation");
const Bot = require("../models/Bot");

exports.getOverview = async (req, res) => {
    try {
        const userBots = await Bot.find({ userId: req.user.id }).select("_id name").lean();
        const botIds = userBots.map(b => String(b._id));
        const botMap = Object.fromEntries(userBots.map(b => [String(b._id), b.name]));

        const botId = req.query.botId || null;
        const days = parseInt(req.query.days) || 7;
        const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        const matchFilter = { updatedAt: { $gte: since } };
        if (botId) {
            if (!botIds.includes(botId)) return res.status(403).json({ message: "Forbidden" });
            matchFilter.$or = [{ botId }, { chatbotId: botId }];
        } else {
            matchFilter.$or = [{ botId: { $in: botIds } }, { chatbotId: { $in: botIds } }];
        }

        const [totalConversations, totalMessages, statusCounts, dailyCounts, topUsers] = await Promise.all([
            Conversation.countDocuments(matchFilter),

            Conversation.aggregate([
                { $match: matchFilter },
                { $project: { msgCount: { $size: { $ifNull: ["$messages", []] } } } },
                { $group: { _id: null, total: { $sum: "$msgCount" } } },
            ]),

            Conversation.aggregate([
                { $match: matchFilter },
                { $group: { _id: "$status", count: { $sum: 1 } } },
            ]),

            Conversation.aggregate([
                { $match: matchFilter },
                { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } }, count: { $sum: 1 } } },
                { $sort: { _id: 1 } },
            ]),

            Conversation.aggregate([
                { $match: { ...matchFilter, userName: { $ne: null } } },
                { $project: { userName: 1, msgCount: { $size: { $ifNull: ["$messages", []] } } } },
                { $sort: { msgCount: -1 } },
                { $limit: 5 },
                { $project: { _id: 0, userName: 1, msgCount: 1 } },
            ]),
        ]);

        const statusMap = {};
        for (const s of statusCounts) statusMap[s._id] = s.count;

        const dailyLabels = [];
        const dailyValues = [];
        const dailyMap = {};
        for (const d of dailyCounts) dailyMap[d._id] = d.count;
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
            const key = d.toISOString().slice(0, 10);
            dailyLabels.push(key);
            dailyValues.push(dailyMap[key] || 0);
        }

        const msgTotal = totalMessages.length > 0 ? totalMessages[0].total : 0;

        res.json({
            totalConversations,
            totalMessages: msgTotal,
            statusBreakdown: statusMap,
            dailyConversations: { labels: dailyLabels, values: dailyValues },
            topUsers: topUsers.map(u => ({ name: u.userName, messages: u.msgCount })),
            botNames: botMap,
        });
    } catch (err) {
        console.error("Analytics error:", err);
        res.status(500).json({ message: "Failed to fetch analytics" });
    }
};
