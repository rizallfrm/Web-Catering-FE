import React, { createContext, useState, useContext, useEffect } from 'react';
import CartService from '../components/services/cartService';
import AuthService from '../components/services/authService'

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Get authentication status
  const isAuthenticated = AuthService.isAuthenticated();

  // Load cart data from API only if authenticated
  const fetchCart = async () => {
    // Don't try to fetch if not authenticated
    if (!isAuthenticated) {
      setCart({ items: [] });
      return;
    }
    
    setIsLoading(true);
    try {
      const cartData = await CartService.getCart();
      setCart(cartData);
      setError(null);
    } catch (err) {
      // Only set error if it's not an auth error (those are handled by API interceptor)
      if (!err.response || err.response.status !== 401) {
        setError('Failed to load cart. Please try again.');
        console.error('Error fetching cart:', err);
      }
      // Clear cart on error
      setCart({ items: [] });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch cart whenever auth status changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Clear cart if not authenticated
      setCart({ items: [] });
    }
  }, [isAuthenticated]);

  // Cart operations
  const addItem = async (menuId, quantity = 1) => {
    if (!isAuthenticated) {
      console.error('Cannot add item - user not authenticated');
      return;
    }
    
    try {
      await CartService.addItem(menuId, quantity);
      fetchCart(); // Refresh cart after adding item
    } catch (err) {
      console.error('Error adding item to cart:', err);
      setError('Failed to add item to cart');
    }
  };

  const removeItem = async (itemId) => {
    if (!isAuthenticated) return;
    
    try {
      await CartService.removeItem(itemId);
      fetchCart(); // Refresh cart after removing item
    } catch (err) {
      console.error('Error removing item from cart:', err);
      setError('Failed to remove item from cart');
    }
  };

  const updateItemQuantity = async (itemId, quantity) => {
    if (!isAuthenticated) return;
    
    try {
      await CartService.updateItemQuantity(itemId, quantity);
      fetchCart(); // Refresh cart after updating quantity
    } catch (err) {
      console.error('Error updating item quantity:', err);
      setError('Failed to update item quantity');
    }
  };

  const clearCart = () => {
    setCart({ items: [] });
  };

  // Cart modal controls
  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  // Calculate cart item count
  const cartItemCount = cart.items ? cart.items.reduce((total, item) => total + (Number(item.quantity) || 0), 0) : 0;

  const value = {
    cart,
    cartItemCount,
    isLoading,
    error,
    isCartOpen,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    openCart,
    closeCart,
    refreshCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;