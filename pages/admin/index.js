// pages/admin/index.js
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    monthlyRevenue: Array(12).fill(0),
    monthlyOrders: Array(12).fill(0),
  });

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const res = await fetch("/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          // unauthorized or other error
          router.push("/login");
          return;
        }
        const data = await res.json();
        setStats({
          totalRevenue: data.totalRevenue,
          totalOrders: data.totalOrders,
          totalUsers: data.totalUsers,
          monthlyRevenue: data.monthlyRevenue,
          monthlyOrders: data.monthlyOrders,
        });
      } catch (err) {
        console.error("Dashboard fetch error", err);
      }
    };

    fetchStats();
  }, [router]);

  const monthLabels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow hover:scale-105 transition">
          <h3 className="text-sm text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-600">
            ₹{stats.totalRevenue}
          </p>
        </div>
        <div className="bg-white p-6 rounded shadow hover:scale-105 transition">
          <h3 className="text-sm text-gray-500">Total Orders</h3>
          <p className="text-2xl font-bold text-blue-600">
            {stats.totalOrders}
          </p>
        </div>
        <div className="bg-white p-6 rounded shadow hover:scale-105 transition">
          <h3 className="text-sm text-gray-500">Total Users</h3>
          <p className="text-2xl font-bold text-purple-600">
            {stats.totalUsers}
          </p>
        </div>
      </div>

   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  <div className="bg-white p-6 rounded shadow h-[300px]">
    <h4 className="text-lg font-semibold mb-4">Monthly Revenue</h4>
    <div className="h-full">
      <Line
        data={{
          labels: monthLabels,
          datasets: [
            {
              label: "Revenue (₹)",
              data: stats.monthlyRevenue,
              borderColor: "#10B981",
              backgroundColor: "rgba(16, 185, 129, 0.2)",
              tension: 0.4,
              fill: true,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
        }}
      />
    </div>
  </div>
  <div className="bg-white p-6 rounded shadow h-[300px]">
    <h4 className="text-lg font-semibold mb-4">Monthly Orders</h4>
    <div className="h-full">
      <Bar
        data={{
          labels: monthLabels,
          datasets: [
            {
              label: "Orders",
              data: stats.monthlyOrders,
              backgroundColor: "#3B82F6",
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
        }}
      />
    </div>
  </div>
</div>

    </AdminLayout>
  );
};

export default AdminDashboard;
