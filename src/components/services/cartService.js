import API from "./api";

const CartService = {
  getCart: async () => {
    try {
      const response = await API.get("/carts");

      // Log response untuk debugging
      console.log("Raw cart response:", response.data);

      // Normalisasi respons
      const normalizedData = response.data;

      // Jika ada CartItems tapi tidak ada items, gunakan CartItems sebagai items
      if (!normalizedData.items && normalizedData.CartItems) {
        normalizedData.items = normalizedData.CartItems;
      }

      // Pastikan ada array items
      if (!normalizedData.items) {
        normalizedData.items = [];
      }

      return normalizedData;
    } catch (error) {
      console.error("Error in getCart:", error);
      throw error;
    }
  },

  addItem: async (menu_id, quantity = 1) => {
    try {
      // Pastikan menu_id adalah string, bukan objek
      const menuIdString = typeof menu_id === "object" ? menu_id.id : menu_id;

      const response = await API.post("/carts/add", {
        menu_id: menuIdString,
        quantity,
      });

      return response.data;
    } catch (error) {
      console.error("Error adding item to cart:", error);
      throw error;
    }
  },

  removeItem: async (itemId) => {
    try {
      const response = await API.delete(`/carts/item/${itemId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateItemQuantity: async (itemId, quantity) => {
    try {
      // Since there's no direct update endpoint, we'll implement a workaround
      // First, get the current cart to find the menu_id for this item
      const cart = await CartService.getCart();
      const item = cart.items.find((item) => item.id === itemId);

      if (!item) {
        throw new Error(`Item with ID ${itemId} not found in cart`);
      }

      // Store the menu_id
      const menuId = item.menu_id || (item.Menu && item.Menu.id);

      if (!menuId) {
        throw new Error(`Could not determine menu_id for item ${itemId}`);
      }

      // Remove the current item
      await CartService.removeItem(itemId);

      // Add it back with the new quantity
      const response = await CartService.addItem(menuId, quantity);
      return response;
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
