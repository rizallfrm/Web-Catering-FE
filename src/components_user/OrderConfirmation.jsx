import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OrderService from "../components/services/orderService";
import LoadingSpinner from "./LoadingSpinner";
import { ExclamationCircleIcon } from "@heroicons/react/16/solid";
import { InformationCircleIcon } from "@heroicons/react/16/solid";

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
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

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!order) return null;

  return (
    <div className="container mx-auto px-4 py-8">
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
                <p className="font-medium">Pesanan Dikonfirmasi</p>
                <p className="text-sm text-gray-500">
                  Silakan lakukan pembayaran
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
                  <span className="text-white text-sm">3</span>
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
              <div className="flex justify-between">
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
              </div>
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

        {order?.status === "Dikonfirmasi" &&
          order?.payment_status === "Belum Bayar" && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Silakan upload bukti pembayaran
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Anda memiliki waktu{" "}
                      <span className="font-bold">{timeLeft}</span> untuk
                      mengupload bukti pembayaran
                    </p>
                    <form onSubmit={handleUpload} className="mt-4 space-y-3">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*,.pdf"
                        className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-yellow-100 file:text-yellow-700
                      hover:file:bg-yellow-200"
                        required
                      />
                      <button
                        type="submit"
                        disabled={!file || isUploading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
                      >
                        {isUploading ? "Mengupload..." : "Upload Bukti Bayar"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

        {order?.payment_status === "Menunggu Verifikasi" && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <InformationCircleIcon className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Bukti pembayaran telah diupload
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Admin sedang memverifikasi pembayaran Anda.
                    {order.proof_image_url && (
                      <a
                        href={order.proof_image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-blue-600 underline"
                      >
                        Lihat Bukti
                      </a>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {order.payment_status === "Sudah Dibayar" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-lg mb-2">
              Pembayaran Terverifikasi
            </h3>
            <p>Pembayaran Anda telah diverifikasi. Pesanan sedang diproses.</p>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate("/menu")}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Kembali ke Menu
          </button>
          <button
            onClick={() => navigate(`/orders/${order.id}`)}
            className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            Lihat Detail Pesanan
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
