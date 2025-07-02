import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const SALT_WORK_FACTOR = 10;

// 🏠 Address schema (with default flag)
const AddressSchema = new mongoose.Schema(
  {
    name: String,
    address: String,
    phone: String,
    pin: String,
    city: String,
    stateName: String,
    isDefault: { type: Boolean, default: false }, // ✅ Default address flag
  },
  { _id: false }
);

// 🧠 Session/device info schema
const SessionSchema = new mongoose.Schema(
  {
    userAgent: String,         // e.g., "Mozilla/5.0 (Windows NT 10.0)"
    ipAddress: String,         // from req.headers or express middleware
    loginTime: { type: Date, default: Date.now },
  },
  { _id: false }
);

// 👤 User schema
const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    otp: { type: String },
    otpExpires: { type: Date },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    image: { type: String, default: "" },
    addresses: [AddressSchema],
    sessions: [SessionSchema], // ✅ Login session tracking
    isActive: { type: Boolean, default: true }, // ✅ Soft delete flag
  },
  { timestamps: true }
);

// 🔐 Hash password before save (only if changed)
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hashed = await bcrypt.hash(this.password, salt);
    this.password = hashed;
    next();
  } catch (err) {
    next(err);
  }
});

// 🔐 Compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
