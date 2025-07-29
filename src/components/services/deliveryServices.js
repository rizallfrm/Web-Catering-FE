import API from "./api";

const DeliveryService = {
  // Calculate delivery fee
  calculateFee: async (payload) => {
    try {
      const response = await API.post("/delivery/calculate-fee", payload);
      return response.data;
    } catch (error) {
      console.error("Error calculating delivery fee:", error);
      throw error;
    }
  },

  // Get address suggestions
  getSuggestions: async (query) => {
    try {
      const response = await API.get(`/delivery/suggest?query=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error("Error getting suggestions:", error);
      throw error;
    }
  },

  // Validate address
  validateAddress: async (address) => {
    try {
      const response = await API.post("/delivery/validate", { address });
      return response.data;
    } catch (error) {
      console.error("Error validating address:", error);
      throw error;
    }
  },

  // Get all delivery areas
  getDeliveryAreas: async () => {
    try {
      const response = await API.get("/delivery/areas");
      return response.data;
    } catch (error) {
      console.error("Error getting delivery areas:", error);
      throw error;
    }
  },
};

export default DeliveryService;