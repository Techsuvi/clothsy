import Product from "@/models/Product";
import connectDb from "@/middleware/mongoose";

const handler = async (req, res) => {
  if (req.method === 'POST') {
    console.log(req);
    
    try {
      for (let i = 0; i < req.body.length; i++) {
        let p = new Product({
          title: req.body[i].title,
          slug: req.body[i].slug,
          desc: req.body[i].desc,
          img: req.body[i].img,
          category: req.body[i].category,
          size: req.body[i].size,
          color: req.body[i].color,
          price: req.body[i].price,
          availableQty: req.body[i].availableQty,
        });
        await p.save();
      }
      return res.status(200).json({ success: "Products added successfully" });
    } catch (error) {
      console.error("Error saving products:", error);
      return res.status(500).json({ error: "Error saving products" });
    }
  }

  // If not POST, allow only GET
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
