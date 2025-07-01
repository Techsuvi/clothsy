import connectDb from "@/middleware/mongoose";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
  await connectDb();

  // 🔐 Check for JWT token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optional: Add admin check here using `decoded.role === 'admin'`
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  if (req.method === "GET") {
    try {
      const orders = await Order.find().sort({ createdAt: -1 }).lean();
      return res.status(200).json({ orders });
    } catch (err) {
      console.error("❌ Failed to fetch orders:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
};

export default handler;
