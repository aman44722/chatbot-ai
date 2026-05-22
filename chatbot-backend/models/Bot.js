const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    id: { type: String, required: true },
    type: { type: String, required: true },
    required: { type: Boolean, default: false },
    text: { type: String, default: "" },
    flexDirection: { type: String, default: 'row' },
    media: { type: String, default: '' },
    options: { type: [mongoose.Schema.Types.Mixed], default: [] },
    skipOption: { type: Boolean, default: 'false' },
    errorMessage: { type: String, default: '' },
    validations: {
        minLength: { type: Number },
        maxLength: { type: Number },
        pattern: { type: String },
    },
    settings: {
        dateFormat: { type: String },
        range: {
            min: { type: Number },
            max: { type: Number },
        },
        uploadLimit: { type: Number },
        showTime: { type: Boolean },
        apiEndpoint: { type: String },
    },
    style: { type: String, default: 'button' },
    defaultSelected: { type: Number, default: null },
    shuffleOptions: { type: Boolean, default: false },
    otherOption: { type: Boolean, default: false },
    imageChoices: { type: [mongoose.Schema.Types.Mixed], default: [] },
    language: { type: String, default: "en" }
}, { _id: false });

const BotSettingsSchema = new mongoose.Schema({
    botName: { type: String, default: 'chatbot' },
    welcomeText: { type: String, default: 'Hey' },
    description: { type: String, default: 'Descriptions' },
    font: { type: String, default: 'Nanum Gothic Coding' },
    fontSize: { type: String, default: '14px' },
    companyLogo: { type: String, default: 'https://cdn-icons-png.flaticon.com/512/4712/4712027.png' },
    avatar: { type: String, default: null },
    botPosition: { type: String, default: 'right' },
    selectedBubbleStyle: { type: String, default: 'style1' },
    borderRadius: { type: Number, default: 10 },
    textAlign: { type: String, default: 'left' },
    themeColors: {
        header: { type: String, default: "#006C74" },
        question: { type: String, default: "#ffffff" },
        answer: { type: String, default: "#007bff" },
        option: { type: String, default: "#007bff" },
        optionBorder: { type: String, default: "#444c5c" },
        chatBackground: { type: String, default: "#ffffff" },
    },
    overlayOpacity: { type: Number, default: 0 },
    chatColor: {
        r: { type: Number, default: 255 },
        g: { type: Number, default: 255 },
        b: { type: Number, default: 255 },
        a: { type: Number, default: 1 },
    },
    uploadedImage: { type: String, default: null },
}, { _id: false });

const FlowSetupSettingSchema = new mongoose.Schema({
    question: {
        list: [QuestionSchema]
    }
}, { _id: false });

const botSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    botSettings: { type: BotSettingsSchema, default: () => ({}) },
    flowSetupSetting: { type: FlowSetupSettingSchema, default: () => ({}) },
    whitelist: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model("Bot", botSchema);
