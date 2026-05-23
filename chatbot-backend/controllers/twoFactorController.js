const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const User = require("../models/User");

exports.generate2FA = async (req, res) => {
    try {
        const secret = speakeasy.generateSecret({ name: `BotForge (${req.user.email})` });
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { "twoFactor.secret": secret.base32 },
            { new: true }
        );
        const qrUrl = await qrcode.toDataURL(secret.otpauth_url);
        res.json({ secret: secret.base32, qrUrl });
    } catch (error) {
        res.status(500).json({ message: "Error generating 2FA secret" });
    }
};

exports.verifyAndEnable2FA = async (req, res) => {
    try {
        const { token } = req.body;
        const user = await User.findById(req.user.id);
        if (!user || !user.twoFactor.secret) {
            return res.status(400).json({ message: "2FA not initialized" });
        }
        const verified = speakeasy.totp.verify({
            secret: user.twoFactor.secret,
            encoding: "base32",
            token,
        });
        if (!verified) {
            return res.status(400).json({ message: "Invalid token" });
        }
        user.twoFactor.enabled = true;
        await user.save();
        res.json({ enabled: true, message: "2FA enabled successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error enabling 2FA" });
    }
};

exports.disable2FA = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            "twoFactor.enabled": false,
            "twoFactor.secret": null,
        });
        res.json({ enabled: false, message: "2FA disabled" });
    } catch (error) {
        res.status(500).json({ message: "Error disabling 2FA" });
    }
};

exports.get2FAStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("twoFactor");
        res.json({ enabled: user?.twoFactor?.enabled || false });
    } catch (error) {
        res.status(500).json({ message: "Error fetching 2FA status" });
    }
};
