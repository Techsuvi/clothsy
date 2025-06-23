import connectDb from "@/middleware/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user with the hashed password
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    return res.status(200).json({ success: true, message: 'User created successfully' });
  } catch (err) {
    console.error('Error saving user:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default connectDb(handler);
