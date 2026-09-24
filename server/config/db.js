const mongoose = require('mongoose');
const dns = require('dns');
const dbStore = require('../utils/dbStore');

// Set public DNS fallback resolvers so SRV lookup for Atlas cluster works reliably on all ISPs/environments
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignore if custom DNS overrides are prohibited
}

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
