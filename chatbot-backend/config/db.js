const mongoose = require('mongoose');

let cached = global._mongoConn || null;

const connectDB = async () => {
    if (cached && mongoose.connection.readyState === 1) return cached;

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 30000,
        });
        cached = conn;
        global._mongoConn = conn;
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`❌ MongoDB connection error: ${error.message}`);
        cached = null;
        global._mongoConn = null;
        throw error;
    }
};

mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected');
    cached = null;
    global._mongoConn = null;
});

module.exports = connectDB;
