// pages/api/admin/invoice/[id].js
import connectDb from "@/middleware/mongoose";
import Order from "@/models/Order";
import jwt from "jsonwebtoken";
import { generateInvoicePDF } from "@/utils/generateInvoicePDF";

export default async function handler(req, res) {
  await connectDb();

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const order = await Order.findById(id).lean();
    if (!order) return res.status(404).json({ error: "Order not found" });

    generateInvoicePDF(res, order); // same logic used in user invoice
  } catch (err) {
    console.error("Invoice Error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
