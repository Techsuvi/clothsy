import React, { useState } from 'react';
import * as cookie from 'cookie';
import jwt from 'jsonwebtoken';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Orders = ({ orders }) => {
  const [expandedOrders, setExpandedOrders] = useState([]);
  const [filter, setFilter] = useState('all');

  const toggleOrderView = (id) => {
    setExpandedOrders((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  };

  const downloadInvoice = (order) => {
    const doc = new jsPDF();
    doc.text(`Invoice for Order: ${order.stripeSessionId || order._id}`, 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [['Item', 'Size', 'Variant', 'Price', 'Qty', 'Total']],
      body: order.products.map((item) => [
        item.name,
        item.size,
        item.variant,
        `₹${item.price}`,
        item.qty,
        `₹${item.price * item.qty}`,
      ]),
    });

    doc.text(`Total Amount: ₹${order.amount}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Status: ${order.status}`, 14, doc.lastAutoTable.finalY + 20);
    doc.save(`Invoice-${order._id}.pdf`);
  };

  const getStatusBadge = (status) => {
    const base = "px-2 py-1 rounded text-xs font-semibold";
    if (status === "Paid") return <span className={`${base} bg-green-100 text-green-800`}>Paid</span>;
    if (status === "Failed") return <span className={`${base} bg-red-100 text-red-800`}>Failed</span>;
    return <span className={`${base} bg-yellow-100 text-yellow-800`}>{status || 'Pending'}</span>;
  };

  const filterOrders = (orders) => {
    if (filter === 'all') return orders;
    const days = parseInt(filter);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return orders.filter((order) => new Date(order.createdAt) >= cutoff);
  };

  const filteredOrders = filterOrders(orders);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="font-bold text-2xl mb-6">My Orders</h1>

      <div className="mb-4">
        <label className="mr-2 font-medium">Filter:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="all">All</option>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {!filteredOrders || filteredOrders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Session ID</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <React.Fragment key={order._id}>
                  <tr className="border-t">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 text-xs text-blue-600 break-all">
                      {order.stripeSessionId || order._id}
                    </td>
                    <td className="px-4 py-3">₹{order.amount}</td>
                    <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
                    <td className="px-4 py-3">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button
                        onClick={() => toggleOrderView(order._id)}
                        className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-xs"
                      >
                        {expandedOrders.includes(order._id) ? 'Hide Items' : 'View Items'}
                      </button>
                      <button
                        onClick={() => downloadInvoice(order)}
                        className="text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-xs"
                      >
                        Invoice
                      </button>
                    </td>
                  </tr>

                  {expandedOrders.includes(order._id) && (
                    <tr className="border-t bg-gray-50">
                      <td colSpan="6" className="px-4 py-3">
                        {order.products?.length ? (
                          <div className="space-y-2">
                            {order.products.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm border-b pb-2">
                                <span>{item.name} ({item.size}/{item.variant})</span>
                                <span>
                                  ₹{item.price} x {item.qty} = ₹{item.price * item.qty}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">No items found in this order.</p>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export async function getServerSideProps(context) {
  try {
    const connectDb = (await import('@/middleware/mongoose')).default;
    await connectDb();

    const req = context.req;
    const rawCookies = req?.headers?.cookie || '';
    const cookies = cookie.parse(rawCookies);
    const token = cookies.token;

    if (!token) {
      return { redirect: { destination: '/login', permanent: false } };
    }

    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (error) {
      return { redirect: { destination: '/login', permanent: false } };
    }

    const Order = (await import('@/models/Order')).default;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();

    return { props: { orders: JSON.parse(JSON.stringify(orders)) } };
  } catch (err) {
    console.error('Server error:', err);
    return { props: { orders: [] } };
  }
}

export default Orders;