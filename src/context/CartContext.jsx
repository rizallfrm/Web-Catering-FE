import React, { createContext, useState, useContext, useEffect } from "react";
import CartService from "../components/services/cartService";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load cart when user is authenticated
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const cartData = await CartService.getCart();
      console.log("Cart data received:", cartData);

      // Pastikan cartData memiliki struktur yang diharapkan
      if (!cartData.items && Array.isArray(cartData.CartItems)) {
        // Jika backend mengembalikan CartItems bukan items
        setCart({
          ...cartData,
          items: cartData.CartItems,
        });
      } else {
        setCart({
          ...cartData,
          items: cartData.items || [],
        });
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Failed to load cart");
      // Reset cart items jika terjadi error
      setCart({ items: [] });
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (menuId, quantity = 1) => {
    try {
      setIsLoading(true);
      await CartService.addItem(menuId, quantity);
      await fetchCart();
      return true;
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError("Failed to add item to cart");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setIsLoading(true);
      await CartService.removeItem(itemId);
      await fetchCart();
      return true;
    } catch (err) {
      console.error("Error removing from cart:", err);
      setError("Failed to remove item from cart");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateItemQuantity = async (itemId, quantity) => {
    try {
      setIsLoading(true);
      await CartService.updateItemQuantity(itemId, quantity);
      await fetchCart();
      return true;
    } catch (err) {
      console.error("Error updating cart item quantity:", err);
      setError("Failed to update item quantity");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setIsLoading(true);
      setCart({ items: [] });
      setError(null);
      return true;
    } catch (err) {
      console.error("Error clearing cart:", err);
      setError("Failed to clear cart");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const openCart = () => {
    console.log("Opening cart...");
    setIsCartOpen(true);
  };

  const closeCart = () => {
    console.log("Closing cart..."); // Debug

    setIsCartOpen(false);
  };

  // Get total items count
  const cartItemCount =
    cart && cart.items && Array.isArray(cart.items)
      ? cart.items.reduce(
          (total, item) => total + (Number(item.quantity) || 0),
          0
        )
      : 0;

  console.log("Current cart items:", cart.items, "Count:", cartItemCount);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        isLoading,
        error,
        cartItemCount,
        fetchCart,
        addToCart,
        removeFromCart,
        updateItemQuantity,
        clearCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
