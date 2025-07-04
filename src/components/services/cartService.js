import API from "./api";
import AuthService from "./authService";

const CartService = {
  getCart: async () => {
    // Check if user is authenticated before making API call
    if (!AuthService.isAuthenticated()) {
      console.log("User not authenticated, returning empty cart");
      return { items: [] };
    }

    try {
      const response = await API.get("/carts");

      // Normalize response
      const normalizedData = response.data.data?.cart || { items: [] };

      // If there are CartItems but no items, use CartItems as items
      if (!normalizedData.items && normalizedData.CartItems) {
        normalizedData.items = normalizedData.CartItems;
      }

      // Ensure there's an array of items
      if (!normalizedData.items) {
        normalizedData.items = [];
      }

      return normalizedData;
    } catch (error) {
      console.error("Error in getCart:", error);

      // If 401 error, return empty cart instead of throwing
      if (error.response && error.response.status === 401) {
        return { items: [] };
      }

      throw error;
    }
  },

  addItem: async (menu_id, quantity = 1) => {
    // Check if user is authenticated before making API call
    if (!AuthService.isAuthenticated()) {
      console.log("User not authenticated, cannot add item to cart");
      throw new Error("You must be logged in to add items to cart");
    }

    try {
      // Ensure menu_id is a string, not an object
      const menuIdString = typeof menu_id === "object" ? menu_id.id : menu_id;

      const response = await API.post("/carts/add", {
        menu_id: menuIdString,
        quantity,
      });

      return response.data.data?.cart || { items: [] };
    } catch (error) {
      console.error("Error adding item to cart:", error);
      throw error;
    }
  },

  removeItem: async (itemId) => {
    // Check if user is authenticated before making API call
    if (!AuthService.isAuthenticated()) {
      console.log("User not authenticated, cannot remove item from cart");
      throw new Error("You must be logged in to remove items from cart");
    }

    try {
      const response = await API.delete(`/carts/item/${itemId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateItemQuantity: async (itemId, quantity) => {
    if (!AuthService.isAuthenticated()) {
      console.log("User not authenticated, cannot update cart");
      throw new Error("You must be logged in to update cart");
    }

    try {
      const cart = await CartService.getCart();
      const item = cart.items.find((item) => item.id === itemId);

      if (!item) {
        throw new Error(`Item with ID ${itemId} not found in cart`);
      }

      const menuId = item.menu_id || item.Menu?.id || item.menu?.id;
      if (!menuId) {
        throw new Error(`Could not determine menu_id for item ${itemId}`);
      }

      await CartService.removeItem(itemId);

      const updatedCart = await CartService.addItem(menuId, quantity);
      return updatedCart;
    } catch (error) {
      console.error("Error updating item quantity:", error);
      throw error;
    }
  },

  normalizeCartItems: (items) => {
    if (!items || !Array.isArray(items)) return [];

    return items.map((item) => ({
      id: item.id,
      quantity: Number(item.quantity) || 0,
      menu_id: item.menu_id || (item.Menu && item.Menu.id),
      Menu: item.Menu || {},
    }));
  },
};

export default CartService;
