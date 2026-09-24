const mongoose = require('mongoose');
const dbStore = require('../utils/dbStore');

const DEFAULT_MONGO_URI = 'mongodb+srv://ammu2009:2009@cluster0.qjtkz6v.mongodb.net/ammu_frame_store?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  const connStr = process.env.MONGO_URI || DEFAULT_MONGO_URI;
  
  try {
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`[MongoDB] Connected to host: ${conn.connection.host}`);
    dbStore.setMongoConnected(true);
  } catch (error) {
    console.warn(`[MongoDB Notice]: ${error.message}`);
    console.log('[MongoDB] Running with DBStore Fallback Engine');
    dbStore.setMongoConnected(false);
  }
};

module.exports = connectDB;
