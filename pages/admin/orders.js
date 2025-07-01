import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dialog } from '@headlessui/react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch");
        setOrders(data.orders || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch orders");
      }
    };
    fetchOrders();
  }, []);

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsOpen(true);
  };
  const closeModal = () => setIsOpen(false);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Status update failed");
      setOrders((prev) => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      toast.success("Status updated");
    } catch (err) {
      console.error(err);
      toast.error("Could not update status");
    }
  };

  const downloadInvoice = (orderId) => {
    // Assumes backend route /api/admin/orders/[id]/invoice returns PDF
    window.open(`/api/admin/orders/${orderId}/invoice`, '_blank');
  };

  return (
    <AdminLayout title="Orders">
      <ToastContainer />
      <div className="bg-white shadow rounded-lg p-4 sm:p-6 overflow-hidden">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">Orders</h1>
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-700 min-w-[700px]">
              <thead className="text-xs uppercase bg-gray-100">
                <tr>
                  <th className="px-4 py-2 whitespace-nowrap">ID</th>
                  <th className="px-4 py-2 whitespace-nowrap">Email</th>
                  <th className="px-4 py-2 whitespace-nowrap">Amount</th>
                  <th className="px-4 py-2 whitespace-nowrap">Status</th>
                  <th className="px-4 py-2 whitespace-nowrap">Date</th>
                  <th className="px-4 py-2 whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className="border-b hover:bg-blue-50 transition-all">
                    <td className="px-4 py-2 font-mono">{o._id.slice(-6).toUpperCase()}</td>
                    <td className="px-4 py-2 break-all">{o.email}</td>
                    <td className="px-4 py-2">₹{o.totalAmount}</td>
                    <td className="px-4 py-2">
                      <select
                        className="border px-2 py-1 rounded"
                        value={o.status}
                        onChange={(e) => handleStatusChange(o._id, e.target.value)}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">{new Date(o.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-2 text-right space-x-2">
                      <button
                        onClick={() => openModal(o)}
                        className="text-blue-600 hover:underline"
                      >
                        View Items
                      </button>
                      <button
                        onClick={() => downloadInvoice(o._id)}
                        className="text-green-600 hover:underline"
                      >
                        Download Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal for order items */}
        <Dialog open={isOpen} onClose={closeModal} className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            <div className="bg-white rounded-lg max-w-lg w-full p-6 z-60">
              <Dialog.Title className="text-lg font-bold mb-4">Order Details</Dialog.Title>
              {selectedOrder?.items.map((item) => (
                <div key={item._id} className="flex justify-between mb-2">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm">Size: {item.size}, Color: {item.color}</p>
                  </div>
                  <p className="text-sm">Qty: {item.quantity}</p>
                  <p className="text-sm font-semibold">₹{item.price}</p>
                </div>
              ))}
              <div className="mt-4 text-right">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
