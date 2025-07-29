import React, { useState, useEffect } from "react";
import AdminService from "../../services/adminService";
import OrderService from "../../services/orderService";
import dayjs from "dayjs";
import "dayjs/locale/id";
dayjs.locale("id");

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatIndonesianDateTime = (dateString) => {
    if (!dateString) return "Belum ditentukan";
    return dayjs(dateString).format("dddd, D MMMM YYYY [pukul] HH:mm");
  };
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await AdminService.getAllOrders();

      // Log for debugging
      console.log("Orders from API:", response);

      // Check for the proper data structure
      let ordersData = [];
      if (response.data && response.data.orders) {
        ordersData = response.data.data.orders;
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

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    const optionsDate = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    const optionsTime = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    return `${date.toLocaleDateString(
      "id-ID",
      optionsDate
    )} pukul ${date.toLocaleTimeString("id-ID", optionsTime)}`;
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setIsLoading(true);
      const updatedOrder = await OrderService.updateStatus(orderId, newStatus);

      // Update order dalam state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
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
        "Gagal mengubah status pesanan: " +
          "Harus upload bukti pembayaran terlebih dahulu"
      );
      console.error("Error updating order status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPayment = async (orderId) => {
    try {
      setIsLoading(true);
      const updatedOrder = await OrderService.verifyPayment(orderId);

      // Update orders list
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? updatedOrder : order))
      );

      // Update selected order if open
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updatedOrder);
      }

      setSuccess("Pembayaran berhasil diverifikasi");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Gagal memverifikasi pembayaran: " + err.message);
      console.error("Error verifying payment:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePaymentStatus = async (orderId, newStatus) => {
    try {
      setIsLoading(true);
      await OrderService.updateStatus(orderId, newStatus);

      // Update order dalam state
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, payment_status: newStatus } : order
        )
      );

      // Jika order yang diupdate adalah yang sedang dipilih, update juga
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, payment_status: newStatus });
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
      case "Menunggu Konfirmasi":
        return (
          <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full">
            Menunggu Konfirmasi
          </span>
        );
      case "Dikonfirmasi":
        return (
          <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
            Dikonfirmasi
          </span>
        );
      case "Menunggu Verifikasi":
        return (
          <span className="px-3 py-1 text-sm font-medium bg-yellow-500 text-yellow-100 rounded-full">
            Menunggu Verifikasi
          </span>
        );
      case "Diproses":
        return (
          <span className="px-3 py-1 text-sm font-medium bg-purple-100 text-purple-800 rounded-full">
            Diproses
          </span>
        );
      case "Selesai":
        return (
          <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
            Selesai
          </span>
        );
      case "Dibatalkan":
        return (
          <span className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full">
            Dibatalkan
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
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
            <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
            <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
            <option value="Diproses">Diproses</option>
            <option value="Selesai">Selesai</option>
            <option value="Dibatalkan">Dibatalkan</option>
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
          <table className="w-full  border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  No. Pesanan
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tanggal Pesan
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
                      {dayjs(order.createdAt).format("D MMM YYYY HH:mm")}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white p-6 border-b border-gray-200 flex justify-between items-center z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Detail Pesanan #{selectedOrder.id}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Dibuat pada{" "}
                  {formatIndonesianDateTime(selectedOrder.createdAt)}
                </p>
              </div>
              <button
                onClick={closeDetails}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <svg
                  className="w-6 h-6"
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

            <div className="p-6">
              {/* Order Summary Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Order Information */}
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Informasi Pesanan
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Tanggal & Jam Pengantaran
                      </p>
                      <p className="font-medium">
                        {formatIndonesianDateTime(selectedOrder.delivery_date)}
                      </p>
                    </div>

                    {selectedOrder.weekly_schedule && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Jadwal Pengantaran Harian
                        </p>
                        <div className="space-y-2">
                          {selectedOrder.weekly_schedule.map(
                            (schedule, index) => (
                              <div key={index} className="flex justify-between">
                                <span className="capitalize font-medium">
                                  {schedule.day}:
                                </span>
                                <span className="text-gray-700">
                                  {dayjs(schedule.datetime).format(
                                    "dddd, D MMMM YYYY [pukul] HH:mm"
                                  )}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Status Pesanan
                        </p>
                        <div>{getStatusBadge(selectedOrder.status)}</div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Status Pembayaran
                        </p>
                        <div>
                          {getStatusBadge(selectedOrder.payment_status)}
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Alamat Pengiriman
                      </p>
                      <p className="font-medium">
                        {selectedOrder.delivery_address}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Area Pengiriman
                      </p>
                      <p className="font-medium">
                        {selectedOrder.delivery_area}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Nomor WhatsApp
                      </p>
                      <p className="font-medium">{selectedOrder.wa_number}</p>
                    </div>

                    {selectedOrder.delivery_notes && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Catatan</p>
                        <p className="font-medium">
                          {selectedOrder.delivery_notes}
                        </p>
                      </div>
                    )}

                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500 mb-1">
                        Total Pembayaran
                      </p>
                      <p className="text-xl font-bold text-gray-800">
                        Rp{" "}
                        {selectedOrder.total_price?.toLocaleString("id-ID") ||
                          "0"}
                      </p>
                      <p className="text-sm text-gray-500 mb-1 pt-2">
                        Harga Ongkos Kirim
                      </p>
                      <p className="text-xl font-bold text-gray-800">
                        Rp{" "}
                        {selectedOrder.delivery_fee?.toLocaleString("id-ID") ||
                          "0"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Informasi Pelanggan
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Nama</p>
                      <p className="font-medium">
                        {selectedOrder.User?.name || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <p className="font-medium">
                        {selectedOrder.User?.email || "N/A"}
                      </p>
                    </div>

                    {selectedOrder.User?.phone && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Telepon</p>
                        <p className="font-medium">
                          {selectedOrder.User.phone}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Item Pesanan
                </h3>

                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Produk
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Harga
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Jumlah
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedOrder.OrderItems?.length > 0 ? (
                        selectedOrder.OrderItems.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                {item.Menu?.image_url && (
                                  <img
                                    src={item.Menu.image_url}
                                    alt={item.Menu.name}
                                    className="w-10 h-10 object-cover rounded-md mr-3"
                                  />
                                )}
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {item.Menu?.name ||
                                      `Menu ID: ${item.menu_id}`}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {item.Menu?.category || "N/A"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              Rp {item.price?.toLocaleString("id-ID") || "0"}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {item.quantity}
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                              Rp{" "}
                              {(
                                (item.price || 0) * item.quantity
                              ).toLocaleString("id-ID")}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="px-6 py-4 text-center text-sm text-gray-500"
                          >
                            Tidak ada item pesanan
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <th
                          colSpan="3"
                          className="px-6 py-3 text-right text-sm font-medium text-gray-500"
                        >
                          Biaya Ongkos Kirim
                        </th>
                        <th className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                          Rp{" "}
                          {selectedOrder.delivery_fee?.toLocaleString("id-ID") ||
                            "0"}
                        </th>
                      </tr>
                      <tr>
                        <th
                          colSpan="3"
                          className="px-6 py-3 text-right text-sm font-medium text-gray-500"
                        >
                          Total
                        </th>
                        <th className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                          Rp{" "}
                          {selectedOrder.total_price?.toLocaleString("id-ID") ||
                            "0"}
                        </th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Payment Proof Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Bukti Pembayaran
                </h3>

                {selectedOrder.proof_image_url ? (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-sm text-gray-500">
                        Upload pada: {formatDate(selectedOrder.updatedAt)}
                      </p>
                      <button
                        onClick={() =>
                          window.open(selectedOrder.proof_image_url, "_blank")
                        }
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Unduh
                      </button>
                    </div>
                    <div className="flex justify-center">
                      <img
                        src={selectedOrder.proof_image_url}
                        alt="Bukti Pembayaran"
                        className="max-w-full h-auto max-h-64 object-contain rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() =>
                          window.open(selectedOrder.proof_image_url, "_blank")
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="mt-2 text-gray-500">
                      Belum ada bukti pembayaran
                    </p>
                  </div>
                )}
              </div>

              {/* Order Status Actions */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                  Update Status Pesanan
                </h3>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Apakah Anda yakin ingin mengkonfirmasi pesanan ini?"
                        )
                      ) {
                        handleUpdateStatus(selectedOrder.id, "Dikonfirmasi");
                      }
                    }}
                    className={`px-4 py-2 rounded-md flex items-center ${
                      selectedOrder.status === "Dikonfirmasi"
                        ? "bg-yellow-500 text-white"
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    } transition-colors`}
                    disabled={
                      selectedOrder.status === "Dikonfirmasi" ||
                      selectedOrder.status === "Dibatalkan" ||
                      selectedOrder.status === "Selesai"
                    }
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Konfirmasi
                  </button>

                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Apakah Anda yakin ingin memproses pesanan ini?"
                        )
                      ) {
                        handleUpdateStatus(selectedOrder.id, "Diproses");
                      }
                    }}
                    className={`px-4 py-2 rounded-md flex items-center ${
                      selectedOrder.status === "Diproses"
                        ? "bg-blue-500 text-white"
                        : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                    } transition-colors`}
                    disabled={
                      selectedOrder.status === "Diproses" ||
                      selectedOrder.status === "Dibatalkan" ||
                      selectedOrder.status === "Selesai"
                    }
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    Diproses
                  </button>

                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Apakah Anda yakin ingin mengirim pesanan ini?"
                        )
                      ) {
                        handleUpdateStatus(selectedOrder.id, "Dikirim");
                      }
                    }}
                    className={`px-4 py-2 rounded-md flex items-center ${
                      selectedOrder.status === "Dikirim"
                        ? "bg-purple-700 text-white"
                        : "bg-purple-100 text-purple-500 hover:bg-blue-200"
                    } transition-colors`}
                    disabled={
                      selectedOrder.status === "Dikirim" ||
                      selectedOrder.status === "Dibatalkan" ||
                      selectedOrder.status === "Selesai"
                    }
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    Dikirim
                  </button>

                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Apakah Anda yakin ingin menyelesaikan pesanan ini? Pesanan tidak dapat diubah setelah diselesaikan."
                        )
                      ) {
                        handleUpdateStatus(selectedOrder.id, "Selesai");
                      }
                    }}
                    className={`px-4 py-2 rounded-md flex items-center ${
                      selectedOrder.status === "Selesai"
                        ? "bg-green-500 text-white"
                        : "bg-green-100 text-green-800 hover:bg-green-200"
                    } transition-colors`}
                    disabled={
                      selectedOrder.status === "Selesai" ||
                      selectedOrder.status === "Dibatalkan"
                    }
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Selesai
                  </button>

                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Apakah Anda yakin ingin membatalkan pesanan ini? Pesanan tidak dapat dipulihkan setelah dibatalkan."
                        )
                      ) {
                        handleUpdateStatus(selectedOrder.id, "Dibatalkan");
                      }
                    }}
                    className={`px-4 py-2 rounded-md flex items-center ${
                      selectedOrder.status === "Dibatalkan"
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    } transition-colors`}
                    disabled={
                      selectedOrder.status === "Dibatalkan" ||
                      selectedOrder.status === "Selesai"
                    }
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Dibatalkan
                  </button>
                </div>
              </div>

              {/* Payment Verification */}
              {selectedOrder.payment_status === "Menunggu Verifikasi" && (
                <div className="mb-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    Verifikasi Pembayaran
                  </h3>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleVerifyPayment(selectedOrder.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center transition-colors"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Verifikasi Pembayaran
                    </button>

                    <button
                      onClick={() =>
                        handleUpdatePaymentStatus(
                          selectedOrder.id,
                          "Dibatalkan"
                        )
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center transition-colors"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Tolak Pembayaran
                    </button>
                  </div>
                </div>
              )}

              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  onClick={closeDetails}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
