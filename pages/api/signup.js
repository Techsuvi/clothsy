// pages/api/signup.js

import connectDb from "@/middleware/mongoose";
import { Resend } from "resend";
import dotenv from 'dotenv';

dotenv.config();
import User from "@/models/User";

const resend = new Resend(process.env.RESEND_API_KEY);

const handler = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    // ✅ Send email with OTP
    const emailResponse = await resend.emails.send({
      from: "Clothsy <noreply@clothsy.com>", // ✅ Use verified sender
      to: [email],
      subject: "Your OTP for Signup Clothsy",
      html: `<p>Hello ${name},</p><p>Your OTP is: <strong>${otp}</strong></p>`,
    });

    console.log("Resend response:", emailResponse);

    // ✅ Temporarily store in localStorage (on frontend)
    return res.status(200).json({ success: true, otp });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default connectDb(handler);
