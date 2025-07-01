// pages/api/login.js
import connectDb from "@/middleware/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const handler = async (req, res) => {
  await connectDb();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  console.log("🔐 Login attempt:", { email });

  if (!email || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  try {
    const user = await User.findOne({ email });
    console.log("🧑 User from DB:", user);

    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("🔐 Raw password at login:", password);
    console.log("🔐 Hashed password from DB:", user.password);

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log(`🔍 Password match for ${email}:`, passwordMatch);

    if (!passwordMatch) {
      console.log("❌ Password mismatch");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET missing in env");
      return res.status(500).json({ error: "JWT secret missing" });
    }

    // Sign the JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role || "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Optionally set as cookie as well
    res.setHeader(
      "Set-Cookie",
      serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      })
    );

    console.log("✅ Login successful, token generated");

    // Return the token in the response body
    return res.status(200).json({ success: true, token });
  } catch (err) {
    console.error("🔥 Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default connectDb(handler);
