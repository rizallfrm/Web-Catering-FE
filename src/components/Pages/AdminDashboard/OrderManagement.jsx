import React, { useState, useEffect } from "react";
import AdminService from "../../services/adminService";
import OrderService from "../../services/orderService";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await AdminService.getAllOrders();

      // Log for debugging
      console.log("Orders from API:", response);

      // Check for the proper data structure
      let ordersData = [];
      if (response.data && response.data.orders) {
        ordersData = response.data.orders;
      } else if (response.orders) {
        ordersData = response.orders;
      } else if (Array.isArray(response)) {
        ordersData = response;
      }

      console.log("Processed orders data:", ordersData);
      setOrders(ordersData);
      setError(null);
    } catch (err) {
      console.error("Error details:", err);
      setError(`Gagal memuat data pesanan: ${err.message || err.toString()}`);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setIsLoading(true);
      await OrderService.updateStatus(orderId, newStatus);

      // Update order dalam state
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      // Jika order yang diupdate adalah yang sedang dipilih, update juga
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }

      setSuccess(`Status pesanan berhasil diubah menjadi ${newStatus}`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        "Gagal mengubah status pesanan: " + (err.message || "Unknown error")
      );
      console.error("Error updating order status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    console.log("Selected order details:", order);
    setSelectedOrder(order);
  };

  const closeDetails = () => {
    setSelectedOrder(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
            Menunggu
          </span>
        );
      case "processing":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
            Diproses
          </span>
        );
      case "completed":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
            Selesai
          </span>
        );
      case "cancelled":
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded">
            Dibatalkan
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded">
            {status || "Unknown"}
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  // Filter orders berdasarkan status dan pencarian
  const filteredOrders = orders.filter((order) => {
    // Filter berdasarkan status
    const matchStatus = statusFilter === "all" || order.status === statusFilter;

    // Filter berdasarkan ID pesanan atau nama pelanggan
    const matchSearch =
      searchQuery === "" ||
      (order.id && order.id.toString().includes(searchQuery)) ||
      (order.User &&
        order.User.name &&
        order.User.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchStatus && matchSearch;
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Manajemen Pesanan</h2>

      {error && (
        <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {success && (
        <div className="p-4 mb-4 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari pesanan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 pl-10 border rounded-md"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="md:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full p-3 border rounded-md"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Diproses</option>
            <option value="completed">Selesai</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          <p className="mt-2">Loading...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded">
          <p className="text-gray-500">Tidak ada pesanan yang ditemukan</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  No. Pesanan
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Pelanggan
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{order.id || "N/A"}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.User?.name || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.User?.email || "N/A"}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      Rp{" "}
                      {order.total_price
                        ? order.total_price.toLocaleString()
                        : "0"}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="text-blue-600 hover:text-blue-900 mr-2"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Detail Pesanan */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                Detail Pesanan #{selectedOrder.id}
              </h2>
              <button
                onClick={closeDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Informasi Pesanan</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <div className="mb-2">
                    <span className="text-gray-600">Tanggal:</span>
                    <span className="ml-2 font-medium">
                      {formatDate(selectedOrder.createdAt)}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-gray-600">Status:</span>
                    <span className="ml-2">
                      {getStatusBadge(selectedOrder.status)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total:</span>
                    <span className="ml-2 font-medium">
                      Rp{" "}
                      {selectedOrder.total_price
                        ? selectedOrder.total_price.toLocaleString()
                        : "0"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">
                  Informasi Pelanggan
                </h3>
                <div className="bg-gray-50 p-4 rounded">
                  <div className="mb-2">
                    <span className="text-gray-600">Nama:</span>
                    <span className="ml-2 font-medium">
                      {selectedOrder.User?.name || "N/A"}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2">
                      {selectedOrder.User?.email || "N/A"}
                    </span>
                  </div>
                  {/* Tambahkan informasi pelanggan lainnya jika tersedia */}
                </div>
              </div>
            </div>

            <h3 className="text-lg font-medium mb-3">Item Pesanan</h3>
            <div className="overflow-x-auto mb-6">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Harga
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Jumlah
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {selectedOrder.OrderItems &&
                  selectedOrder.OrderItems.length > 0 ? (
                    selectedOrder.OrderItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2">
                          <div className="flex items-center">
                            {item.Menu?.image_url && (
                              <img
                                src={item.Menu.image_url}
                                alt={item.Menu.name}
                                className="w-12 h-12 object-cover rounded mr-3"
                              />
                            )}
                            <div>
                              <div className="font-medium">
                                {item.Menu?.name || `Menu ID: ${item.menu_id}`}
                              </div>
                              <div className="text-sm text-gray-500">
                                Rp{" "}
                                {item.Menu?.price?.toLocaleString("id-ID") ||
                                  "0"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-right">
                          Rp{" "}
                          {item.price
                            ? item.price.toLocaleString("id-ID")
                            : "0"}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-2 text-right font-medium">
                          Rp{" "}
                          {((item.price || 0) * item.quantity).toLocaleString(
                            "id-ID"
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-4 py-2 text-center text-gray-500"
                      >
                        Tidak ada item pesanan
                      </td>
                    </tr>
                  )}
                  <tr className="bg-gray-50">
                    <td
                      colSpan="3"
                      className="px-4 py-2 text-right font-semibold"
                    >
                      Total
                    </td>
                    <td className="px-4 py-2 text-right font-semibold">
                      Rp{" "}
                      {selectedOrder.total_price
                        ? selectedOrder.total_price.toLocaleString()
                        : "0"}
                    </td>
                  </tr>
                </tbody>

                {/*Bukti Pembayaran */}
                <h3 className="text-lg font-medium mb-3">Bukti Pembayaran</h3>
                {selectedOrder.proof_image_url ? (
                  <div className="mb-6">
                    <button
                      onClick={() => {
                        const dialog = document.getElementById("imageDialog");
                        dialog.querySelector("img").src =
                          selectedOrder.proof_image_url;
                        dialog.showModal();
                      }}
                      className="w-full"
                    >
                      <img
                        src={selectedOrder.proof_image_url}
                        alt="Bukti Pembayaran"
                        className="w-full max-w-md h-auto object-contain border rounded hover:opacity-90 transition-opacity"
                      />
                    </button>
                    <p className="text-sm text-gray-500 mt-2">
                      Upload pada: {formatDate(selectedOrder.updatedAt)}
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded mb-6">
                    <p className="text-gray-500">Belum ada bukti pembayaran</p>
                  </div>
                )}
                <dialog
                  id="imageDialog"
                  className="backdrop:bg-black/80 rounded-lg"
                >
                  <div className="relative">
                    <img
                      src=""
                      alt="Bukti Pembayaran (Perbesar)"
                      className="max-h-[90vh]"
                    />
                    <button
                      onClick={() =>
                        document.getElementById("imageDialog").close()
                      }
                      className="absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-white"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </dialog>
              </table>
            </div>

            <h3 className="text-lg font-medium mb-3">Update Status</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => handleUpdateStatus(selectedOrder.id, "pending")}
                className={`px-3 py-2 rounded ${
                  selectedOrder.status === "pending"
                    ? "bg-yellow-500 text-white"
                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                }`}
                disabled={selectedOrder.status === "pending"}
              >
                Pending
              </button>
              <button
                onClick={() =>
                  handleUpdateStatus(selectedOrder.id, "processing")
                }
                className={`px-3 py-2 rounded ${
                  selectedOrder.status === "processing"
                    ? "bg-blue-500 text-white"
                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                }`}
                disabled={selectedOrder.status === "processing"}
              >
                Diproses
              </button>
              <button
                onClick={() =>
                  handleUpdateStatus(selectedOrder.id, "completed")
                }
                className={`px-3 py-2 rounded ${
                  selectedOrder.status === "completed"
                    ? "bg-green-500 text-white"
                    : "bg-green-100 text-green-800 hover:bg-green-200"
                }`}
                disabled={selectedOrder.status === "completed"}
              >
                Selesai
              </button>
              <button
  onClick={() => handleUpdateStatus(selectedOrder.id, "cancelled")}
  className={`
    px-3 py-2 rounded
    ${selectedOrder.status === "cancelled"
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900"
    }
    transition-colors duration-200
  `}
  disabled={selectedOrder.status === "cancelled"}
>
  Dibatalkan
</button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={closeDetails}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
