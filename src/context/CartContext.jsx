// contexts/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (menuItem) => {
    setCart(prevCart => {
      // Check if the item already exists in the cart
      const existingItem = prevCart.find(item => item.id === menuItem.id);
      
      if (existingItem) {
        // Increment quantity of existing item
        return prevCart.map(item => 
          item.id === menuItem.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Add new item with quantity 1
        return [...prevCart, { ...menuItem, quantity: 1 }];
      }
    });
    
    // Open cart modal whenever an item is added
    setIsCartOpen(true);
  };

  const updateQuantity = (id, quantity) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const value = {
    cart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    isCartOpen,
    openCart,
    closeCart,
    cartItemCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};