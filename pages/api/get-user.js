// pages/api/get-user.js

import connectDb from "@/middleware/mongoose";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { parse } from "cookie";

export default async function handler(req, res) {
  try {
    await connectDb();

    const raw = req.headers.cookie || "";
    const { token } = parse(raw);

    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error("get-user error:", err);
    res.status(401).json({ error: "Invalid token or session expired" });
  }
}
