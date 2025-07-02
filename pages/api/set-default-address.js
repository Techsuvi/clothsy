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
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { index } = req.body;
    if (typeof index !== "number" || index < 0 || index >= user.addresses.length) {
      return res.status(400).json({ error: "Invalid address index" });
    }

    user.addresses.forEach((addr, i) => (addr.isDefault = i === index));
    await user.save();

    return res.status(200).json({ success: true, message: "Default address updated." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
