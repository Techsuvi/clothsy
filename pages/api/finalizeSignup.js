import connectDb from "@/middleware/mongoose";
import User from "@/models/User";

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, password } = req.body;

  console.log("📨 Signup request received:", { name, email });
  console.log("🔐 Raw password before hashing:", password);

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = new User({
      name,
      email,
      password, // ❌ don't hash here — model will do it!
    });

    await user.save();

    console.log("✅ User created successfully:", user._id);
    return res.status(200).json({ success: true, message: 'User created successfully' });
  } catch (err) {
    console.error('❌ Error saving user:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default connectDb(handler);
