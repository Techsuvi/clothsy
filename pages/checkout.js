"use client";

import React, { useState } from "react";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import { RiShoppingBag4Fill } from "react-icons/ri";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import "react-toastify/dist/ReactToastify.css";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Checkout = ({ cart, subTotal, addToCart, removeFromCart }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleAddToCart = (k, item) => {
    const slug = item.slug || k.split("-")[0];
    addToCart(slug, 1, item.price, item.name, item.size, item.variant);
    toast.success("Item added to cart!", { position: "top-right", autoClose: 1500 });
  };

  const handlePayment = async () => {
    const requiredFields = ["name", "email", "address", "phone", "city", "state", "pincode"];
    for (let id of requiredFields) {
      const val = document.getElementById(id)?.value;
      if (!val) {
        toast.error("Please fill all required fields.");
        document.getElementById(id).focus();
        return;
      }
    }

    const address = `
      ${document.getElementById("name").value},
      ${document.getElementById("address").value},
      ${document.getElementById("phone").value},
      ${document.getElementById("city").value},
      ${document.getElementById("state").value},
      ${document.getElementById("pincode").value}
    `.replace(/\s+/g, " ").trim();

    setLoading(true);

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cart,
          email,
          subTotal,
          address,
        }),
      });

      const data = await res.json();
      const stripe = await stripePromise;

      if (data.sessionId && stripe) {
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        toast.error("Stripe session failed to initialize.");
      }
    } catch (err) {
      console.error("❌ Stripe API error:", err);
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container px-2 sm:m-auto">
      <h1 className="font-bold text-3xl my-8 text-center">Checkout</h1>

      <h2 className="font-semibold text-xl">1. Delivery Details</h2>
      <div className="flex flex-wrap">
        <div className="px-2 w-1/2">
          <label className="text-sm text-gray-600">Name</label>
          <input id="name" required className="w-full border p-2 rounded" />
        </div>
        <div className="px-2 w-1/2">
          <label className="text-sm text-gray-600">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="px-2 w-full mt-4">
          <label className="text-sm text-gray-600">Address</label>
          <textarea id="address" required className="w-full border p-2 rounded"></textarea>
        </div>
        <div className="px-2 w-1/2 mt-4">
          <label className="text-sm text-gray-600">Phone</label>
          <input id="phone" required className="w-full border p-2 rounded" />
        </div>
        <div className="px-2 w-1/2 mt-4">
          <label className="text-sm text-gray-600">City</label>
          <input id="city" required className="w-full border p-2 rounded" />
        </div>
        <div className="px-2 w-1/2 mt-4">
          <label className="text-sm text-gray-600">State</label>
          <input id="state" required className="w-full border p-2 rounded" />
        </div>
        <div className="px-2 w-1/2 mt-4">
          <label className="text-sm text-gray-600">Pincode</label>
          <input id="pincode" required className="w-full border p-2 rounded" />
        </div>
      </div>

      <h2 className="font-semibold text-xl mt-8">2. Review Cart Items & Payment</h2>

      <div className="bg-blue-100 p-6 m-2">
        <ol className="list-decimal font-semibold">
          {Object.keys(cart).length === 0 && (
            <li className="my-5 text-base font-semibold list-none">Your Cart is Empty!</li>
          )}
          {Object.keys(cart).map((k) => {
            const item = cart[k];
            if (!item || item.qty === 0) return null;

            return (
              <li key={k}>
                <div className="flex justify-between my-3">
                  <div>{item.name} ({item.size}/{item.variant})</div>
                  <div className="flex items-center space-x-2">
                    <FaCircleMinus onClick={() => removeFromCart(k, 1)} className="cursor-pointer text-blue-500" />
                    <span>{item.qty}</span>
                    <FaCirclePlus onClick={() => handleAddToCart(k, item)} className="cursor-pointer text-blue-500" />
                  </div>
                  <div>₹{item.price * item.qty}</div>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="text-right font-bold text-lg mt-4">Subtotal: ₹{subTotal}</div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handlePayment}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded flex items-center gap-2"
          >
            <RiShoppingBag4Fill />
            {loading ? "Processing..." : `Pay ₹${subTotal}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
