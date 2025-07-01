// import connectDb from "@/middleware/mongoose";
// import bcrypt from "bcryptjs";
// import User from "@/models/User";

// const handler = async (req, res) => {
//   await connectDb();

//   const email = "skr264360@gmail.com";
//   const newPassword = "shubham123";

//   const hashedPassword = await bcrypt.hash(newPassword, 10);

//   const updatedUser = await User.findOneAndUpdate(
//     { email },
//     { password: hashedPassword }
//   );

//   if (updatedUser) {
//     res.status(200).json({ success: true, message: "Password reset successful" });
//   } else {
//     res.status(404).json({ success: false, message: "User not found" });
//   }
// };

// export default handler;
