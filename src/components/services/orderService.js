import API from "./api";

const OrderService = {
  checkout: async (orderData) => {
    try {
      const token = localStorage.getItem("token");

      // Debugging: Log data yang akan dikirim
      console.log("Sending checkout data:", orderData);

      const response = await API.post("/orders/checkout", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data.data.order;
    } catch (error) {
      console.error("Checkout error details:", error.response?.data || error);

      if (error.response) {
        // Handle specific error messages
        const backendMessage = error.response.data.message;

        if (error.response.status === 400) {
          error.message = backendMessage || "Permintaan tidak valid";
        } else if (error.response.status === 401) {
          error.message = "Sesi Anda telah berakhir, silakan login kembali";
        } else if (error.response.status === 500) {
          error.message = "Terjadi kesalahan server, silakan coba lagi nanti";
        }

        error.serverMessage = backendMessage;
        error.status = error.response.status;
      }

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
      return response.data.data.order;
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
  updateStatus: async (orderId, newStatus) => {
    try {
      const response = await API.put(`/orders/${orderId}/status`, { status: newStatus });
      return response.data.data.order || response.data.data.order;
    } catch (error) {
      throw error;
    }
  },

  verifyPayment: async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await API.put(
        `/admin/orders/${orderId}/verify-payment`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data.order;
    } catch (error) {
      console.error("Error verifying payment:", error);
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
