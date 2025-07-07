import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OrderService from "../services/orderService";
import dayjs from "dayjs";
import "dayjs/locale/id";
dayjs.locale("id");

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  const formatIndonesianDateTime = (dateString) => {
    if (!dateString) return "Belum ditentukan";
    return dayjs(dateString).format("dddd, D MMMM YYYY [pukul] HH:mm");
  };

  const whatsappTemplateProcess = (order) => {
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
    const userAddress = order.delivery_address || "Tidak tersedia";
    const userStatus = order.status || "Tidak tersedia";

    const createdAt = new Date(order.createdAt).toLocaleString("id-ID", {
      dateStyle: "long",
      timeStyle: "short",
    });

    const message = `
Halo admin *Dapur Catering Mamake* 👋

Saya *${userName}* ingin menanyakan terkait pesanan saya yang saat ini berstatus *Diproses*. Apakah ada informasi lebih lanjut atau hal yang perlu saya ketahui?

Berikut detail pesanan saya:

*🧾 No. Pesanan:* ${orderId}
*📅 Tanggal Pesan:* ${createdAt}
*👤 Nama:* ${userName}
*📞 Telepon:* ${userPhone}
*🏡 Alamat:* ${userAddress}
*💰 Total:* Rp ${totalPrice}
*📦 Status Pesanan:* ${userStatus}

*📝 Rincian Pesanan:*
${items}

Terima kasih atas bantuannya 🙏
`;

    return encodeURIComponent(message.trim());
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      setIsLoading(true);
      const response = await OrderService.getMyOrders();
      const ordersData = response.data?.orders || response;
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
    if (order.status === "Menunggu Konfirmasi") {
      navigate(`/orders/${order.id}/confirmation`);
    } else {
      navigate(`/orders/${order.id}`);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) {
      return;
    }

    try {
      setIsLoading(true);
      await OrderService.cancelOrder(orderId);
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: "Dibatalkan" } : order
        )
      );
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
    const baseClasses =
      "px-3 py-1 rounded-full text-sm font-medium flex items-center";

    switch (status) {
      case "Menunggu Konfirmasi":
        return `${baseClasses} bg-yellow-50 text-yellow-800`;
      case "Menunggu Verifikasi":
        return `${baseClasses} bg-yellow-500 text-white`;
      case "Dikonfirmasi":
        return `${baseClasses} bg-blue-50 text-blue-800`;
      case "Diproses":
        return `${baseClasses} bg-purple-50 text-purple-800`;
      case "Dikirim":
        return `${baseClasses} bg-indigo-50 text-indigo-800`;
      case "Selesai":
        return `${baseClasses} bg-green-50 text-green-800`;
      case "Dibatalkan":
        return `${baseClasses} bg-red-50 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return dayjs(dateString).format("D MMM YYYY HH:mm");
  };

  const filteredOrders = orders.filter((order) => {
    return statusFilter === "all" || order.status === statusFilter;
  });

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Pesanan Saya</h1>
            <p className="text-gray-600">Kelola semua pesanan Anda</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <span className="mr-2 text-sm text-gray-600">Total Pesanan:</span>
            <span className="bg-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
              {orders.length}
            </span>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="text-gray-500 text-sm">Total Pesanan</div>
            <div className="text-2xl font-bold">{orders.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <div className="text-gray-500 text-sm">Menunggu Konfirmasi</div>
            <div className="text-2xl font-bold">
              {orders.filter((o) => o.status === "Menunggu Konfirmasi").length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
            <div className="text-gray-500 text-sm">Diproses</div>
            <div className="text-2xl font-bold">
              {orders.filter((o) => o.status === "Diproses").length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="text-gray-500 text-sm">Selesai</div>
            <div className="text-2xl font-bold">
              {orders.filter((o) => o.status === "Selesai").length}
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          {error && (
            <div className="p-4 mb-6 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start">
              <svg
                className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>{error}</div>
            </div>
          )}

          {success && (
            <div className="p-4 mb-6 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-start">
              <svg
                className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>{success}</div>
            </div>
          )}

          {/* Filter */}
          <div className="mb-6">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Filter Status
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm rounded-md"
            >
              <option value="all">Semua Status</option>
              <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
              <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
              <option value="Dikonfirmasi">Dikonfirmasi</option>
              <option value="Diproses">Diproses</option>
              <option value="Dikirim">Dikirim</option>
              <option value="Selesai">Selesai</option>
              <option value="Dibatalkan">Dibatalkan</option>
            </select>
          </div>

          {/* Orders List */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
              <p className="text-gray-600">Memuat data pesanan...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                Tidak ada pesanan
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {statusFilter !== "all"
                  ? "Tidak ada pesanan dengan status ini."
                  : "Belum ada pesanan yang dibuat."}
              </p>
              <Link
                to="/menu"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Lihat Menu
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Pesanan #{order.id}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className={getStatusBadge(order.status)}>
                        {order.status}{" "}
                      </div>
                    </div>

                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Total Pesanan</p>
                          <p className="text-lg font-bold text-gray-800">
                            Rp{" "}
                            {order.total_price?.toLocaleString("id-ID") || "0"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Jumlah Item</p>
                          <p className="text-lg font-medium text-gray-800">
                            {order.OrderItems?.length || 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="flex-1 md:flex-none bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-md flex items-center justify-center transition-colors"
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
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        Lihat Detail
                      </button>

                      {order.status === "Diproses" && (
                        <a
                          href={`https://wa.me/6285137411338?text=${whatsappTemplateProcess(
                            order
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 md:flex-none bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-md flex items-center justify-center transition-colors"
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
                              strokeWidth="2"
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          Hubungi via WA
                        </a>
                      )}

                      {order.status === "Menunggu Konfirmasi" && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="flex-1 md:flex-none bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-md flex items-center justify-center transition-colors"
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
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Batalkan Pesanan
                        </button>
                      )}
                    </div>

                    {order.status === "Diproses" && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm text-blue-700">
                        <p>
                          Pesanan Anda sedang diproses. Jika ada pertanyaan,
                          silakan hubungi admin via WhatsApp.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
