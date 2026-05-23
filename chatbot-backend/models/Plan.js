const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, default: 0 },
    limits: {
        chatbots: { type: Number, default: 1 },
        chatsPerMonth: { type: Number, default: 100 },
        waUserChatsPerMonth: { type: Number, default: 0 },
        liveAgents: { type: Number, default: 0 },
        languages: { type: Number, default: 1 },
    },
    features: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

const DEFAULT_PLANS = [
    {
        name: "Free",
        slug: "free",
        price: 0,
        limits: { chatbots: 1, chatsPerMonth: 100, waUserChatsPerMonth: 0, liveAgents: 0, languages: 1 },
        features: ["lead_generation", "customer_support"],
        sortOrder: 1,
    },
    {
        name: "Starter",
        slug: "starter",
        price: 29,
        limits: { chatbots: 3, chatsPerMonth: 1000, waUserChatsPerMonth: 0, liveAgents: 1, languages: 1 },
        features: [
            "lead_generation", "customer_support",
            "live_chat", "canned_responses",
            "analytics", "webhook_integrations", "google_sheets",
            "email_otp", "lead_notifications", "hot_lead_notifications", "auto_email_followup",
            "csv_export", "contacts_dashboard",
        ],
        sortOrder: 2,
    },
    {
        name: "Growth",
        slug: "growth",
        price: 79,
        limits: { chatbots: 10, chatsPerMonth: 5000, waUserChatsPerMonth: 1000, liveAgents: 3, languages: 2 },
        features: [
            "lead_generation", "customer_support",
            "live_chat", "canned_responses",
            "analytics", "template_message_analytics",
            "crm_standard", "webhook_integrations", "google_sheets",
            "email_otp", "lead_notifications", "hot_lead_notifications", "auto_email_followup",
            "multilingual", "ai_bot", "ai_speech", "voice_intent_mapping",
            "csv_export", "contacts_dashboard",
            "whatsapp_catalog", "whatsapp_ecommerce",
            "2fa", "lead_data_masking",
        ],
        sortOrder: 3,
    },
    {
        name: "Enterprise",
        slug: "enterprise",
        price: 199,
        limits: { chatbots: -1, chatsPerMonth: -1, waUserChatsPerMonth: -1, liveAgents: -1, languages: -1 },
        features: [
            "lead_generation", "customer_support",
            "live_chat", "canned_responses",
            "analytics", "template_message_analytics",
            "crm_standard", "webhook_integrations", "google_sheets",
            "email_otp", "lead_notifications", "hot_lead_notifications", "auto_email_followup",
            "multilingual", "ai_bot", "ai_speech", "voice_intent_mapping",
            "csv_export", "contacts_dashboard",
            "whatsapp_catalog", "whatsapp_ecommerce",
            "2fa", "lead_data_masking",
        ],
        sortOrder: 4,
    },
];

planSchema.statics.seedDefaults = async function () {
    for (const plan of DEFAULT_PLANS) {
        await this.findOneAndUpdate(
            { slug: plan.slug },
            { $setOnInsert: plan },
            { upsert: true, new: true }
        );
    }
};

const PlanModel = mongoose.model("Plan", planSchema);

PlanModel.seedDefaults().catch(() => {});

module.exports = PlanModel;
module.exports.DEFAULT_PLANS = DEFAULT_PLANS;
