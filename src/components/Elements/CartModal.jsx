import React, { useState } from "react";
import CartItem from "./CartItem";

const CartModal = ({
  isOpen,
  closeModal,
  cart,
  updateQuantity,
  removeItem,
  clearCart,
}) => {
  const [paymentProof, setPaymentProof] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });

  if (!isOpen) return null;

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo({
      ...customerInfo,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setPaymentProof(e.target.files[0]);
  };

  const handleCheckout = () => {
    // Format cart items for WhatsApp message
    const cartItems = cart
      .map(
        (item) =>
          `${item.name} x${item.quantity} = Rp ${(
            item.price * item.quantity
          ).toLocaleString()}`
      )
      .join("\n");

    // Create WhatsApp message
    const message = `
*PESANAN BARU*
Nama: ${customerInfo.name}
Telepon: ${customerInfo.phone}
Alamat: ${customerInfo.address}

*ITEM PESANAN:*
${cartItems}

*TOTAL: Rp ${totalAmount.toLocaleString()}*
    `;

    // WhatsApp number should be replaced with your actual number
    const whatsappNumber = "628123456789"; // Replace with your WhatsApp number
    const encodedMessage = encodeURIComponent(message);

    // Open WhatsApp with pre-filled message
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodedMessage}`,
      "_blank"
    );

    // Close modal and clear cart
    closeModal();
    clearCart();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Keranjang Belanja</h2>
            <button onClick={closeModal}>
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
        </div>

        <div className="p-4">
          {cart.length === 0 ? (
            <p className="text-center py-4">Keranjang belanja Anda kosong</p>
          ) : (
            <>
              {cart.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                />
              ))}

              <div className="mt-4 py-4 border-t">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>Rp {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-medium mb-2">Informasi Pemesan</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    name="name"
                    placeholder="Nama Lengkap"
                    className="w-full p-2 border rounded"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Nomor Telepon"
                    className="w-full p-2 border rounded"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    required
                  />
                  <textarea
                    name="address"
                    placeholder="Alamat Pengiriman"
                    className="w-full p-2 border rounded"
                    rows="3"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-medium mb-2">Bukti Pembayaran</h3>
                <p className="text-sm text-gray-500 mb-2">
                  Silakan transfer ke rekening BCA: 1234567890 a/n Restoran XYZ
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full"
                />
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={clearCart}
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                >
                  Kosongkan
                </button>
                <button
                  onClick={handleCheckout}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  disabled={
                    !customerInfo.name ||
                    !customerInfo.phone ||
                    !customerInfo.address
                  }
                >
                  Pesan via WhatsApp
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;
