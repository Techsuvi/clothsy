// utils/generateInvoicePDF.js

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Generate and download invoice PDF for an order
 * @param {Object} order - Order data object
 */
export const generateInvoicePDF = (order) => {
  const doc = new jsPDF();

  // Watermark
  doc.setTextColor(220);
  doc.setFontSize(40);
  doc.text("CLOTHSY", 35, 140, { angle: 45 });

  // Reset for content
  doc.setTextColor(0);
  doc.setFontSize(18);
  doc.text("INVOICE", 15, 20);

  // Header Info
  doc.setFontSize(12);
  doc.text(`Order ID: ${order._id || "N/A"}`, 15, 30);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 15, 36);
  doc.text(`Email: ${order.email || "N/A"}`, 15, 42);

  // Address formatter
  const formatAddress = (addr) => {
    if (!addr || typeof addr !== "object") return ["N/A"];
    const lines = [];
    if (addr.name) lines.push(addr.name);
    if (addr.address) lines.push(addr.address);
    const cityStatePin = [addr.city, addr.state, addr.pincode]
      .filter(Boolean)
      .join(", ");
    if (cityStatePin) lines.push(cityStatePin);
    if (addr.phone) lines.push(`Phone: ${addr.phone}`);
    return lines.length > 0 ? lines : ["N/A"];
  };

  let y = 50;

  // Shipping Address
  doc.setFont("helvetica", "bold");
  doc.text("Shipping Address:", 15, y);
  doc.setFont("helvetica", "normal");
  const shippingLines = formatAddress(order.shippingAddress);
  doc.text(shippingLines, 15, y + 6);
  y += shippingLines.length * 6 + 10;

  // Billing Address
  doc.setFont("helvetica", "bold");
  doc.text("Billing Address:", 15, y);
  doc.setFont("helvetica", "normal");
  const billingLines = formatAddress(order.billingAddress);
  doc.text(billingLines, 15, y + 6);
  y += billingLines.length * 6 + 10;

  // Items
  let itemRows = [];

  if (Array.isArray(order.items) && order.items.length > 0) {
    itemRows = order.items.map((item, i) => [
      i + 1,
      item.name || "-",
      `${item.size || "-"} / ${item.color || "-"}`,
      item.quantity || 0,
      `₹${item.price?.toFixed(2) || "0.00"}`,
      `₹${((item.price || 0) * (item.quantity || 0)).toFixed(2)}`,
    ]);
  } else {
    itemRows = [["-", "No items", "-", "-", "-", "-"]];
  }

  autoTable(doc, {
    startY: y + 10,
    head: [["#", "Item", "Variant", "Qty", "Price", "Total"]],
    body: itemRows,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [240, 240, 240], textColor: 20 },
  });

  const finalY = doc.lastAutoTable.finalY || y + 60;

  // Totals
  const subtotal = order.subtotal || order.totalAmount - (order.taxAmount || 0);

  doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 140, finalY + 10);
  doc.text(`Tax: ₹${(order.taxAmount || 0).toFixed(2)}`, 140, finalY + 16);

  doc.setFont("helvetica", "bold");
  doc.text(`Total: ₹${(order.totalAmount || 0).toFixed(2)}`, 140, finalY + 24);

  doc.setFont("helvetica", "normal");
  doc.text(`Payment Method: ${order.paymentMethod || "N/A"}`, 15, finalY + 30);

  // Save the file
  doc.save(`invoice_${order._id || "order"}.pdf`);
};
