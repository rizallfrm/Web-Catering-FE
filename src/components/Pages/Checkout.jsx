import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CartService from "../services/cartService";
import OrderService from "../services/orderService";

const Checkout = () => {
  const [cart, setCart] = useState({ items: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [orderId, setOrderId] = useState(null);

  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
  });
  useEffect(() => {
    fetchCart();
  }, []);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi tipe file
    if (!file.type.match("image.*")) {
      setError("Hanya file gambar yang diperbolehkan");
      return;
    }

    // Validasi ukuran file (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Ukuran file maksimal 2MB");
      return;
    }

    setImageFile(file);
    setError(null);

    // Membuat preview gambar
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const cartData = await CartService.getCart();
      setCart(cartData);
      setError(null);
    } catch (err) {
      setError("Gagal memuat keranjang");
      console.error("Error fetching cart:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    try {
      if (!imageFile) {
        <p className="text-red-500 text-sm mt-2">
          Silakan upload bukti pembayaran terlebih dahulu.
        </p>;
        setError("Harap upload bukti pembayaran sebelum konfirmasi pesanan.");
        return;
      }

      setIsSubmitting(true);
      setError(null);

      // 1. Checkout (buat order)
      const response = await OrderService.checkout();
      const newOrderId = response.data.order.id;
      setOrderId(newOrderId);

      // 2. Upload bukti pembayaran
      const formDataUpload = new FormData();
      formDataUpload.append("payment_proof", imageFile);

      const uploadResponse = await OrderService.uploadPaymentProof(
        newOrderId,
        formDataUpload
      );

      // 3. Berhasil
      setSuccess("Pesanan berhasil dibuat dan bukti pembayaran telah dikirim!");
      setTimeout(() => {
        navigate("/my-orders");
      }, 3000);
    } catch (err) {
      console.error("Detail error:", {
        message: err.message,
        response: err.response?.data,
        stack: err.stack,
      });

      const errorMessage =
        err.response?.data?.message ||
        "Gagal memproses pesanan. Silakan coba lagi atau hubungi admin.";

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      return total + item.Menu.price * item.quantity;
    }, 0);
  };

  const handlePaymentSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (!imageFile) {
        setError("Harap pilih file bukti pembayaran");
        return;
      }

      const formData = new FormData();
      formData.append("payment_proof", imageFile);

      console.log("Mengupload bukti pembayaran untuk order:", orderId);

      const uploadResponse = await OrderService.uploadPaymentProof(
        orderId,
        formData
      );

      console.log("Upload berhasil:", uploadResponse);

      setSuccess(
        "Bukti pembayaran berhasil diupload! Pesanan Anda akan segera diproses."
      );

      setTimeout(() => {
        navigate("/my-orders");
      }, 3000);
    } catch (err) {
      console.error("Detail error:", {
        message: err.message,
        response: err.response?.data,
        stack: err.stack,
      });

      const errorMessage =
        err.response?.data?.message ||
        "Gagal mengupload bukti pembayaran. Silakan coba lagi atau hubungi admin.";

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            <p className="mt-2">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Keranjang Kosong</h2>
          <p className="mb-4">
            Keranjang belanja Anda kosong. Silakan tambahkan item ke keranjang
            terlebih dahulu.
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Lihat Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        {error && (
          <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 mb-4 bg-green-100 text-green-700 rounded">
            {success}
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Ringkasan Pesanan</h2>
          <div className="space-y-3">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <span className="font-medium">{item.quantity}x </span>
                  <span>{item.Menu.name}</span>
                </div>
                <span>
                  Rp {(item.Menu.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>Rp {calculateTotal().toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1">Upload Bukti Pembayaran</label>
          <div className="flex items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-2">
              <p className="mb-1">Preview:</p>
              <img
                src={imagePreview}
                alt="Preview"
                className="w-40 h-40 object-cover border rounded"
              />
            </div>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Informasi Pembayaran</h2>
          <p className="mb-2">Silakan transfer ke rekening berikut:</p>
          <div className="bg-gray-100 p-4 rounded">
            <p className="font-semibold">Bank XYZ</p>
            <p>Nomor Rekening: 1234-5678-9012</p>
            <p>Atas Nama: Catering ABC</p>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Setelah upload bukti pembayaran, konfirmasi pesanan Anda melalui
            WhatsApp ke nomor 0812-3456-7890.
          </p>
        </div>

        <button
          onClick={handleCheckout}
          className={`w-full py-3 rounded ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-yellow-500 hover:bg-yellow-600 text-white"
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Memproses..." : "Konfirmasi Pesanan"}
        </button>

        {!success && (
          <button
            onClick={() => navigate("/menu")}
            className="w-full mt-3 py-3 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Kembali Belanja
          </button>
        )}
      </div>
    </div>
  );
};

export default Checkout;
