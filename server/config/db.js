const mongoose = require('mongoose');
const dbStore = require('../utils/dbStore');

const connectDB = async () => {
  const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ammu_frame_store';
  
  try {
    // Set 3 second connection timeout so fallback mode starts instantly if local Mongo isn't running
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[MongoDB] Connected to host: ${conn.connection.host}`);
    dbStore.setMongoConnected(true);
  } catch (error) {
    console.warn(`[MongoDB Notice]: ${error.message}`);
    console.log('[MongoDB] Running with DBStore Fallback Engine (Zero-Delay Instant Testing)');
    dbStore.setMongoConnected(false);
  }
};

module.exports = connectDB;
