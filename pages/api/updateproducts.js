import Product from "@/models/Product";
import connectDb from "@/middleware/mongoose";
import mongoose from "mongoose"; // ✅ Required for ObjectId check

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      for (let i = 0; i < req.body.length; i++) {
        const product = req.body[i];

        // ✅ Validate _id format
        if (!product._id || !mongoose.Types.ObjectId.isValid(product._id)) {
          console.warn(`Invalid or missing _id: ${product._id}`);
          continue; // Skip this iteration instead of breaking the loop
        }

        await Product.findByIdAndUpdate(product._id, product, {
          new: true,
          runValidators: true,
        });
      }

      return res.status(200).json({ success: "Products updated successfully" });
    } catch (error) {
      console.error("Error updating products:", error);
      return res.status(500).json({ error: "Error updating products" });
    }
  }

  // GET method - fetch products
  else if (req.method === 'GET') {
    try {
      let products = await Product.find();
      return res.status(200).json({ products });
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Invalid method
  else {
    return res.status(400).json({ error: "This method is not allowed" });
  }
};

export default connectDb(handler);
