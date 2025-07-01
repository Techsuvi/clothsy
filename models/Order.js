// models/Order.js

import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
     name: { type: String, required: true },
        slug: { type: String, required: false },    // now optional
        size: { type: String, required: false },    // now optional
        variant: { type: String, required: false },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    email: { type: String, required: true, trim: true, lowercase: true },

    cart: {
      type: [cartItemSchema],
      validate: [(val) => val.length > 0, "Cart cannot be empty"],
    },

    totalAmount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Cancelled"],
      default: "Pending", // Or "Paid" if you're using finalize-order.js
    },

    stripeSessionId: { type: String, required: true, trim: true },

    address: { type: String, trim: true }, // full formatted address
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
