"use client";

import React, { useEffect, useState } from "react";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import { RiShoppingBag4Fill } from "react-icons/ri";
import { toast, ToastContainer, Bounce } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import "react-toastify/dist/ReactToastify.css";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Checkout = ({ cart, subTotal, addToCart, removeFromCart }) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [service, setService] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("checkoutData"));
    if (data) {
      setName(data.name || "");
      setEmail(data.email || "");
      setAddress(data.address || "");
      setPhone(data.phone || "");
      setPin(data.pin || "");
      setCity(data.city || "");
      setStateName(data.stateName || "");
    }
    const list = JSON.parse(localStorage.getItem("savedAddresses")) || [];
    setSavedAddresses(list);
  }, []);

  useEffect(() => {
    if (pin.length === 6) checkServicability(pin);
  }, [pin]);

  const cacheForm = () => {
    const data = { name, email, address, phone, pin, city, stateName };
    localStorage.setItem("checkoutData", JSON.stringify(data));
  };

  const checkServicability = async (enteredPin) => {
    if (!/^[0-9]{6}$/.test(enteredPin)) {
      toast.warn("Enter valid 6-digit pincode", { autoClose: 2500 });
      return;
    }
    try {
      const res = await fetch("/api/pincode");
      const data = await res.json();
      const pinData = data[enteredPin];
      if (pinData) {
        setService(true);
        setCity(pinData.city);
        setStateName(pinData.state);
        toast.success(`Delivery available to ${pinData.city}, ${pinData.state}`, { autoClose: 2500 });
      } else {
        setService(false);
        setCity("");
        setStateName("");
        toast.error("We don't deliver here", { autoClose: 2500 });
      }
    } catch (err) {
      console.error(err);
      toast.error("Error checking pincode", { autoClose: 2500 });
    }
  };

  const applySavedAddress = (i) => {
    const addr = savedAddresses[i];
    if (addr) {
      setName(addr.name);
      setEmail(addr.email);
      setAddress(addr.address);
      setPhone(addr.phone);
      setPin(addr.pin);
      setCity(addr.city);
      setStateName(addr.stateName);
      setService(true);
    }
  };

  const saveThisAddress = () => {
    const entry = { name, email, address, phone, pin, city, stateName };
    const list = [...savedAddresses, entry];
    localStorage.setItem("savedAddresses", JSON.stringify(list));
    setSavedAddresses(list);
    toast.success("Address saved!", { autoClose: 2000 });
  };

  const handlePayment = async () => {
    if ([name, email, address, phone, pin, city, stateName].some((v) => !v)) {
      toast.error("Please fill in all fields.");
      return;
    }
    cacheForm();
    setLoading(true);
    const fullAddress = `${name}, ${address}, ${phone}, ${city}, ${stateName}, ${pin}`.replace(/\s+/g, " ").trim();
    try {
      let token = null;
      if (typeof document !== "undefined") {
        token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];
      }
      console.log("🧪 Extracted token:", token);

      console.log("🧪 Extracted token:", token);

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cart, email, subTotal, address: fullAddress }),
      });
      const data = await res.json();
      const stripe = await stripePromise;
      if (data.sessionId && stripe) await stripe.redirectToCheckout({ sessionId: data.sessionId });
      else toast.error("Stripe session initialization failed");
    } catch (err) {
      console.error(err);
      toast.error("Payment error, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container px-2 sm:m-auto">
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />

      <h1 className="font-bold text-3xl my-8 text-center">Checkout</h1>

      <h2 className="font-semibold text-xl">1. Delivery Details</h2>
      {savedAddresses.length > 0 && (
        <div className="mb-4 flex items-center">
          <label className="text-sm font-medium">Saved Address:</label>
          <select className="border ml-2 p-2 rounded" onChange={(e) => applySavedAddress(e.target.value)}>
            <option value="">Choose</option>
            {savedAddresses.map((a, idx) => (
              <option key={idx} value={idx}>
                {`${a.name}, ${a.city}, ${a.stateName}`}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-wrap">
        <div className="px-2 w-1/2">
          <label className="text-sm text-gray-600">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div className="px-2 w-1/2">
          <label className="text-sm text-gray-600">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div className="px-2 w-full mt-4">
          <label className="text-sm text-gray-600">Address</label>
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div className="px-2 w-1/2 mt-4">
          <label className="text-sm text-gray-600">Phone</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div className="px-2 w-1/2 mt-4">
          <label className="text-sm text-gray-600">Pincode</label>
          <input
            value={pin}
            maxLength={6}
            onChange={(e) => {
              setPin(e.target.value);
              setService(null);
            }}
            className="w-full border p-2 rounded"
          />
          {service === true && <p className="text-green-600 text-sm">✅ Deliverable</p>}
          {service === false && <p className="text-red-600 text-sm">❌ Not deliverable</p>}
        </div>
        <div className="px-2 w-1/2 mt-4">
          <label className="text-sm text-gray-600">City</label>
          <input value={city} onChange={(e) => setCity(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div className="px-2 w-1/2 mt-4">
          <label className="text-sm text-gray-600">State</label>
          <input value={stateName} onChange={(e) => setStateName(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div className="px-2 w-full mt-4">
          <button onClick={saveThisAddress} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Save This Address
          </button>
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
            if (!item || !item.qty) return null;
            return (
              <li key={k}>
                <div className="flex justify-between my-3">
                  <div>
                    {item.name} ({item.size}/{item.variant})
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaCircleMinus onClick={() => removeFromCart(k, 1)} className="cursor-pointer text-blue-500" />
                    <span>{item.qty}</span>
                    <FaCirclePlus onClick={() => addToCart(item.slug, 1, item.price, item.name, item.size, item.variant)} className="cursor-pointer text-blue-500" />
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
