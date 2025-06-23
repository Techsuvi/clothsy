import connectDb from "@/middleware/mongoose";
import { Resend } from "resend";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const resend = new Resend(process.env.RESEND_API_KEY);

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: "Clothsy <onboarding@resend.dev>", // Your verified sender
      to: [email],
      subject: "Clothsy Email Verification OTP",
      html: `
        <div style="font-family:Arial,sans-serif;">
          <h2>Hi ${name},</h2>
          <p>Thanks for signing up. Please verify your email using the OTP below:</p>
          <p style="font-size:24px;font-weight:bold;letter-spacing:2px;">${otp}</p>
          <p>This OTP is valid for 10 minutes.</p>
          <br>
          <p style="font-size:12px;color:#888;">— Team Clothsy</p>
        </div>
      `,
    });

    console.log("Resend response:", emailResponse);

    // ✅ Return the OTP to store in localStorage (frontend handles saving to DB after OTP verification)
    return res.status(200).json({ success: true, otp });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Failed to send OTP. Try again later." });
  }
};

export default connectDb(handler);
