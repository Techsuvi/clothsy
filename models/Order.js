import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    email: { type: String, required: true },

    cart: [
      {
        slug: { type: String },
        name: { type: String },
        size: { type: String },
        variant: { type: String },
        price: { type: Number },
        qty: { type: Number },
      },
    ],

    totalAmount: { type: Number, required: true },
    status: { type: String, default: "Pending" },

    stripeSessionId: { type: String }, // more accurate for Checkout Sessions

    address: { type: String }, // storing full formatted address as a string

    // Optional: in future if you want to map this
    // shippingAddress: {
    //   line1: String,
    //   city: String,
    //   state: String,
    //   postal_code: String,
    // },

    // Optional: can be added if using Stripe Elements with billing
    // billingDetails: {
    //   name: String,
    //   phone: String,
    //   email: String,
    // },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
