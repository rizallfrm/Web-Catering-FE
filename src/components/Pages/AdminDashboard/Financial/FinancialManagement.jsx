import React, { useState, useEffect } from 'react';
import FinancialService from '../../../services/financialService';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
dayjs.locale('id');

const FinancialManagement = () => {
  const [financialData, setFinancialData] = useState({
    summary: {},
    periodData: [],
    topMenus: [],
    orders: [],
    pagination: {}
  });
  const [dashboardStats, setDashboardStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Filter states
  const [filters, setFilters] = useState({
    period: 'daily',
    startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
    page: 1,
    limit: 20
  });

  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchFinancialData();
    fetchDashboardStats();
  }, [filters]);

  const fetchFinancialData = async () => {
    try {
      setIsLoading(true);
      const data = await FinancialService.getFinancialReports(filters);
      setFinancialData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching financial data:', err);
      setError('Gagal memuat data keuangan');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const stats = await FinancialService.getFinancialDashboard();
      setDashboardStats(stats);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value // Reset page when other filters change
    }));
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await FinancialService.exportFinancialReports({
        period: filters.period,
        startDate: filters.startDate,
        endDate: filters.endDate
      });
      setSuccess('Laporan berhasil diunduh');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Gagal mengunduh laporan');
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).format('dddd, D MMMM YYYY');
  };

  const formatPeriodData = (data, period) => {
    if (period === 'daily') {
      return dayjs(data.date).format('D MMM YYYY');
    } else if (period === 'weekly') {
      const weekStart = dayjs(data.week_start);
      const weekEnd = weekStart.add(6, 'days');
      return `${weekStart.format('D MMM')} - ${weekEnd.format('D MMM YYYY')}`;
    } else if (period === 'monthly') {
      return dayjs(data.month_start).format('MMMM YYYY');
    }
    return data.date;
  };

  const DashboardTab = () => (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Omset Hari Ini</p>
              <p className="text-2xl font-bold">{formatCurrency(dashboardStats.todayRevenue)}</p>
            </div>
            <div className="bg-blue-400 bg-opacity-30 p-3 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Omset Bulan Ini</p>
              <p className="text-2xl font-bold">{formatCurrency(dashboardStats.thisMonthRevenue)}</p>
              <p className="text-green-100 text-xs mt-1">
                Pertumbuhan: {dashboardStats.monthlyGrowth > 0 ? '+' : ''}{dashboardStats.monthlyGrowth}%
              </p>
            </div>
            <div className="bg-green-400 bg-opacity-30 p-3 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Rata-rata Nilai Pesanan</p>
              <p className="text-2xl font-bold">{formatCurrency(dashboardStats.avgOrderValue)}</p>
              <p className="text-purple-100 text-xs mt-1">
                {dashboardStats.thisMonthOrders} pesanan bulan ini
              </p>
            </div>
            <div className="bg-purple-400 bg-opacity-30 p-3 rounded-lg">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Ringkasan Periode</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-800">{financialData.summary.totalOrders}</p>
            <p className="text-sm text-gray-600">Total Pesanan</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(financialData.summary.totalRevenue)}</p>
            <p className="text-sm text-gray-600">Total Omset</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(financialData.summary.menuRevenue)}</p>
            <p className="text-sm text-gray-600">Pendapatan Menu</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-800">{formatCurrency(financialData.summary.totalDeliveryFees)}</p>
            <p className="text-sm text-gray-600">Biaya Ongkir</p>
          </div>
        </div>
      </div>

      {/* Top Selling Menus */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Menu Terlaris</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Menu</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Kategori</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Terjual</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Pendapatan</th>
              </tr>
            </thead>
            <tbody>
              {financialData.topMenus && financialData.topMenus.length > 0 ? (
                financialData.topMenus.map((menu, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-3 font-medium">{menu.menu_name}</td>
                    <td className="px-4 py-3 text-gray-600">{menu.category}</td>
                    <td className="px-4 py-3 text-right">{menu.total_quantity} porsi</td>
                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(menu.total_revenue)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-3 text-center text-gray-500">
                    Belum ada data menu terlaris
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const ReportsTab = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Filter Laporan</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Periode</label>
            <select
              value={filters.period}
              onChange={(e) => handleFilterChange('period', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="daily">Harian</option>
              <option value="weekly">Mingguan</option>
              <option value="monthly">Bulanan</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center justify-center disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mengekspor...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Excel
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Period Data Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">
          Tren Omset {filters.period === 'daily' ? 'Harian' : filters.period === 'weekly' ? 'Mingguan' : 'Bulanan'}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Periode</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Pesanan</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Pendapatan Menu</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Ongkir</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Total</th>
              </tr>
            </thead>
            <tbody>
              {financialData.periodData && financialData.periodData.length > 0 ? (
                financialData.periodData.map((period, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{formatPeriodData(period, filters.period)}</td>
                    <td className="px-4 py-3 text-right">{period.order_count}</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(period.menu_revenue)}</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(period.delivery_fees)}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(period.total_revenue)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-3 text-center text-gray-500">
                    Belum ada data untuk periode ini
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Detail Pesanan</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">No. Pesanan</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Tanggal</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Pelanggan</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Total</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Area</th>
              </tr>
            </thead>
            <tbody>
              {financialData.orders && financialData.orders.length > 0 ? (
                financialData.orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-sm">#{order.id}</td>
                    <td className="px-4 py-3">{dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}</td>
                    <td className="px-4 py-3">{order.User?.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(order.total_price)}</td>
                    <td className="px-4 py-3">{order.delivery_area || 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-3 text-center text-gray-500">
                    Belum ada data pesanan untuk periode ini
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {financialData.pagination && financialData.pagination.totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Halaman {financialData.pagination.currentPage} dari {financialData.pagination.totalPages}
              ({financialData.pagination.totalCount} total pesanan)
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleFilterChange('page', filters.page - 1)}
                disabled={!financialData.pagination.hasPrev}
                className="px-3 py-1 bg-gray-200 text-gray-600 rounded disabled:opacity-50 hover:bg-gray-300"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => handleFilterChange('page', filters.page + 1)}
                disabled={!financialData.pagination.hasNext}
                className="px-3 py-1 bg-gray-200 text-gray-600 rounded disabled:opacity-50 hover:bg-gray-300"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Laporan Keuangan</h2>
        <div className="text-sm text-gray-500">
          Data diperbarui: {dayjs().format('DD MMMM YYYY, HH:mm')}
        </div>
      </div>

      {error && (
        <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 mb-4 bg-green-100 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'dashboard'
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reports'
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Laporan Detail
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          <p className="mt-2">Memuat data keuangan...</p>
        </div>
      ) : (
        <>
          {activeTab === 'dashboard' && <DashboardTab />}
          {activeTab === 'reports' && <ReportsTab />}
        </>
      )}
    </div>
  );
};

export default FinancialManagement;