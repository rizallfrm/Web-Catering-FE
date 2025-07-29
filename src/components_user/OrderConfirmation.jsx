import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OrderService from "../components/services/orderService";
import LoadingSpinner from "./LoadingSpinner";

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [success, setSuccess] = useState(null);

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
    const userAddress = order.delivery_address || "Tidak tersedia";
    const userStatus = order.status || "Tidak tersedia";

    const createdAt = new Date(order.createdAt).toLocaleString("id-ID", {
      dateStyle: "long",
      timeStyle: "short",
    });

    const message = `
Halo admin *Dapur Catering Mamake* 👋

Saya atas nama *${userName}* telah melakukan pemesanan, tetapi statusnya masih *Menunggu Konfirmasi*. Mohon untuk segera dicek.

*🧾 No. Pesanan:* ${orderId}
*📅 Tanggal Pesan:* ${createdAt}
*👤 Nama:* ${userName}
*📞 Telepon:* ${userPhone}
*🏡 Alamat:* ${userAddress}
*💰 Total:* Rp ${totalPrice}
*📦 Status Pesanan:* ${userStatus}

*📝 Rincian Pesanan:*
${items}

Mohon untuk segera dikonfirmasi yaa. Terima kasih 🙏
`;

    // Encode to URI for WhatsApp
    return encodeURIComponent(message.trim());
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

    // Encode to URI for WhatsApp
    return encodeURIComponent(message.trim());
  };

  useEffect(() => {
    if (
      order?.status === "Dikonfirmasi" &&
      order?.payment_status === "Belum Bayar"
    ) {
      const orderDate = new Date(order.updatedAt);
      const deadline = new Date(orderDate.getTime() + 24 * 60 * 60 * 1000);

      const timer = setInterval(() => {
        const now = new Date();
        const diff = deadline - now;

        if (diff <= 0) {
          clearInterval(timer);
          setTimeLeft("Waktu habis! Pesanan akan dibatalkan");
          return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours} jam ${minutes} menit`);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [order]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await OrderService.getOrderDetails(id);
        console.log("Order data:", orderData);

        setOrder(orderData);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Gagal memuat detail pesanan");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin membatalkan pesanan ini?"
    );
    if (!confirmed) return;

    try {
      setIsLoading(true);

      await OrderService.cancelOrder(orderId); // request ke backend

      // Update state lokal
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "cancelled" } : order
        )
      );

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: "cancelled" });
      }

      setSuccess("✅ Pesanan berhasil dibatalkan");
      setTimeout(() => {
        setSuccess(null);
        navigate("/my-orders");
      }, 2000);
    } catch (err) {
      console.error("Error cancelling order:", err);
      setError("❌ Gagal membatalkan pesanan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadError("Pilih file terlebih dahulu");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("payment_proof", file);

      await OrderService.uploadPaymentProof(id, formData);

      // Refresh order data
      const updatedOrder = await OrderService.getOrderDetails(id);
      setOrder(updatedOrder);

      setFile(null);
      setUploadError(null);
    } catch (err) {
      console.error("Error uploading payment proof:", err);
      setUploadError(err.serverMessage || "Gagal mengunggah bukti pembayaran");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!order) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {success && (
        <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg text-center text-lg font-semibold shadow-md">
          {success}
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-600 text-center font-medium">{error}</div>
      )}

      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Pesanan Berhasil Dibuat!
          </h1>
          <p className="text-gray-600">Kode Pesanan: {order.id}</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Status Pesanan</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center 
                ${
                  order.status === "Menunggu Konfirmasi"
                    ? "bg-orange-500"
                    : "bg-gray-300"
                }`}
              >
                {order.status === "Menunggu Konfirmasi" && (
                  <span className="text-white text-sm">1</span>
                )}
              </div>
              <div className="ml-3">
                <p className="font-medium">Menunggu Konfirmasi Admin</p>
                <p className="text-sm text-gray-500">
                  Pesanan Anda sedang ditinjau
                </p>
              </div>
            </div>

            <div className="flex items-center mb-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center 
                ${
                  order.status === "Dikonfirmasi"
                    ? "bg-orange-500"
                    : "bg-gray-300"
                }`}
              >
                {order.status === "Dikonfirmasi" && (
                  <span className="text-white text-sm">2</span>
                )}
              </div>
              <div className="ml-3">
                <p className="font-medium">Pesanan Menunggu Pembayaran</p>
                <p className="text-sm text-gray-500">
                  Pesanan Anda sedang menunggu pembayaran
                </p>{" "}
              </div>
            </div>

            <div className="flex items-center mb-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center 
                ${
                  order.status === "Menunggu Verifikasi"
                    ? "bg-orange-500"
                    : "bg-gray-300"
                }`}
              >
                {order.status === "Menunggu Verifikasi" && (
                  <span className="text-white text-sm">3</span>
                )}
              </div>
              <div className="ml-3">
                <p className="font-medium">Pesanan Menunggu Verifikasi</p>
                <p className="text-sm text-gray-500">
                  Pesanan Anda sedang diverifikasi admin
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center 
                ${
                  order.status === "Diproses" ? "bg-orange-500" : "bg-gray-300"
                }`}
              >
                {order.status === "Diproses" && (
                  <span className="text-white text-sm">4</span>
                )}
              </div>
              <div className="ml-3">
                <p className="font-medium">Pesanan Diproses</p>
                <p className="text-sm text-gray-500">
                  Pesanan sedang disiapkan
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Detail Pesanan</h2>
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              {/* <div className="flex justify-between">
                <span className="text-gray-600 block">
                  Tanggal Pengantaran:
                </span>
                <span className="font-medium">
                  {new Date(order.delivery_date).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 block">Jam Pengantaran:</span>
                <span className="font-medium">
                  {new Date(order.delivery_date).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div> */}

              {/* Untuk Jadwal Pengantaran Harian */}
              {order.weekly_schedule ? (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">
                    Jadwal Pengantaran Harian:
                  </h3>
                  <div className="space-y-2">
                    {order.weekly_schedule.map((schedule, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="capitalize font-medium">
                          {schedule.day}:
                        </span>
                        <span>
                          {new Date(schedule.datetime).toLocaleDateString(
                            "id-ID",
                            {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            }
                          )}{" "}
                          {new Date(schedule.datetime).toLocaleTimeString(
                            "id-ID",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tanggal Pengantaran:</span>
                    <span>
                      {new Date(order.delivery_date).toLocaleDateString(
                        "id-ID",
                        {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        }
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Jam Pengantaran:</span>
                    <span>
                      {new Date(order.delivery_date).toLocaleTimeString(
                        "id-ID",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Alamat Pengantaran:</span>
              <span className="text-right">{order.delivery_address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Catatan:</span>
              <span className="text-right">{order.delivery_notes || "-"}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-4 border-t border-gray-200">
              <span>Total Pembayaran:</span>
              <span>Rp{order.total_price?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {order.status === "Dikonfirmasi" &&
          order.payment_status === "Belum Bayar" && (
            <div className="px-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-lg mb-2 pl-2">
                Lanjutkan Pembayaran
              </h3>
              <p className="mb-4 pl-2">Silakan transfer ke rekening berikut:</p>
              <p className="pl-2">
                Anda memiliki waktu{" "}
                <span className="font-bold">{timeLeft}</span> untuk mengupload
                bukti pembayaran
              </p>
              <div className="bg-white p-4 rounded-md mb-4">
                <p className="font-medium">BRI</p>
                <p className="text-gray-600">6624-01-044571-53-2</p>
                <p className="font-medium">a.n. Estika Hening</p>
                <p className="text-gray-600">
                  Jumlah: Rp{order.total_price?.toLocaleString()}
                </p>
              </div>

              <div className="mb-4 pl-2">
                <label className="block text-gray-700 mb-2">
                  Unggah Bukti Pembayaran
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-orange-50 file:text-orange-700
                  hover:file:bg-orange-100"
                />
                {uploadError && (
                  <p className="text-red-500 text-sm mt-1">{uploadError}</p>
                )}
              </div>

              <button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
              >
                {isUploading ? "Mengunggah..." : "Kirim Bukti Pembayaran"}
              </button>
            </div>
          )}

        {order.payment_status === "Menunggu Verifikasi" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-lg mb-2">
              Bukti Pembayaran Terkirim
            </h3>
            <p>
              Bukti pembayaran Anda telah berhasil dikirim dan sedang menunggu
              verifikasi pembayaran dari admin.
            </p>
          </div>
        )}

        {order.payment_status === "Sudah Dibayar" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">
              Pembayaran Terverifikasi
            </h3>
            <p>Pembayaran Anda telah diverifikasi. Pesanan sedang diproses.</p>
          </div>
        )}
        {order.status === "Diproses" && (
          <p className="text-sm text-gray-600 text-center mt-6">
            ⏳ Pesanan Anda saat ini sedang kami proses. Jika ingin ada hal yang
            ingin ditanyakan,
            <a
              href={`https://wa.me/6285137411338?text=${whatsappTemplateProcess(
                order
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 underline ml-1 hover:text-green-700"
            >
              silakan hubungi admin melalui WhatsApp
            </a>{" "}
            ya. Terima kasih atas kesabarannya 🙏
          </p>
        )}

        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate("/menu")}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Kembali ke Menu
          </button>{" "}
          <button
            onClick={() => navigate(`/orders/${order.id}`)}
            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            Lihat Detail Pesanan
          </button>
        </div>
        <div className="flex py-10 justify-center w-full">
          {order.status === "Menunggu Konfirmasi" && (
            <div className="w-full">
              <button
                onClick={() => handleCancelOrder(order.id)}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-300"
              >
                Batalkan Pesanan
              </button>
              <p className="text-sm text-gray-600 text-center mt-6">
                ⚠️ Jika pesanan Anda belum dikonfirmasi dalam{" "}
                <strong>1×24 jam</strong>, silakan
                <a
                  href={`https://wa.me/6285137411338?text=${whatsappTemplate(
                    order
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 underline ml-1 hover:text-green-700"
                >
                  konfirmasi melalui WhatsApp
                </a>{" "}
                untuk mempercepat proses.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
