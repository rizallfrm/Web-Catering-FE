import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import OrderService from "../components/services/orderService";
import LoadingSpinner from "./LoadingSpinner";
const CheckoutPage = () => {
  const { cart, isLoading: isCartLoading, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    delivery_date: "",
    wa_number: "",
    delivery_address: "",
    delivery_time: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validasi keranjang tidak kosong
    if (cart.items.length === 0) {
      setError(
        "Keranjang belanja Anda kosong. Silakan tambahkan item terlebih dahulu."
      );
      return;
    }

    // Validasi form
    if (
      !formData.delivery_date ||
      !formData.wa_number ||
      !formData.delivery_address
    ) {
      setError("Harap isi semua field yang wajib diisi");
      return;
    }

    try {
      setIsSubmitting(true);

      // Debugging: Log data sebelum dikirim
      console.log("Cart items before checkout:", cart.items);
      const deliveryDateTime = new Date(
        `${formData.delivery_date}T${formData.delivery_time}`
      );

      // Format data untuk backend
      const payload = {
        ...formData,
        delivery_date: deliveryDateTime.toISOString(),
        items: cart.items.map((item) => ({
          menu_id: item.menu_id || item.Menu?.id,
          quantity: item.quantity,
        })),
      };

      // Debugging: Log payload
      console.log("Checkout payload:", payload);

      // Create order
      const order = await OrderService.checkout(payload);
      clearCart();

      // Redirect to order confirmation page
      navigate(`/orders/${order.id}/confirmation`);
    } catch (err) {
      console.error("Checkout error details:", err);

      let errorMessage =
        err.message || "Gagal melakukan checkout. Silakan coba lagi.";

      // Handle specific error cases
      if (err.response?.data?.message?.includes("minimum order")) {
        errorMessage = err.response.data.message;
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isCartLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout Pesanan</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Informasi Pengiriman</h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 mb-2"
                  htmlFor="delivery_date"
                >
                  Tanggal Pengantaran <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="delivery_date"
                  name="delivery_date"
                  value={formData.delivery_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <span className="block text-gray-700 mb-2 pt-4">Jam</span>
                <input
                  type="time"
                  id="delivery_time"
                  name="delivery_time"
                  value={formData.delivery_time}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="wa_number">
                  Nomor WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="wa_number"
                  name="wa_number"
                  value={formData.wa_number}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Contoh: 081234567890"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 mb-2"
                  htmlFor="delivery_address"
                >
                  Alamat Pengantaran <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="delivery_address"
                  name="delivery_address"
                  value={formData.delivery_address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                ></textarea>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="notes">
                  Catatan Tambahan
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Contoh: Tanpa sambal, antar jam 10 pagi"
                ></textarea>
              </div>
              {/* Di dalam return component CheckOut.jsx */}
              {cart.items.length === 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-600">
                    Keranjang belanja Anda kosong. Silakan tambahkan item
                    terlebih dahulu.
                  </p>
                  <Link
                    to="/menu"
                    className="inline-block mt-2 text-blue-600 hover:underline"
                  >
                    Kembali ke Menu
                  </Link>
                </div>
              )}

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting || cart.items.length === 0}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md disabled:opacity-50"
              >
                {isSubmitting ? "Memproses..." : "Buat Pesanan"}
              </button>
            </form>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>

            <div className="divide-y divide-gray-200">
              {cart.items.map((item) => (
                <div key={item.id} className="py-3 flex justify-between">
                  <div>
                    <p>
                      {item.Menu?.name} × {item.quantity}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.Menu?.category}
                    </p>
                  </div>
                  <p>Rp{(item.Menu?.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between font-medium mb-2">
                <span>Subtotal:</span>
                <span>
                  Rp
                  {cart.items
                    .reduce(
                      (total, item) => total + item.Menu?.price * item.quantity,
                      0
                    )
                    .toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between font-medium mb-2">
                <span>Biaya Pengiriman:</span>
                <span>Gratis</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-200">
                <span>Total:</span>
                <span>
                  Rp
                  {cart.items
                    .reduce(
                      (total, item) => total + item.Menu?.price * item.quantity,
                      0
                    )
                    .toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
