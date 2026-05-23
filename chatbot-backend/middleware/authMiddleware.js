const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) return res.status(401).json({ message: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        if (!userId) {
            return res.status(401).json({ message: "User ID not found in token" });
        }

        const user = await User.findById(userId).select("role email fullName plan");
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = { id: userId, role: user.role, email: user.email, fullName: user.fullName };
        req.userId = userId;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authenticate;
