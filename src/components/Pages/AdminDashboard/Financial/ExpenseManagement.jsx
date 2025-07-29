import React, { useState, useEffect } from "react";
import ExpenseService from "../../../services/expenseService";
import AuthService from "../../../services/authService";
import dayjs from "dayjs";

const ExpenseManagement = () => {
  const [expenses, setExpenses] = useState([]);
  const [expenseStats, setExpenseStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [pagination, setPagination] = useState({});

  // Filters
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    category: "",
    status: "",
    startDate: dayjs().startOf("month").format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
    search: "",
  });

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    category: "Lainnya",
    expense_date: dayjs().format("YYYY-MM-DD"),
    supplier: "",
    payment_method: "Cash",
    notes: "",
  });

  const categories = ["Bahan Baku", "Transport", "Gaji", "Lainnya"];

  const paymentMethods = [
    "Cash",
    "Transfer",
    "Credit Card",
    "Debit Card",
    "E-Wallet",
  ];

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    setCurrentUser(user);
    fetchExpenses();
    fetchExpenseStats();
  }, [filters]);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const data = await ExpenseService.getAllExpenses(filters);
      setExpenses(data.expenses);
      setPagination(data.pagination);
      setError(null);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError("Gagal memuat data pengeluaran");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExpenseStats = async () => {
    try {
      const stats = await ExpenseService.getExpenseStats({
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
      setExpenseStats(stats);
    } catch (err) {
      console.error("Error fetching expense stats:", err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : value,
    }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      if (editingExpense) {
        await ExpenseService.updateExpense(editingExpense.id, formData);
        setSuccess("Pengeluaran berhasil diperbarui");
      } else {
        await ExpenseService.createExpense(formData);
        setSuccess("Pengeluaran berhasil ditambahkan");
      }

      setShowModal(false);
      resetForm();
      fetchExpenses();
      fetchExpenseStats();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Gagal menyimpan pengeluaran");
      console.error("Error saving expense:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      title: expense.title,
      description: expense.description || "",
      amount: expense.amount,
      category: expense.category,
      expense_date: dayjs(expense.expense_date).format("YYYY-MM-DD"),
      supplier: expense.supplier || "",
      payment_method: expense.payment_method,
      notes: expense.notes || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pengeluaran ini?")) {
      try {
        await ExpenseService.deleteExpense(id);
        setSuccess("Pengeluaran berhasil dihapus");
        fetchExpenses();
        fetchExpenseStats();
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError("Gagal menghapus pengeluaran");
        console.error("Error deleting expense:", err);
      }
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await ExpenseService.updateExpenseStatus(id, status);
      setSuccess(
        `Pengeluaran berhasil ${
          status === "Approved" ? "disetujui" : "ditolak"
        }`
      );
      fetchExpenses();
      fetchExpenseStats();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Gagal memperbarui status pengeluaran");
      console.error("Error updating expense status:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      amount: "",
      category: "Lainnya",
      expense_date: dayjs().format("YYYY-MM-DD"),
      supplier: "",
      payment_method: "Cash",
      notes: "",
    });
    setEditingExpense(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getStatusBadge = (status) => {
    const badges = {
      Pending: "bg-yellow-100 text-yellow-800",
      Approved: "bg-green-100 text-green-800",
      Rejected: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status]}`}
      >
        {status}
      </span>
    );
  };

  const getCategoryColor = (category) => {
    const colors = {
      "Bahan Baku": "bg-blue-100 text-blue-800",
      Transport: "bg-green-100 text-green-800",
      Gaji: "bg-indigo-100 text-indigo-800",
      Lainnya: "bg-gray-100 text-gray-800",
    };

    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manajemen Pengeluaran</h2>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Tambah Pengeluaran
        </button>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="text-sm font-medium text-red-800">
            Total Pengeluaran
          </h3>
          <p className="text-2xl font-bold text-red-900">
            {formatCurrency(expenseStats.totalExpenses)}
          </p>
          <p className="text-xs text-red-600 mt-1">
            Periode: {dayjs(filters.startDate).format("DD MMM")} -{" "}
            {dayjs(filters.endDate).format("DD MMM YYYY")}
          </p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="text-sm font-medium text-yellow-800">
            Menunggu Approval
          </h3>
          <p className="text-2xl font-bold text-yellow-900">
            {expenseStats.pendingCount || 0}
          </p>
          <p className="text-xs text-yellow-600 mt-1">Pengeluaran pending</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800">
            Kategori Terbanyak
          </h3>
          <p className="text-lg font-bold text-blue-900">
            {expenseStats.expensesByCategory?.[0]?.category || "N/A"}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            {expenseStats.expensesByCategory?.[0]
              ? formatCurrency(expenseStats.expensesByCategory[0].total_amount)
              : "Rp 0"}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cari
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              placeholder="Cari pengeluaran..."
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategori
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">Semua Status</option>
              <option value="Pending">Menunggu</option>
              <option value="Approved">Disetujui</option>
              <option value="Rejected">Ditolak</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dari Tanggal
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sampai Tanggal
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          <p className="mt-2">Memuat data pengeluaran...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Tanggal
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Judul
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Kategori
                </th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">
                  Jumlah
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Dibuat Oleh
                </th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Belum ada data pengeluaran
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      {dayjs(expense.expense_date).format("DD/MM/YYYY")}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-sm">{expense.title}</p>
                        {expense.supplier && (
                          <p className="text-xs text-gray-500">
                            {expense.supplier}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                          expense.category
                        )}`}
                      >
                        {expense.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatCurrency(expense.amount)}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(expense.status)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {expense.CreatedBy?.name || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        {(expense.created_by === currentUser?.id ||
                          currentUser?.role === "admin") && (
                          <>
                            <button
                              onClick={() => handleEdit(expense)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(expense.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Hapus
                            </button>
                          </>
                        )}

                        {currentUser?.role === "admin" &&
                          expense.status === "Pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleStatusUpdate(expense.id, "Approved")
                                }
                                className="text-green-600 hover:text-green-800 text-sm"
                              >
                                Setujui
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusUpdate(expense.id, "Rejected")
                                }
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Tolak
                              </button>
                            </>
                          )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Halaman {pagination.currentPage} dari {pagination.totalPages}(
            {pagination.totalCount} total pengeluaran)
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleFilterChange("page", filters.page - 1)}
              disabled={!pagination.hasPrev}
              className="px-3 py-1 bg-gray-200 text-gray-600 rounded disabled:opacity-50 hover:bg-gray-300"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => handleFilterChange("page", filters.page + 1)}
              disabled={!pagination.hasNext}
              className="px-3 py-1 bg-gray-200 text-gray-600 rounded disabled:opacity-50 hover:bg-gray-300"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {editingExpense ? "Edit Pengeluaran" : "Tambah Pengeluaran"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Judul Pengeluaran *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Contoh: Pembelian bahan sayuran"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Deskripsi detail pengeluaran"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jumlah (Rp) *
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleFormChange}
                      required
                      min="0"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal *
                    </label>
                    <input
                      type="date"
                      name="expense_date"
                      value={formData.expense_date}
                      onChange={handleFormChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kategori
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Metode Pembayaran
                    </label>
                    <select
                      name="payment_method"
                      value={formData.payment_method}
                      onChange={handleFormChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      {paymentMethods.map((method) => (
                        <option key={method} value={method}>
                          {method}
                        </option>
                      ))}
                    </select>
                  </div> */}
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier/Toko
                  </label>
                  <input
                    type="text"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleFormChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Nama supplier atau toko"
                  />
                </div> */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catatan
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleFormChange}
                    rows="2"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Catatan tambahan"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:opacity-50"
                >
                  {isLoading
                    ? "Menyimpan..."
                    : editingExpense
                    ? "Update"
                    : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseManagement;
