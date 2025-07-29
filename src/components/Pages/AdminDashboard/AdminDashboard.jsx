import React, { useState, useEffect } from "react";
import {
  Link,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import AuthService from "../../services/authService";
import AdminService from "../../services/adminService";
import MenuService from "../../services/menuService";
// Import Admin Sub-Pages
import MenuManagement from "./MenuManagement";
import UserManagement from "./UserManagement";
import OrderManagement from "./OrderManagement";
import FinancialManagement from "../AdminDashboard/Financial/FinancialManagement";
import ExpenseManagement from "../AdminDashboard/Financial/ExpenseManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Ambil data user
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }

    // Set tab aktif berdasarkan path
    const path = location.pathname.split("/").pop();
    if (path === "menu") setActiveTab("menu");
    else if (path === "orders") setActiveTab("orders");
    else if (path === "users") setActiveTab("users");
    else if (path === "financial") setActiveTab("financial");
    else if (path === "expenses") setActiveTab("expenses");
    else setActiveTab("dashboard");
  }, [location.pathname]);

  // Komponen untuk Dashboard
  const DashboardContent = () => {
    const [dashboardData, setDashboardData] = useState({
      counts: {
        users: 0,
        menus: 0,
        orders: 0,
        recentOrders: 0,
        newUsers: 0,
      },
      recentActivities: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchDashboardStats = async () => {
        try {
          setIsLoading(true);
          const data = await AdminService.getDashboardStats();
          setDashboardData(data);
          setError(null);
        } catch (err) {
          console.error("Error fetching dashboard stats:", err);
          setError("Gagal memuat data dashboard");
        } finally {
          setIsLoading(false);
        }
      };

      fetchDashboardStats();
    }, []);

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Dashboard</h2>

        {error && (
          <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500"></div>
            <p className="mt-2">Loading...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-100 p-4 rounded-lg shadow-sm">
                <h3 className="font-medium text-blue-800">Pesanan</h3>
                <p className="text-2xl font-bold">
                  {dashboardData.counts.orders}
                </p>
                <p className="text-sm text-blue-600">
                  <span className="font-semibold">
                    {dashboardData.counts.recentOrders}
                  </span>{" "}
                  pesanan baru dalam 7 hari terakhir
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg shadow-sm">
                <h3 className="font-medium text-green-800">Menu</h3>
                <p className="text-2xl font-bold">
                  {dashboardData.counts.menus}
                </p>
                <p className="text-sm text-green-600">Total menu tersedia</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg shadow-sm">
                <h3 className="font-medium text-purple-800">Users</h3>
                <p className="text-2xl font-bold">
                  {dashboardData.counts.users}
                </p>
                <p className="text-sm text-purple-600">
                  <span className="font-semibold">
                    {dashboardData.counts.newUsers}
                  </span>{" "}
                  pengguna baru dalam 7 hari terakhir
                </p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg shadow-sm">
                <h3 className="font-medium text-yellow-800">Keuangan</h3>
                <p className="text-lg font-bold">Laporan Lengkap</p>
                <button
                onClick={() => {
                  setActiveTab("expenses");
                  navigate("/admin/expenses");
                }}
                className={`flex items-center px-4 py-3 text-left ${
                  activeTab === "expenses"
                    ? "bg-yellow-500 text-white"
                    : "hover:bg-yellow-50"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Kelola Pengeluaran
              </button>
              <button
                  onClick={() => {
                    setActiveTab("espenses");
                    navigate("/admin/expenses");
                  }}
                  className="text-sm text-yellow-600 hover:text-yellow-800 underline"
                >
                  Lihat Detail →
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Aktivitas Terbaru</h3>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                {dashboardData.recentActivities.length === 0 ? (
                  <p className="p-4 text-gray-500 text-center">
                    Belum ada aktivitas terbaru.
                  </p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {dashboardData.recentActivities.map((activity) => (
                      <li key={activity.id} className="p-4 hover:bg-gray-100">
                        <div className="flex items-start">
                          <div
                            className={`mt-1 mr-3 rounded-full p-2 ${
                              activity.type === "order"
                                ? "bg-blue-100 text-blue-500"
                                : activity.type === "menu"
                                ? "bg-green-100 text-green-500"
                                : "bg-purple-100 text-purple-500"
                            }`}
                          >
                            {activity.type === "order" ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                              </svg>
                            ) : activity.type === "menu" ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13c-1.168-.776-2.754-1.253-4.5-1.253-1.746 0-3.332.477-4.5 1.253"
                                />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm">{activity.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(activity.timestamp)}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="text-sm text-gray-600">
            Selamat datang,{" "}
            <span className="font-medium">
              {user?.name || user?.email || "Admin"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <nav className="flex flex-col">
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  navigate("/admin");
                }}
                className={`flex items-center px-4 py-3 text-left ${
                  activeTab === "dashboard"
                    ? "bg-yellow-500 text-white"
                    : "hover:bg-yellow-50"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
                Dashboard
              </button>
              <button
                onClick={() => {
                  setActiveTab("menu");
                  navigate("/admin/menu");
                }}
                className={`flex items-center px-4 py-3 text-left ${
                  activeTab === "menu"
                    ? "bg-yellow-500 text-white"
                    : "hover:bg-yellow-50"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13c-1.168-.776-2.754-1.253-4.5-1.253-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                Kelola Menu
              </button>
              <button
                onClick={() => {
                  setActiveTab("orders");
                  navigate("/admin/orders");
                }}
                className={`flex items-center px-4 py-3 text-left ${
                  activeTab === "orders"
                    ? "bg-yellow-500 text-white"
                    : "hover:bg-yellow-50"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                Kelola Pesanan
              </button>
              <button
                onClick={() => {
                  setActiveTab("financial");
                  navigate("/admin/financial");
                }}
                className={`flex items-center px-4 py-3 text-left ${
                  activeTab === "financial"
                    ? "bg-yellow-500 text-white"
                    : "hover:bg-yellow-50"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Laporan Keuangan
              </button>
              <button
                onClick={() => {
                  setActiveTab("expenses");
                  navigate("/admin/expenses");
                }}
                className={`flex items-center px-4 py-3 text-left ${
                  activeTab === "expenses"
                    ? "bg-yellow-500 text-white"
                    : "hover:bg-yellow-50"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Laporan Pengeluaran
              </button>
              <button
                onClick={() => {
                  setActiveTab("users");
                  navigate("/admin/users");
                }}
                className={`flex items-center px-4 py-3 text-left ${
                  activeTab === "users"
                    ? "bg-yellow-500 text-white"
                    : "hover:bg-yellow-50"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                Kelola Pengguna
              </button>
              <button
                onClick={() => {
                  AuthService.logout();
                  navigate("/login");
                }}
                className="flex items-center px-4 py-3 text-left text-red-600 hover:bg-red-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-4">
          <Routes>
            <Route path="/" element={<DashboardContent />} />
            <Route path="/menu" element={<MenuManagement />} />
            <Route path="/orders" element={<OrderManagement />} />
            <Route path="/financial" element={<FinancialManagement />} />
            <Route path="/expenses" element={<ExpenseManagement />} />
            <Route path="/users" element={<UserManagement />} />
          </Routes>

          {/* Tampilkan konten berdasarkan tab aktif jika tidak menggunakan nested routes */}
          {location.pathname === "/admin" && <DashboardContent />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;