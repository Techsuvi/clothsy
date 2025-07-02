// pages/api/upload-profile.js

import formidable from "formidable";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import connectDb from "@/middleware/mongoose";
import User from "@/models/User";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  await connectDb();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  const form = new formidable.IncomingForm();
  const uploadDir = path.join(process.cwd(), "/public/uploads");

  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  form.uploadDir = uploadDir;
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Error parsing file" });

    const file = files.image;
    const filename = path.basename(file[0].filepath);

    const imageUrl = `/uploads/${filename}`;
    user.image = imageUrl;
    await user.save();

    return res.status(200).json({ url: imageUrl });
  });
}
