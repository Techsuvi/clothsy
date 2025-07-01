import jwt from "jsonwebtoken";
import User from "@/models/User";
import connectDb from "@/middleware/mongoose";
import cookie from "cookie";

const handler = async (req, res) => {
  await connectDb();

  try {
    // Extract token from Authorization header or cookie
    let token = null;

    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.headers.cookie) {
      const cookies = cookie.parse(req.headers.cookie || "");
      token = cookies.token;
    }

    if (!token) {
      return res.status(401).json({ error: "Unauthorized. No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Fetch user
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error("❌ /api/me error:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

export default handler;
