import Stripe from "stripe";
import jwt from "jsonwebtoken";
import connectDb from "@/middleware/mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  await connectDb();

  try {
    const { cart, email, address, subTotal } = req.body;

    if (!cart || Object.keys(cart).length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid token" });
    }

    const token = authHeader.split(" ")[1];

    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (err) {
      console.error("JWT verification failed:", err);
      return res.status(401).json({ error: "Invalid token" });
    }

    // Prepare Stripe line items
    const cartItems = Object.values(cart);
    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: `${item.name} (${item.size}/${item.variant})`,
        },
        unit_amount: Math.round(item.price * 100), // Must be an integer
      },
      quantity: item.qty,
    }));

    // Backend subtotal verification
    const calculatedTotal = cartItems.reduce(
      (acc, item) => acc + item.qty * item.price,
      0
    );

    if (Math.round(calculatedTotal * 100) !== Math.round(subTotal * 100)) {
      return res.status(400).json({ error: "Subtotal mismatch. Please refresh and try again." });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items,
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/checkout`,
      metadata: {
        userId,
        email,
        address,
        subTotal: subTotal.toString(),
        cart: JSON.stringify(cart), // Needed in webhook to save order
      },
    });

    console.log(`✅ Stripe session created: ${session.id}`);
    return res.status(200).json({ sessionId: session.id });
  } catch (err) {
    console.error("❌ Stripe Checkout Error:", err.message, err.stack);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
