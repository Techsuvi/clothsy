// pages/api/update-user.js

import connectDb from "@/middleware/mongoose";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  // Accept PUT (for profile updates)
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  await connectDb();

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { name, address, phone } = req.body;
    if (!name || !address || !phone) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, address, phone },
      { new: true, runValidators: true }
    ).select("-password");

    return res.status(200).json({ message: "User updated", user: updatedUser });
  } catch (err) {
    console.error("❌ Update user error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
