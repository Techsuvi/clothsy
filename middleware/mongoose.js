// middleware/mongoose.js

import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("⚠️ Please define the MONGO_URI environment variable");
}

// For getServerSideProps or similar
export const connectDb = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};

// For API routes (HOC)
const connectDbMiddleware = (handler) => async (req, res) => {
  if (mongoose.connection.readyState < 1) {
    try {
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (error) {
      console.error("❌ MongoDB connection error:", error);
      return res.status(500).json({ error: "Database connection failed" });
    }
  }
  return handler(req, res);
};

export default connectDbMiddleware;
