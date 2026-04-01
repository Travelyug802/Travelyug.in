'use strict';
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000
    });
    console.log(`✅  MongoDB: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error(`❌  MongoDB connection failed: ${err.message}`);
    console.error('    → Make sure MongoDB is running:  mongod');
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => console.warn('⚠️  MongoDB disconnected'));
module.exports = connectDB;
