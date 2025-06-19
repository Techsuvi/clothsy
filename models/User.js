import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String }, // optional but required for OTP flow
  otpExpires: { type: Date }, // for OTP expiration check
}, { timestamps: true });

mongoose.models = {}
export default mongoose.model("User", UserSchema)
