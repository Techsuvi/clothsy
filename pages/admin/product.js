// pages/admin/products.js
import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import Link from "next/link";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/admin/products");
        const data = await res.json();
        if (res.ok) setProducts(data);
        else toast.error(data.error || "Failed to load products");
      } catch (err) {
        toast.error("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        toast.success("Product deleted");
      } else toast.error(data.error);
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <AdminLayout title="Manage Products">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Product List</h2>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          <FaPlus /> Add Product
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b hover:bg-gray-50 transition-all duration-300"
                >
                  <td className="px-4 py-2">{product.title}</td>
                  <td className="px-4 py-2">{product.category}</td>
                  <td className="px-4 py-2">₹{product.price}</td>
                  <td className="px-4 py-2 space-x-2">
                    <Link href={`/admin/products/${product._id}`}>
                      <button className="text-blue-600 hover:underline">
                        <FaEdit />
                      </button>
                    </Link>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="text-red-500 hover:underline"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
