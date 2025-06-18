import Product from "@/models/Product";
import connectDb from "@/middleware/mongoose";

const handler = async (req, res) => {
  try {
    let products = await Product.find();
    let tshirts = {};

    for (let item of products) {
      if (item.availableQty <= 0) continue; // Skip out-of-stock items

      if (tshirts[item.title]) {
        // Only push unique colors
        if (!tshirts[item.title].color.includes(item.color)) {
          tshirts[item.title].color.push(item.color);
        }

        // Only push unique sizes
        if (!tshirts[item.title].size.includes(item.size)) {
          tshirts[item.title].size.push(item.size);
        }
      } else {
        // Create new entry with basic data
        tshirts[item.title] = {
          _id: item._id,
          title: item.title,
          slug: item.slug,
          desc: item.desc,
          img: item.img,
          category: item.category,
          price: item.price,
          color: [item.color],
          size: [item.size],
        };
      }
    }

    res.status(200).json({ tshirts });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default connectDb(handler);
