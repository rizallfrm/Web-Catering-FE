import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CartService from "../services/cartService";

const CartModal = ({ isOpen, onClose }) => {
  const [cart, setCart] = useState({ items: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen]);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const cartData = await CartService.getCart();
      setCart({
        ...cartData,
        items: cartData.items || [], 
      });
      setError(null);
    } catch (err) {
      setError("Gagal memuat keranjang");
      console.error("Error fetching cart:", err);
      setCart({ items: [] });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      setIsUpdating(prev => ({ ...prev, [itemId]: true }));
      await CartService.removeItem(itemId);
      await fetchCart();
    } catch (err) {
      setError("Gagal menghapus item");
      console.error("Error removing item:", err);
    } finally {
      setIsUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    // Don't allow quantities less than 1
    if (quantity < 1) return;

    try {
      setIsUpdating(prev => ({ ...prev, [itemId]: true }));
      await CartService.updateItemQuantity(itemId, quantity);
      await fetchCart();
    } catch (err) {
      setError("Gagal update jumlah item");
      console.error("Error updating quantity:", err);
    } finally {
      setIsUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      return total + (item.Menu?.price || 0) * item.quantity;
    }, 0);
  };

  const itemsCount = cart?.items?.length || 0;
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Keranjang Belanja</h2>
          <button
            onClick={onClose}
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

        {error && (
          <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            <p className="mt-2">Loading...</p>
          </div>
        ) : cart?.items?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Keranjang belanja Anda kosong</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-4"
                >
                  <div>
                    <h3 className="font-medium">{item.Menu?.name || 'Menu Item'}</h3>
                    <p className="text-gray-600">
                      Rp {(item.Menu?.price || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={isUpdating[item.id]}
                      className={`px-2 py-1 bg-gray-200 rounded-l ${isUpdating[item.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      -
                    </button>
                    <span className="px-4 py-1 bg-gray-100">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={isUpdating[item.id]}
                      className={`px-2 py-1 bg-gray-200 rounded-r ${isUpdating[item.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={isUpdating[item.id]}
                      className={`ml-2 text-red-500 hover:text-red-700 ${isUpdating[item.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isUpdating[item.id] ? (
                        <div className="animate-spin h-5 w-5 border-2 border-red-500 rounded-full border-t-transparent"></div>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Total:</span>
                <span className="font-semibold">
                  Rp {calculateTotal().toLocaleString()}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={isLoading || itemsCount === 0}
                className={`w-full py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 ${
                  (isLoading || itemsCount === 0) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartModal;