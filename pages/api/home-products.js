import connect from "@/middleware/mongoose";
import Product from "@/models/Product";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method Not Allowed" });

  try {
    await connect(); // 🛠️ Fix: connect explicitly

    const categories = ["tshirts", "hoodies", "mugs"];
    const result = {};

    for (let category of categories) {
      result[category] = await Product.find({ category }).limit(6).lean();
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Home products fetch error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
