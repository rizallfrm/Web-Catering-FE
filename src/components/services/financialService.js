import API from './api';

const FinancialService = {
  // Get financial reports
  getFinancialReports: async (params = {}) => {
    try {
      const response = await API.get('/financial/reports', { params });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching financial reports:', error);
      throw error;
    }
  },

  // Get financial dashboard stats
  getFinancialDashboard: async () => {
    try {
      const response = await API.get('/financial/dashboard');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching financial dashboard:', error);
      throw error;
    }
  },

  // Export financial reports to Excel
  exportFinancialReports: async (params = {}) => {
    try {
      const response = await API.get('/financial/export', { 
        params,
        responseType: 'blob'
      });

      // Create blob and download
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename
      const startDate = params.startDate || new Date().toISOString().split('T')[0];
      const endDate = params.endDate || new Date().toISOString().split('T')[0];
      link.download = `laporan-keuangan-DapurCateringMamake-${startDate}-${endDate}.xlsx`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Error exporting financial reports:', error);
      throw error;
    }
  }
};

export default FinancialService;