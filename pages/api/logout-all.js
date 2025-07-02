import connectDb from "@/middleware/mongoose";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await connectDb();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.sessions = []; // Clear all session records
    await user.save();

    return res.status(200).json({ success: true, message: "Logged out from all sessions" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
