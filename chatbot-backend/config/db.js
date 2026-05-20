// config/db.js
const mongoose = require('mongoose');

let cached = global._mongoConn || null;

const connectDB = async () => {
    if (cached && mongoose.connection.readyState === 1) return;

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        cached = conn;
        global._mongoConn = conn;
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB connection error: ${error.message}`);
        throw error; // let the request fail with 500, don't kill the process
    }
};

module.exports = connectDB;
