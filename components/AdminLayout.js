"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { MdClose } from "react-icons/md";

const AdminLayout = ({ children, title }) => {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsVerified(true);
    }
  }, [router]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  if (!isVerified) return null;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-gray-800 text-white p-6 transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static`}
      >
        <div className="flex items-center justify-between mb-6 md:hidden">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <button onClick={toggleSidebar} className="text-2xl">
            <MdClose />
          </button>
        </div>

        <h2 className="text-xl font-bold mb-6 hidden md:block">Admin Panel</h2>
        <nav className="space-y-4">
          <Link href="/admin" className="block hover:text-blue-400">
            Dashboard
          </Link>
          <Link href="/admin/products" className="block hover:text-blue-400">
            Products
          </Link>
          <Link href="/admin/orders" className="block hover:text-blue-400">
            Orders
          </Link>
          <Link href="/admin/users" className="block hover:text-blue-400">
            Users
          </Link>
        </nav>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
          className="mt-8 block w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </aside>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile topbar */}
        <div className="flex items-center justify-between md:hidden p-4 bg-white shadow">
          <button onClick={toggleSidebar} className="text-2xl text-gray-700">
            <FiMenu />
          </button>
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-8 bg-gray-50">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
