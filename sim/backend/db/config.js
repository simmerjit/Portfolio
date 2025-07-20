// /db/connection.js
const mongoose = require('mongoose');
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('🟢MongoDB connected');
  } catch (err) {
    console.error(err.message);
    console.log("🔴")
    process.exit(1);
  }

};

module.exports = connectDB;
