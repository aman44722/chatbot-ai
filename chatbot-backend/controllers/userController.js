const User = require("../models/User");

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find({}, "-password").sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id, "-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user" });
    }
};

exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const validRoles = ["admin", "analyst", "supervisor", "agent", "user"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, select: "-password" }
        );
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Error updating user role" });
    }
};
