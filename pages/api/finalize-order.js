// pages/api/finalize-order.js

import Stripe from "stripe";
import connectDb from "@/middleware/mongoose";
import Order from "@/models/Order";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await connectDb();

  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: "Missing sessionId" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const { userId, email, address, subTotal, cart } = session.metadata || {};

    if (!userId || !email || !cart || !subTotal) {
      return res.status(400).json({ error: "Incomplete metadata from Stripe session" });
    }

    let cartItems;
    try {
      const parsed = JSON.parse(cart);
      cartItems = Object.values(parsed).map(item => ({
        slug: item.slug,
        name: item.name,
        size: item.size,
        variant: item.variant,
        price: Number(item.price),
        qty: Number(item.qty),
      }));
    } catch (err) {
      console.error("❌ Failed to parse cart JSON:", err);
      return res.status(400).json({ error: "Invalid cart data" });
    }

    const order = new Order({
      userId,
      email,
      address,
      cart: cartItems,
      totalAmount: parseFloat(subTotal),
      status: "Paid",
      stripeSessionId: session.id,
    });

    await order.save();

    return res.status(200).json({ success: true, orderId: order._id });
  } catch (err) {
    console.error("❌ Error saving order:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
