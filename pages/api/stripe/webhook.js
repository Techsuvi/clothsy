import Stripe from "stripe";
import { buffer } from "micro";
import connectDb from "@/middleware/mongoose";
import Order from "@/models/Order";

export const config = {
  api: {
    bodyParser: false, // Stripe needs the raw body
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let event;

  try {
    const rawBody = await buffer(req);
    const sig = req.headers["stripe-signature"];

    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET.trim()
    );
  } catch (err) {
    console.error("❌ Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ Connect to DB once before saving the order
  try {
    await connectDb();
  } catch (err) {
    return res.status(500).json({ error: "Database connection failed" });
  }

  // 🎯 Handle event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const cart = JSON.parse(session.metadata.cart || "[]");
    const order = new Order({
      userId: session.metadata.userId,
      email: session.customer_email,
      cart: Object.values(cart),
      totalAmount: parseInt(session.metadata.subTotal),
      status: "Paid",
      stripeSessionId: session.id,
      address: session.metadata.address,
    });

    try {
      await order.save();
      console.log("✅ Order saved to DB for", session.customer_email);
    } catch (error) {
      console.error("❌ Failed to save order:", error);
    }
  }

  res.status(200).json({ received: true });
}
