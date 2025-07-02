"use client";

import React, { useEffect, useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUserCircle } from "react-icons/fa";

const getToken = () =>
    document.cookie.split("; ").find((r) => r.startsWith("token="))?.split("=")[1];

const Account = () => {
    const [user, setUser] = useState({});
    const [addresses, setAddresses] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editData, setEditData] = useState({});
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = getToken();
            if (!token) {
                toast.error("Please log in to access your account.");
                return;
            }

            try {
                const res = await fetch("/api/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    toast.error(res.status === 401 ? "Session expired." : "Failed to load user.");
                    return;
                }

                const data = await res.json();
                setUser(data);
                setAddresses(data.addresses || []);
            } catch (err) {
                toast.error("Something went wrong loading your profile.");
            }
        };

        fetchUser();
    }, []);

    const handlePincodeCheck = async (pin) => {
        if (!/^\d{6}$/.test(pin)) return;
        try {
            const res = await fetch("/api/pincode");
            const data = await res.json();
            const info = data[pin];
            if (info) {
                setEditData((prev) => ({ ...prev, city: info.city, stateName: info.state }));
                toast.success("Pincode matched.");
            } else {
                toast.error("Invalid pincode");
            }
        } catch {
            toast.error("Pincode fetch failed");
        }
    };

    const handleEdit = (index) => {
        setEditData({ ...addresses[index] });
        setEditingIndex(index);
    };

    const handleAddNew = () => {
        setEditData({
            name: "",
            address: "",
            phone: "",
            pin: "",
            city: "",
            stateName: "",
        });
        setEditingIndex(addresses.length);
    };

    const handleDelete = async (index) => {
        const updated = addresses.filter((_, i) => i !== index);
        setAddresses(updated);
        const token = getToken();
        await fetch("/api/save-addresses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updated),
        });
        toast.success("Address deleted");
    };

    const handleSaveAddress = async () => {
        const { name, address, phone, pin } = editData;
        if (!name || !address || !phone || !/^\d{6}$/.test(pin)) {
            toast.error("Please fill all fields correctly.");
            return;
        }

        const updated = [...addresses];
        updated[editingIndex] = editData;
        setAddresses(updated);
        setEditingIndex(null);

        const token = getToken();
        await fetch("/api/save-addresses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updated),
        });

        toast.success("Address saved");
    };

    const handleProfileUpdate = async () => {
        const token = getToken();
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

            const data = await res.json();
            if (res.ok) {
                toast.success("Profile updated!");
            } else {
                toast.error(data.error || "Update failed");
            }
        } catch {
            toast.error("Profile update error");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            setUploading(true);
            const token = getToken();
            const res = await fetch("/api/upload-profile", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                setUser((prev) => ({ ...prev, image: data.url }));
                toast.success("Image uploaded!");
            } else {
                toast.error(data.error || "Upload failed");
            }
        } catch {
            toast.error("Upload error");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-6">
            <ToastContainer position="top-right" />
            <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
                <div className="relative">
                    {user.image ? (
                        <img
                            src={user.image}
                            alt="avatar"
                            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover"
                        />
                    ) : (
                        <FaUserCircle className="w-24 h-24 sm:w-28 sm:h-28 text-gray-400" />
                    )}

                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="absolute bottom-0 right-0 bg-blue-600 text-white px-2 py-1 text-xs rounded"
                    >
                        {uploading ? "..." : "Edit"}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                </div>
                <h1 className="text-2xl font-bold">Hi, {user.name || "User"}!</h1>
            </div>

            {/* Profile Info */}
            <div className="bg-white p-6 rounded shadow mb-8">
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
                    <span className="text-sm font-medium">Email</span>
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

            {/* Addresses */}
            <div className="bg-white p-6 rounded shadow">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Saved Addresses</h2>
                    <button
                        onClick={handleAddNew}
                        className="text-sm text-green-600 border border-green-600 px-2 py-1 rounded hover:bg-green-50"
                    >
                        + Add New
                    </button>
                </div>

                {addresses.length === 0 ? (
                    <p className="text-gray-500">No saved addresses.</p>
                ) : (
                    addresses.map((addr, idx) => (
                        <div key={idx} className="mb-6 border p-4 rounded bg-gray-50">
                            {editingIndex === idx ? (
                                <>
                                    {["name", "address", "phone", "pin"].map((field) => (
                                        <label key={field} className="block mb-2">
                                            <span className="text-sm">{field.charAt(0).toUpperCase() + field.slice(1)}</span>
                                            <input
                                                className="mt-1 block w-full border p-2 rounded"
                                                value={editData[field]}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setEditData({ ...editData, [field]: val });
                                                    if (field === "pin" && val.length === 6) handlePincodeCheck(val);
                                                }}
                                            />
                                        </label>
                                    ))}
                                    <div className="grid grid-cols-2 gap-4">
                                        <label className="block mb-2">
                                            <span className="text-sm">City</span>
                                            <input
                                                className="mt-1 block w-full border p-2 rounded"
                                                value={editData.city}
                                                onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                                            />
                                        </label>
                                        <label className="block mb-2">
                                            <span className="text-sm">State</span>
                                            <input
                                                className="mt-1 block w-full border p-2 rounded"
                                                value={editData.stateName}
                                                onChange={(e) => setEditData({ ...editData, stateName: e.target.value })}
                                            />
                                        </label>
                                    </div>
                                    <button
                                        onClick={handleSaveAddress}
                                        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
                                    >
                                        Save
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className="font-medium">{addr.name}</p>
                                    <p>{addr.address}</p>
                                    <p>
                                        {addr.city}, {addr.stateName} - {addr.pin}
                                    </p>
                                    <p>{addr.phone}</p>
                                    <div className="flex gap-3 mt-2">
                                        <button
                                            onClick={() => handleEdit(idx)}
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(idx)}
                                            className="text-red-600 hover:underline text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
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
