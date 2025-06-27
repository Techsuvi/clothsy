// middleware/mongoose.js

import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("⚠️ Please define the MONGO_URI environment variable in .env");
}

let isConnected = false;

// ✅ Common connection logic
const connectDb = async () => {
  if (isConnected || mongoose.connections[0].readyState) return;

  try {
    const db = await mongoose.connect(MONGO_URI, {
      dbName: "Clothsy",               // optional but useful
      serverSelectionTimeoutMS: 10000 // timeout after 10s
    });

    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};

// ✅ For getServerSideProps or pages
export { connectDb };

// ✅ For API routes
const connectDbMiddleware = (handler) => async (req, res) => {
  try {
    await connectDb(); // reuse same logic
    return handler(req, res);
  } catch (error) {
    return res.status(500).json({ error: "MongoDB connection failed" });
  }
};

export default connectDbMiddleware;
