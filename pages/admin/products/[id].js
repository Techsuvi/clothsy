"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProduct = () => {
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch product on mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/admin/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch");

        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product");
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      toast.success("Product updated!");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product");
    }
  };

  if (loading || !product) return <AdminLayout>Loading...</AdminLayout>;

  return (
    <AdminLayout title="Edit Product">
      <ToastContainer />
      <form
        onSubmit={handleUpdate}
        className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <Input name="title" label="Title" value={product.title} onChange={handleChange} />
          <Input name="slug" label="Slug" value={product.slug} onChange={handleChange} />
        </div>

        <Input name="desc" label="Description" value={product.desc} onChange={handleChange} />

        <div className="grid grid-cols-2 gap-4">
          <Input name="price" label="Price" value={product.price} onChange={handleChange} type="number" />
          <Input name="availableQty" label="Stock" value={product.availableQty} onChange={handleChange} type="number" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input name="category" label="Category" value={product.category} onChange={handleChange} />
          <Input name="img" label="Image URL" value={product.img} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input name="size" label="Size (comma separated)" value={product.size} onChange={handleChange} />
          <Input name="color" label="Color (comma separated)" value={product.color} onChange={handleChange} />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition"
        >
          Update Product
        </button>
      </form>
    </AdminLayout>
  );
};

export default EditProduct;

const Input = ({ name, label, value, onChange, type = "text" }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
    />
  </div>
);
