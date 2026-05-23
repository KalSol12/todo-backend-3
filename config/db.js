const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    
    if (!uri) {
      throw new Error("MONGO_URI is missing from environment variables.");
    }

    if (uri.includes("127.0.0.1") || uri.includes("localhost")) {
      console.warn("⚠️ Warning: Connecting to a local database. This will fail on Render.");
    }

    await mongoose.connect(uri);
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
