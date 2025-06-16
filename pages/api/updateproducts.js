import Product from "@/models/Product";
import connectDb from "@/middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      for (let i = 0; i < req.body.length; i++) {
        // Validate that _id exists
        if (!req.body[i]._id) {
          return res.status(400).json({ error: "Missing _id in request body" });
        }

        await Product.findByIdAndUpdate(req.body[i]._id, req.body[i], {
          new: true, // returns the updated document
          runValidators: true, // ensures schema validations are run
        });
      }

      return res.status(200).json({ success: "Products updated successfully" });
    } catch (error) {
      console.error("Error updating products:", error);
      return res.status(500).json({ error: "Error updating products" });
    }
  }

  else if (req.method === 'GET') {
    try {
      let products = await Product.find();
      return res.status(200).json({ products });
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  else {
    return res.status(400).json({ error: "This method is not allowed" });
  }
};

export default connectDb(handler);
