import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import OrderService from "../components/services/orderService";
import LoadingSpinner from "./LoadingSpinner";

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");

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
    const fetchOrder = async () => {
      try {
        const orderData = await OrderService.getOrderDetails(id);
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

  const getStatusBadge = (status) => {
    switch (status) {
      case "Menunggu Konfirmasi":
        return "bg-yellow-100 text-yellow-800";
      case "Menunggu Verifikasi":
        return "bg-yellow-500 text-yellow-100";
      case "Dikonfirmasi":
        return "bg-blue-100 text-blue-800";
      case "Diproses":
        return "bg-purple-100 text-purple-800";
      case "Selesai":
        return "bg-green-100 text-green-800";
      case "Dibatalkan":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!order) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">Detail Pesanan</h1>
            <p className="text-gray-500">ID: #{order.id}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
              order.status
            )}`}
          >
            {order.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Informasi Pesanan</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600">Tanggal Pesan</p>
                <p>
                  {new Date(order.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                {/* <div className="flex-col">
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
                </div> */}

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
                        <span className="text-gray-600">
                          Tanggal Pengantaran:
                        </span>
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
              </div>
              <div>
                <p className="text-gray-600">Alamat Pengantaran</p>
                <p>{order.delivery_address}</p>
              </div>
              <div>
                <p className="text-gray-600">Area Pengiriman</p>
                <p>{order.delivery_area}</p>
              </div>
              <div>
                <p className="text-gray-600">Catatan</p>
                <p>{order.delivery_notes || "-"}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Informasi Pembayaran</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600">Status Pembayaran</p>
                <p className="capitalize">
                  {order.payment_status?.toLowerCase()}
                </p>
              </div>
              <div>
                {" "}
                <p className="text-gray-600">Harga Ongkos Kirim</p>
                <p className="font-bold">
                  Rp{order.delivery_fee?.toLocaleString()}
                </p>
                <p className="text-gray-600">Total Pembayaran</p>
                <p className="font-bold">
                  Rp{order.total_price?.toLocaleString()}
                </p>
              </div>
              {order.proof_image_url && (
                <div>
                  <p className="text-gray-600">Bukti Pembayaran</p>
                  <a
                    href={order.proof_image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Lihat Bukti
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Item Pesanan</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            {order.OrderItems?.map((item) => (
              <div
                key={item.id}
                className="py-3 border-b border-gray-200 last:border-0 flex justify-between"
              >
                <div>
                  <p className="font-medium">{item.Menu?.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} × Rp{item.price?.toLocaleString()}
                  </p>
                </div>
                <p>Rp{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}

            <div className="pt-4 mt-4 border-t border-gray-200">
              <div className="flex justify-between font-medium">
                <span>Subtotal:</span>
                <span>Rp{order.total_price?.toLocaleString()}</span>
              </div>
              {/* <div className="flex justify-between font-medium">
                <span>Biaya Pengiriman:</span>
                <span>Gratis</span>
              </div> */}
              <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-200">
                <span>Total:</span>
                <span>Rp{order.total_price?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {order.status === "Dikonfirmasi" &&
          order.payment_status === "Belum Bayar" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-lg mb-2">
                Lanjutkan Pembayaran
              </h3>
              <p className="mb-4">Silakan transfer ke rekening berikut:</p>
              <p>
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

              <div className="mb-4">
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
      </div>
    </div>
  );
};

export default OrderDetailPage;
