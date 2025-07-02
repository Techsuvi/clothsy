import connectDb from "@/middleware/mongoose";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await connectDb();

  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Only PUT allowed" });
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { userId, isActive } = req.body;
    if (!userId) return res.status(400).json({ error: "User ID missing" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.isActive = isActive;
    await user.save();

    return res.status(200).json({ success: true, message: `User ${isActive ? "activated" : "deactivated"}` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
