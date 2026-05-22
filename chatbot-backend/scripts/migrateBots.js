// One-time migration: create Bot documents for existing users
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const User = require("../models/User");
const Bot = require("../models/Bot");

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const users = await User.find({});
        let migrated = 0;

        for (const user of users) {
            const existingBot = await Bot.findOne({ userId: user._id });
            if (existingBot) {
                console.log(`Bot already exists for user ${user._id}, skipping`);
                continue;
            }

            const bot = new Bot({
                userId: user._id,
                name: `${user.fullName || user.email}'s Bot`,
                botSettings: user.botSettings || {},
                flowSetupSetting: user.flowSetupSetting || { question: { list: [] } },
            });

            await bot.save();
            migrated++;
            console.log(`Created bot for user ${user.email} (${user._id})`);
        }

        console.log(`Migration complete. ${migrated} bots created.`);
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

migrate();
