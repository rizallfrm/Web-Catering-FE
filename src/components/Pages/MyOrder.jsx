import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import OrderService from "../services/orderService";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();
  // WhatsApp message template
  const whatsappTemplate = (order) => {
    const orderId = order.id;
    const totalPrice = order.total_price
      ? order.total_price.toLocaleString("id-ID")
      : "0";

    const items = order.OrderItems?.map(
      (item) =>
        `- ${item.Menu?.name || `Menu ID: ${item.menu_id}`} (${
          item.quantity
        } x Rp ${item.price?.toLocaleString("id-ID") || "0"})`
    ).join("%0A");

    const userName = order.User?.name || "Nama tidak tersedia";
    const userPhone = order.User?.phone || "Tidak tersedia";
    const userAddress = order.User?.address || "Tidak tersedia";
    const createdAt = new Date(order.createdAt).toLocaleString("id-ID", {
      dateStyle: "long",
      timeStyle: "short",
    });

    return `Halo admin Dapur Catering Mamake, saya atas nama *${userName}* sudah melakukan pembayaran untuk pesanan berikut:%0A%0A*No. Pesanan:* ${orderId}%0A*Tanggal Pesanan:* ${createdAt}%0A*Nama:* ${userName}%0A*Telepon:* ${userPhone}%0A*Alamat:* ${userAddress}%0A*Total:* Rp ${totalPrice}%0A%0A*Detail Pesanan:*%0A${items}%0A%0ABukti pembayaran sudah saya upload. Mohon untuk segera dicek ya. Terima kasih.`;
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      setIsLoading(true);
      const response = await OrderService.getMyOrders();
      console.log("Orders response:", response);
      // Pastikan struktur data sesuai dengan response backend
      const ordersData = response.data?.orders || response;
      console.log("Processed orders data:", ordersData);
      setOrders(ordersData);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Gagal memuat pesanan. Silakan coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeDetails = () => {
    setSelectedOrder(null);
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) {
      return;
    }

    try {
      setIsLoading(true);
      await OrderService.cancelOrder(orderId);

      // Update the order status in state
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: "cancelled" } : order
        )
      );

      // If the cancelled order is currently selected, update it too
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: "cancelled" });
      }

      setSuccess("Pesanan berhasil dibatalkan");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error cancelling order:", err);
      setError("Gagal membatalkan pesanan");
    } finally {
      setIsLoading(false);
    }
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

  // Filter orders by status
  const filteredOrders = orders.filter((order) => {
    return statusFilter === "all" || order.status === statusFilter;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pesanan Saya</h1>
      </div>

      {error && (
        <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {success && (
        <div className="p-4 mb-4 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Filter */}
      <div className="mb-6">
        <label className="mr-2 font-medium">Filter Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="all">Semua</option>
          <option value="pending">Menunggu</option>
          <option value="processing">Diproses</option>
          <option value="completed">Selesai</option>
          <option value="cancelled">Dibatalkan</option>
        </select>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Belum ada pesanan
          </h3>
          <p className="text-gray-500 mb-4">
            Anda belum memiliki pesanan apapun.
          </p>
          <Link
            to="/menu"
            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition-colors duration-300"
          >
            Lihat Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium">Pesanan #{order.id}</h3>
                  <p className="text-gray-500 text-sm">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="mt-2 md:mt-0">
                  {getStatusBadge(order.status)}
                </div>
              </div>

              <div className="border-t border-b py-4 my-4">
                <p className="font-medium">
                  Total: Rp{" "}
                  {order.total_price ? order.total_price.toLocaleString() : "0"}
                </p>
                <p className="text-sm text-gray-500">
                  {order.OrderItems?.length || 0} item
                  {(order.OrderItems?.length || 0) !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleViewDetails(order)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-300"
                >
                  Lihat Detail
                </button>
                {order.status === "pending" && order.proof_image_url && (
                  <a
                    href={`https://wa.me/6285137411338?text=${whatsappTemplate(
                      order
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors duration-300"
                  >
                    Konfirmasi via WA
                  </a>
                )}

                {order.status === "pending" && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-300"
                  >
                    Batalkan
                  </button>
                )}
              </div>
            </div>
          ))}
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

            <div className="mb-6">
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
                  {selectedOrder.proof_image_url && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-3">
                        Bukti Pembayaran
                      </h3>
                      <div className="bg-gray-50 p-4 rounded">
                        <button
                          onClick={() => {
                            const dialog =
                              document.getElementById("imageDialog");
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
                        <p className="text-sm text-blue-500 mt-2 text-center">
                          Klik untuk memperbesar
                        </p>
                      </div>
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
              </table>
            </div>

            {selectedOrder.status === "pending" && (
              <div className="mb-6">
                <button
                  onClick={() => {
                    closeDetails();
                    handleCancelOrder(selectedOrder.id);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-300"
                >
                  Batalkan Pesanan
                </button>
              </div>
            )}

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

export default MyOrders;
