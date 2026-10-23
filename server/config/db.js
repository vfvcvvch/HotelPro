const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hotelpro';
    console.log(`[DB] Attempting connection to MongoDB at: ${mongoUri}`);
    
    // Set connection timeout to 4 seconds so startup doesn't hang if local mongo service isn't active
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000
    });

    isConnected = true;
    console.log(`[DB] MongoDB Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[DB Warning] MongoDB connection failed (${error.message}).`);
    console.warn(`[DB Notice] Running with in-memory / storage fallback mode so the application runs flawlessly!`);
    isConnected = false;
    return false;
  }
};

const getDBStatus = () => isConnected;

module.exports = { connectDB, getDBStatus };
