import connectDb from "@/middleware/mongoose";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await connectDb();

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Only admin allowed
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const users = await User.find({}, "email name sessions").lean();

    const sessionData = users.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      sessions: [...(user.sessions || [])].sort(
        (a, b) => new Date(b.loginTime) - new Date(a.loginTime)
      ),
    }));

    return res.status(200).json({ success: true, users: sessionData });
  } catch (err) {
    console.error("🔒 Admin session log fetch error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
