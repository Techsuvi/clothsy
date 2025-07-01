"use client";

import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Account = () => {
  const [user, setUser] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);

  // Load user + saved addresses
  useEffect(() => {
    const fetchUser = async () => {
      const token = document.cookie
        .split("; ")
        .find((r) => r.startsWith("token="))
        ?.split("=")[1];

      if (!token) {
        toast.error("Please log in to access your account.");
        return;
      }

      try {
        const res = await fetch("/api/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 401) {
            toast.error("Session expired. Please log in again.");
          } else {
            toast.error("Failed to load user data.");
          }
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Fetch user failed", err);
        toast.error("Something went wrong loading your profile.");
      }
    };

    const saved = JSON.parse(localStorage.getItem("savedAddresses")) || [];
    setAddresses(saved);
    fetchUser();
  }, []);

  // Autofill City/State from pincode
  const handlePincodeCheck = async (pin) => {
    if (!/^\d{6}$/.test(pin)) return;
    try {
      const res = await fetch("/api/pincode");
      const data = await res.json();
      const info = data[pin];
      if (info) {
        setEditData((prev) => ({
          ...prev,
          city: info.city,
          stateName: info.state,
        }));
        toast.success("Pincode matched. City/State filled.");
      } else {
        toast.error("Invalid pincode");
      }
    } catch {
      toast.error("Pincode lookup failed");
    }
  };

  const handleEdit = (index) => {
    setEditData({ ...addresses[index] });
    setEditingIndex(index);
  };

  const handleSaveAddress = () => {
    const updated = [...addresses];
    updated[editingIndex] = editData;
    setAddresses(updated);
    localStorage.setItem("savedAddresses", JSON.stringify(updated));
    setEditingIndex(null);
    toast.success("Address updated");
  };

  const handleProfileUpdate = async () => {
    const token = document.cookie
      .split("; ")
      .find((r) => r.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      toast.error("Not authenticated");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/update-user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: user.name,
          address: user.address,
          phone: user.phone,
        }),
      });

      if (res.ok) {
        toast.success("Profile updated!");
      } else {
        const { error } = await res.json();
        toast.error(error || "Update failed");
      }
    } catch (err) {
      console.error("Profile update error", err);
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <ToastContainer position="top-right" />
      <h1 className="text-3xl font-bold mb-6">Hi, {user.name || "User"}!</h1>

      {/* Profile Info */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>
        <label className="block mb-2">
          <span className="text-sm font-medium">Name</span>
          <input
            type="text"
            value={user.name || ""}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="mt-1 block w-full border p-2 rounded"
          />
        </label>
        <label className="block mb-2">
          <span className="text-sm font-medium">Email (read-only)</span>
          <input
            type="email"
            value={user.email || ""}
            readOnly
            className="mt-1 block w-full border bg-gray-100 p-2 rounded"
          />
        </label>
        <label className="block mb-4">
          <span className="text-sm font-medium">Phone</span>
          <input
            type="tel"
            value={user.phone || ""}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
            className="mt-1 block w-full border p-2 rounded"
          />
        </label>
        <button
          onClick={handleProfileUpdate}
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Update Profile"}
        </button>
      </div>

      {/* Saved Addresses */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Saved Addresses</h2>
        {addresses.length === 0 ? (
          <p className="text-gray-500">No saved addresses found.</p>
        ) : (
          addresses.map((addr, idx) => (
            <div key={idx} className="mb-6 border p-4 rounded bg-gray-50">
              {editingIndex === idx ? (
                <>
                  <label className="block mb-2">
                    <span className="text-sm">Name</span>
                    <input
                      className="mt-1 block w-full border p-2 rounded"
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                    />
                  </label>
                  <label className="block mb-2">
                    <span className="text-sm">Address</span>
                    <textarea
                      className="mt-1 block w-full border p-2 rounded"
                      rows={2}
                      value={editData.address}
                      onChange={(e) =>
                        setEditData({ ...editData, address: e.target.value })
                      }
                    />
                  </label>
                  <label className="block mb-2">
                    <span className="text-sm">Phone</span>
                    <input
                      className="mt-1 block w-full border p-2 rounded"
                      value={editData.phone}
                      onChange={(e) =>
                        setEditData({ ...editData, phone: e.target.value })
                      }
                    />
                  </label>
                  <label className="block mb-2">
                    <span className="text-sm">Pincode</span>
                    <input
                      className="mt-1 block w-full border p-2 rounded"
                      value={editData.pin}
                      maxLength={6}
                      onChange={(e) => {
                        const pin = e.target.value;
                        setEditData({ ...editData, pin });
                        pin.length === 6 && handlePincodeCheck(pin);
                      }}
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block mb-2">
                      <span className="text-sm">City</span>
                      <input
                        className="mt-1 block w-full border p-2 rounded"
                        value={editData.city}
                        onChange={(e) =>
                          setEditData({ ...editData, city: e.target.value })
                        }
                      />
                    </label>
                    <label className="block mb-2">
                      <span className="text-sm">State</span>
                      <input
                        className="mt-1 block w-full border p-2 rounded"
                        value={editData.stateName}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            stateName: e.target.value,
                          })
                        }
                      />
                    </label>
                  </div>
                  <button
                    onClick={handleSaveAddress}
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Save Address
                  </button>
                </>
              ) : (
                <>
                  <p className="font-medium">{addr.name}</p>
                  <p className="mt-1">{addr.address}</p>
                  <p className="mt-1">
                    {addr.city}, {addr.stateName} - {addr.pin}
                  </p>
                  <p className="mt-1">{addr.phone}</p>
                  <button
                    onClick={() => handleEdit(idx)}
                    className="mt-3 text-blue-600 hover:underline"
                  >
                    Edit Address
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Account;
