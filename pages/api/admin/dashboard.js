import connectDb from "@/middleware/mongoose";
import Order from "@/models/Order";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  await connectDb();

  // 🔐 Extract token from Bearer header
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    // ✅ Decode and verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🛡️ Optional: restrict to admin only (based on your schema)
    const user = await User.findById(decoded.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }

    // 📊 Fetch all orders and users
    const orders = await Order.find().lean();
    const totalUsers = await User.countDocuments();
    const totalOrders = orders.length;

    // 📈 Calculate revenue + monthly stats
    let totalRevenue = 0;
    const monthlyRevenue = Array(12).fill(0);
    const monthlyOrders = Array(12).fill(0);

    for (const order of orders) {
      const month = new Date(order.createdAt).getMonth();

      if (order.status === "Paid") {
        totalRevenue += order.totalAmount;
        monthlyRevenue[month] += order.totalAmount;
      }

      monthlyOrders[month] += 1;
    }

    return res.status(200).json({
      totalRevenue,
      totalOrders,
      totalUsers,
      monthlyRevenue,
      monthlyOrders,
    });
  } catch (err) {
    console.error("❌ JWT validation error:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
