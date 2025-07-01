import mongoose from "mongoose";

export default async function handler(req, res) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    return res.status(200).json({ message: "✅ Connected to MongoDB" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
