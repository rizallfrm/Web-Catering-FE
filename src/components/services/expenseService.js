import API from './api';

const ExpenseService = {
  // Create new expense
  createExpense: async (expenseData) => {
    try {
      const response = await API.post('/expenses', expenseData);
      return response.data.data.expense;
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  },

  // Get all expenses with filters
  getAllExpenses: async (params = {}) => {
    try {
      const response = await API.get('/expenses', { params });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
  },

  // Get expense by ID
  getExpenseById: async (id) => {
    try {
      const response = await API.get(`/expenses/${id}`);
      return response.data.data.expense;
    } catch (error) {
      console.error('Error fetching expense:', error);
      throw error;
    }
  },

  // Update expense
  updateExpense: async (id, expenseData) => {
    try {
      const response = await API.put(`/expenses/${id}`, expenseData);
      return response.data.data.expense;
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  },

  // Delete expense
  deleteExpense: async (id) => {
    try {
      const response = await API.delete(`/expenses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  },

  // Update expense status (Admin only)
  updateExpenseStatus: async (id, status, notes = '') => {
    try {
      const response = await API.put(`/expenses/${id}/status`, { status, notes });
      return response.data.data.expense;
    } catch (error) {
      console.error('Error updating expense status:', error);
      throw error;
    }
  },

  // Get expense statistics
  getExpenseStats: async (params = {}) => {
    try {
      const response = await API.get('/expenses/stats', { params });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching expense stats:', error);
      throw error;
    }
  }
};

export default ExpenseService;