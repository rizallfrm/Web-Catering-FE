import API from "./api";

const OrderService = {
  checkout: async () => {
    try {
      const response = await API.post("/orders/checkout");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMyOrders: async () => {
    try {
      const response = await API.get("/orders/my-orders");
      return (
        response.data.orders || response.data.data?.orders || response.data
      );
    } catch (error) {
      throw error;
    }
  },
  getOrderDetails: async (orderId) => {
    try {
      const response = await API.get(`/orders/${orderId}`);
      return response.data.order;
    } catch (error) {
      throw error;
    }
  },

  getAllOrders: async () => {
    try {
      const response = await API.get("/admin/orders");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  cancelOrder: async (orderId) => {
    try {
      const response = await API.put(`/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  updateStatus: async (orderId, status) => {
    try {
      const response = await API.put(`/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  uploadPaymentProof: async (orderId, formData) => {
    try {
      const response = await API.post(
        `/orders/${orderId}/payment-proof`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000, // Timeout 30 detik
        }
      );
      return response.data;
    } catch (error) {
      // Tambahkan informasi error lebih detail
      if (error.response) {
        error.serverMessage = error.response.data.message || "Upload failed";
        error.status = error.response.status;
      }
      throw error;
    }
  },
};

export default OrderService;
