
import API from './api';

const OrderService = {
  checkout: async () => {
    try {
      const response = await API.post('/orders/checkout');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMyOrders: async () => {
    try {
      const response = await API.get('/orders/my-orders');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllOrders: async () => {
    try {
      const response = await API.get('/admin/orders');
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
  }
};

export default OrderService;