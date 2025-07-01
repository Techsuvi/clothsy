import connectDb from "@/middleware/mongoose";
import Product from "@/models/Product";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
  await connectDb();

  // ✅ Auth token check
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // OPTIONAL: If using isAdmin field in JWT/user
    // if (!decoded.isAdmin) return res.status(403).json({ error: "Admin only" });

    // 📦 GET: List all products
    if (req.method === "GET") {
      const products = await Product.find({}).sort({ createdAt: -1 });
      return res.status(200).json(products);
    }

    // ➕ POST: Add new product
    if (req.method === "POST") {
      const {
        title,
        slug,
        desc,
        price,
        category,
        size,
        color,
        availableQty,
        img,
      } = req.body;

      if (!title || !slug || !price || !category) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const existing = await Product.findOne({ slug });
      if (existing) {
        return res.status(409).json({ error: "Slug already exists" });
      }

      const newProduct = new Product({
        title,
        slug,
        desc,
        price,
        category,
        size,
        color,
        availableQty,
        img,
      });

      await newProduct.save();
      return res.status(201).json({ success: true, product: newProduct });
    }

    // ❌ Invalid method
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("❌ Admin API error:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default handler;
