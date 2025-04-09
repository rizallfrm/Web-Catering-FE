import API from "./api";

const AdminService = {
  getDashboardStats: async () => {
    try {
      const response = await API.get("/admin/dashboard");
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  getAllUsers: async () => {
    try {
      const response = await API.get("/admin/users");
      return response.data.data.users;
    } catch (error) {
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await API.put(`/admin/users/${id}`, userData);
      return response.data.data.user;
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await API.delete(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  changeUserRole: async (id, role) => {
    try {
      const response = await API.put(`/admin/users/${id}/role`, { role });
      return response.data.data.user;
    } catch (error) {
      throw error;
    }
  },

  changeUserStatus: async (id, isActive) => {
    try {
      const response = await API.put(`/admin/users/${id}/status`, { isActive });
      return response.data.data.user;
    } catch (error) {
      throw error;
    }
  },

  getAllOrders: async () => {
    try {
      const response = await API.get("/admin/orders");
      console.log("API response:", response.data); // For debugging

      return response.data.data.orders;
    } catch (error) {
      throw error;
    }
  },
};

export default AdminService;
