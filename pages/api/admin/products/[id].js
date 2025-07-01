import connectDb from "@/middleware/mongoose";
import Product from "@/models/Product";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
  await connectDb();

  const { id } = req.query;

  // ✅ Authenticate admin using JWT
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Optional: add admin check here if needed
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }

  if (req.method === "GET") {
    try {
      const product = await Product.findById(id).lean();
      if (!product) return res.status(404).json({ error: "Product not found" });
      return res.status(200).json(product);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch product" });
    }
  }

  if (req.method === "PUT") {
    try {
      const update = req.body;
      const product = await Product.findByIdAndUpdate(id, update, { new: true });
      if (!product) return res.status(404).json({ error: "Product not found" });
      return res.status(200).json({ success: true, message: "Product updated", product });
    } catch (err) {
      console.error("Update error:", err);
      return res.status(500).json({ error: "Failed to update product" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await Product.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: "Product deleted" });
    } catch (err) {
      return res.status(500).json({ error: "Failed to delete product" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
};

export default handler;
