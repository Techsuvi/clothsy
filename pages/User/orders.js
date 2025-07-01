// pages/User/orders.js

import React, { useState, useEffect } from "react";
import { AiOutlineDownload } from "react-icons/ai";
import jsPDF from "jspdf";
import { parse, serialize } from "cookie";
import jwt from "jsonwebtoken";
import connectDb from "@/middleware/mongoose";
import Order from "@/models/Order";

const TAX_RATE = 0.18; // 18% GST

export default function OrdersPage({ orders = [], fromCache = false }) {
  const [filterDays, setFilterDays] = useState(90);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    if (fromCache) {
      alert("Showing cached orders due to server issue.");
    }
    const cutoff = new Date();
    cutoff.setDate(new Date().getDate() - filterDays);

    const filtered = orders.filter((o) => {
      const d = new Date(o.createdAt);
      return (
        d >= cutoff &&
        (o._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (o.cart || []).some((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          ))
      );
    });

    setFilteredOrders(filtered);
    setVisibleCount(5);
  }, [orders, filterDays, searchQuery, fromCache]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "text-green-600 bg-green-100";
      case "failed":
        return "text-red-600 bg-red-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const downloadInvoice = async (order) => {
    // Load logo
    const logoDataUrl = await fetch("/CLOTHSY.png")
      .then((r) => r.blob())
      .then(
        (blob) =>
          new Promise((res) => {
            const reader = new FileReader();
            reader.onload = () => res(reader.result);
            reader.readAsDataURL(blob);
          })
      );

    const doc = new jsPDF({ unit: "pt", format: "A4" });
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    const margin = 40;
    let y = margin;

    // Helper to write wrapped text
    const writeWrapped = (text, x, startY, maxWidth, lineHeight = 14) => {
      const lines = doc.splitTextToSize(text, maxWidth);
      lines.forEach((line, i) => {
        doc.text(line, x, startY + i * lineHeight);
      });
      return lines.length * lineHeight;
    };

    // Watermark
    doc.setFontSize(60).setTextColor(230);
    doc.text("CLOTHSY.COM", width / 2, height / 2, {
      align: "center",
      angle: 45,
    });
    doc.setTextColor(0);

    // Header
    doc.addImage(logoDataUrl, "PNG", margin, y, 100, 40);
    doc.setFont("helvetica", "bold").setFontSize(20);
    doc.text("INVOICE", width - margin, y + 30, { align: "right" });
    y += 60;

    // Invoice metadata
    doc.setFont("helvetica", "normal").setFontSize(10);
    doc.text(`Invoice No: ${order._id}`, margin, y);
    doc.text(
      `Date: ${new Date(order.createdAt).toLocaleString()}`,
      margin,
      y + 14
    );
    doc.text(`Status: ${order.status}`, margin, y + 28);
    doc.text(`Payment: Stripe`, margin, y + 42);

    // Shipping & Billing Address
    let addrY = y + 70;
    doc.setFont("helvetica", "bold").text("Shipping Address:", margin, addrY);
    doc.setFont("helvetica", "normal");
    addrY += 14;
    addrY += writeWrapped(order.address || "—", margin, addrY, width - 2 * margin);

    addrY += 10;
    doc.setFont("helvetica", "bold").text("Billing Address:", margin, addrY);
    doc.setFont("helvetica", "normal");
    addrY += 14;
    addrY += writeWrapped(
      order.billingAddress || order.address || "—",
      margin,
      addrY,
      width - 2 * margin
    );

    y = addrY + 10;

    // Table header
    const cols = [margin, 200, 300, 380, 450, 530];
    const headers = ["Product", "Size", "Color", "Qty", "Price", "Subtotal"];
    doc.setFont("helvetica", "bold").setFontSize(11);
    headers.forEach((h, i) => doc.text(h, cols[i], y));
    y += 14;
    doc.setLineWidth(0.5).line(margin, y, width - margin, y);
    y += 10;

    // Table rows & accumulate subtotal
    doc.setFont("helvetica", "normal").setFontSize(10);
    let subtotal = 0;
    order.cart.forEach((item) => {
      const lineTotal = item.qty * item.price;
      subtotal += lineTotal;

      // Wrap product name
      const nameLines = doc.splitTextToSize(item.name, cols[1] - cols[0] - 4);
      nameLines.forEach((line, idx) => {
        doc.text(line, cols[0], y + idx * 12);
      });

      // Other columns
      doc.text(item.size || "—", cols[1], y);
      doc.text(item.variant || "—", cols[2], y);
      doc.text(item.qty.toString(), cols[3], y, { align: "right" });
      doc.text(`₹${item.price.toFixed(2)}`, cols[4], y, { align: "right" });
      doc.text(`₹${lineTotal.toFixed(2)}`, cols[5], y, { align: "right" });

      // Advance y
      y += Math.max(nameLines.length * 12, 18);
      if (y > height - margin - 100) {
        doc.addPage();
        y = margin;
      }
    });

    // Tax & Grand Total
    const tax = subtotal * TAX_RATE;
    const grandTotal = subtotal + tax;
    y += 10;
    doc.setLineWidth(0.5).line(margin, y, width - margin, y);
    y += 20;
    doc.setFont("helvetica", "normal").text(
      `Subtotal: ₹${subtotal.toFixed(2)}`,
      cols[4],
      y,
      { align: "right" }
    );
    y += 14;
    doc.text(
      `Tax (${(TAX_RATE * 100).toFixed(0)}%): ₹${tax.toFixed(2)}`,
      cols[4],
      y,
      { align: "right" }
    );
    y += 14;
    doc.setFont("helvetica", "bold").text(
      `Grand Total: ₹${grandTotal.toFixed(2)}`,
      cols[4],
      y,
      { align: "right" }
    );

    // Footer
    y = height - margin;
    doc.setFont("helvetica", "normal").setFontSize(9);
    doc.text(
      "Thank you for shopping with CLOTHSY. For support, email support@clothsy.com",
      margin,
      y
    );

    doc.save(`invoice-${order._id}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">My Orders</h1>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex gap-2">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setFilterDays(d)}
              className={`px-3 py-1 rounded-full text-sm border ${
                filterDays === d
                  ? "bg-blue-600 text-white"
                  : "text-blue-600 border-blue-600"
              }`}
            >
              Last {d} days
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by Order ID or Product"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-3 py-2 rounded-md w-full md:w-72"
        />
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-500">No matching orders found.</p>
      ) : (
        filteredOrders.slice(0, visibleCount).map((o) => (
          <div
            key={o._id}
            className="border rounded-xl p-4 mb-4 shadow-sm bg-white"
          >
            <div className="flex justify-between items-center flex-wrap mb-3">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-semibold break-all">{o._id}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Amount</p>
                <p className="text-lg font-bold">
                  ₹{o.totalAmount.toFixed(2)}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span
                  className={`px-2 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                    o.status
                  )}`}
                >
                  {o.status}
                </span>
                <button
                  onClick={() => downloadInvoice(o)}
                  className="mt-2 text-sm text-green-600 hover:underline flex items-center gap-1"
                >
                  <AiOutlineDownload /> Download Invoice
                </button>
              </div>
            </div>

            <ul className="mt-2 text-sm list-disc pl-5 space-y-1 break-words">
              {(o.cart || []).map((item, i) => (
                <li key={i}>
                  <strong>{item.name}</strong> — {item.size} /{" "}
                  {item.variant} × {item.qty} — ₹{item.price.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}

      {visibleCount < filteredOrders.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setVisibleCount((v) => v + 5)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

// Server-side data fetching with cookie fallback and proper serialization
export async function getServerSideProps({ req, res }) {
  await connectDb();

  const COOKIE_KEY = "user_orders_cache";
  let orders = [];
  let fromCache = false;

  try {
    const cookies = parse(req.headers.cookie || "");
    const token = cookies.token;
    if (!token) throw new Error("No token");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const raw = await Order.find({ userId: decoded.id })
      .sort({ createdAt: -1 })
      .lean();

    // Convert ObjectIds & Dates to strings, strip nested _id
    orders = raw.map((o) => ({
      _id: o._id.toString(),
      userId: o.userId.toString(),
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
      totalAmount: o.totalAmount,
      status: o.status,
      address: o.address,
      billingAddress: o.billingAddress || "",
      cart: (o.cart || []).map((ci) => ({
        name: ci.name,
        size: ci.size,
        variant: ci.variant,
        price: ci.price,
        qty: ci.qty,
      })),
    }));

    // Cache into HttpOnly cookie
    const cookieVal = Buffer.from(JSON.stringify(orders)).toString("base64");
    res.setHeader(
      "Set-Cookie",
      serialize(COOKIE_KEY, cookieVal, {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
      })
    );
  } catch (err) {
    console.error("DB fetch error:", err);
    const cookies = parse(req.headers.cookie || "");
    if (cookies[COOKIE_KEY]) {
      try {
        orders = JSON.parse(
          Buffer.from(cookies[COOKIE_KEY], "base64").toString("utf8")
        );
        fromCache = true;
      } catch (pe) {
        console.error("Cookie parse error:", pe);
      }
    }
  }

  return {
    props: {
      orders,
      fromCache,
    },
  };
}
