import React, { useState, useEffect } from 'react';
import AuthService from '../../services/authService';
import AdminService from '../../services/adminService';


const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const currentUser = AuthService.getCurrentUser();

  // Form state untuk edit user
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    isActive: true
  });

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await AdminService.getAllUsers();
      setUsers(data);
      setError(null);
      console.log("Fetched users:", data);
    } catch (err) {
      setError('Gagal mengambil data pengguna');
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email,
      role: user.role || 'user',
      isActive: user.isActive !== false // Default ke true jika undefined
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const updatedUser = await AdminService.updateUser(editingUser.id, formData);
      
      // Update user dalam state
      setUsers(users.map(user => 
        user.id === editingUser.id ? { ...user, ...updatedUser } : user
      ));
      
      setSuccess('Pengguna berhasil diperbarui');
      setIsModalOpen(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Gagal memperbarui pengguna');
      console.error("Error updating user:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      if (!window.confirm(`Apakah Anda yakin ingin mengubah role user menjadi ${newRole}?`)) {
        return;
      }
      
      setIsLoading(true);
      await AdminService.changeUserRole(userId, newRole);
      
      // Update user dalam state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      setSuccess('Role pengguna berhasil diperbarui');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Gagal mengubah role pengguna');
      console.error("Error changing user role:", err);
    } finally {
      setIsLoading(false);
    }
  };
  const handleStatusChange = async (userId, isActive) => {
    try {
      if (!window.confirm(`Apakah Anda yakin ingin ${isActive ? 'mengaktifkan' : 'menonaktifkan'} pengguna ini?`)) {
        return;
      }
      
      setIsLoading(true);
      await AdminService.changeUserStatus(userId, isActive);
      
      // Update user dalam state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isActive } : user
      ));
      
      setSuccess(`Pengguna berhasil ${isActive ? 'diaktifkan' : 'dinonaktifkan'}`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(`Gagal ${isActive ? 'mengaktifkan' : 'menonaktifkan'} pengguna`);
      console.error("Error changing user status:", err);
    } finally {
      setIsLoading(false);
    }
  };
  // Filter users berdasarkan pencarian
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">Kelola Pengguna</h2>
      
      {error && (
        <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-4 mb-4 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari pengguna..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-10 border rounded-md"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {isLoading && !isModalOpen ? (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500"></div>
          <p className="mt-2">Loading...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Nama</th>
                <th className="px-4 py-2 text-left">Email</th>
                {/* <th className="px-4 py-2 text-left">Role</th> */}
                {/* <th className="px-4 py-2 text-left">Status</th> */}
                <th className="px-4 py-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-2 text-center">Tidak ada pengguna yang ditemukan</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="px-4 py-2">{user.name || '-'}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    {/* <td className="px-4 py-2">
                      {user.id === currentUser?.id ? (
                        <span className={`px-2 py-1 rounded ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                          {user.role || 'user'}
                        </span>
                      ) : (
                        <select
                          value={user.role || 'user'}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="p-1 border rounded text-sm"
                          disabled={isLoading}
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      )}
                    </td> */}
                    {/* <td className="px-4 py-2">
                      {user.id === currentUser?.id ? (
                        <span className="px-2 py-1 rounded bg-green-100 text-green-800">
                          Aktif
                        </span>
                      ) : (
                        <div className="flex items-center">
                          <label className="inline-flex items-center cursor-pointer">
                            <input type="checkbox" 
                              className="sr-only peer"
                              checked={user.isActive !== false} // Defaultnya true jika undefined
                              onChange={() => handleStatusChange(user.id, !(user.isActive !== false))}
                              disabled={isLoading}
                            />
                            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-yellow-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                          </label>
                        </div>
                      )}
                    </td> */}
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
                        disabled={isLoading}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Edit User */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium">Edit Pengguna</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-1">Nama</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled // Email biasanya tidak diubah
                />
              </div>
              
              {/* <div className="mb-4">
                <label className="block mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  disabled={editingUser?.id === currentUser?.id} // Admin tidak bisa mengubah rolenya sendiri
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
               */}
              {/* <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="mr-2"
                    disabled={editingUser?.id === currentUser?.id} // Admin tidak bisa menonaktifkan dirinya sendiri
                  />
                  <span>Aktif</span>
                </label>
              </div> */}
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 mr-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  disabled={isLoading}
                >
                  {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;