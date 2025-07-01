"use client";

import React, { useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "@/components/AdminLayout";
import { toast } from "react-toastify";

const AddProduct = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    slug: "",
    desc: "",
    price: "",
    category: "",
    color: "",
    size: "",
    availableQty: "",
    img: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success("Product added successfully!");
        router.push("/admin/products");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to add product.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <AdminLayout title="Add New Product">
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <h2 className="text-2xl font-semibold mb-4">Add Product</h2>

        {[
          { name: "title", label: "Title" },
          { name: "slug", label: "Slug" },
          { name: "desc", label: "Description", type: "textarea" },
          { name: "price", label: "Price", type: "number" },
          { name: "category", label: "Category" },
          { name: "color", label: "Color" },
          { name: "size", label: "Size" },
          { name: "availableQty", label: "Quantity", type: "number" },
          { name: "img", label: "Image URL" },
        ].map(({ name, label, type = "text" }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700">
              {label}
            </label>
            {type === "textarea" ? (
              <textarea
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="w-full border px-3 py-2 mt-1 rounded"
                rows={3}
              />
            ) : (
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="w-full border px-3 py-2 mt-1 rounded"
              />
            )}
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
        >
          Add Product
        </button>
      </form>
    </AdminLayout>
  );
};

export default AddProduct;
