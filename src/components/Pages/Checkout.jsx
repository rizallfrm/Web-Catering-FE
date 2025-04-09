import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartService from '../services/cartService';
import OrderService from '../services/orderService';

const Checkout = () => {
  const [cart, setCart] = useState({ items: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const cartData = await CartService.getCart();
      setCart(cartData);
      setError(null);
    } catch (err) {
      setError('Gagal memuat keranjang');
      console.error('Error fetching cart:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    try {
      setIsSubmitting(true);
      const response = await OrderService.checkout();
      setSuccess('Pesanan berhasil dibuat! Silakan kirim bukti pembayaran via WhatsApp.');
      
      // Redirect ke halaman pesanan saya setelah 3 detik
      setTimeout(() => {
        navigate('/my-orders');
      }, 3000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Gagal melakukan checkout');
      }
      console.error('Error during checkout:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      return total + (item.Menu.price * item.quantity);
    }, 0);
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
          <p className="mb-4">Keranjang belanja Anda kosong. Silakan tambahkan item ke keranjang terlebih dahulu.</p>
          <button
            onClick={() => navigate('/menu')}
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
                <span>Rp {(item.Menu.price * item.quantity).toLocaleString()}</span>
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

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Informasi Pembayaran</h2>
          <p className="mb-2">Silakan transfer ke rekening berikut:</p>
          <div className="bg-gray-100 p-4 rounded">
            <p className="font-semibold">Bank XYZ</p>
            <p>Nomor Rekening: 1234-5678-9012</p>
            <p>Atas Nama: Catering ABC</p>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Setelah melakukan pembayaran, kirimkan bukti transfer melalui WhatsApp ke nomor 0812-3456-7890.
          </p>
        </div>

        <button
          onClick={handleCheckout}
          disabled={isSubmitting || success}
          className={`w-full py-3 rounded ${
            isSubmitting || success
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-yellow-500 hover:bg-yellow-600 text-white'
          }`}
        >
          {isSubmitting ? 'Memproses...' : success ? 'Pesanan Berhasil Dibuat' : 'Konfirmasi Pesanan'}
        </button>

        {!success && (
          <button
            onClick={() => navigate('/menu')}
            className="w-full mt-3 py-3 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Kembali Berbelanja
          </button>
        )}
      </div>
    </div>
  );
};

export default Checkout;