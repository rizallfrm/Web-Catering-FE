import React, { useState, useEffect, useRef } from "react";
import MenuService from "../../services/menuService";

const MenuManagement = () => {
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image_url: "",
    min_order: 1,
    available: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [editingId, setEditingId] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchMenus = async () => {
    try {
      setIsLoading(true);
      const data = await MenuService.getAllMenus();
      setMenus(data);
      setError(null);
      console.log("Fetched menus:", data);
    } catch (err) {
      setError("Gagal mengambil data menu");
      console.error("Error fetching menus:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);

    // Membuat preview gambar
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image_url: "",
      min_order: 1,
      available: true,
    });
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);

      // Cek apakah ada file gambar untuk diupload
      let imageUrl = formData.image_url;

      // Validasi panjang URL - pastikan tidak melebihi 250 karakter
      if (imageUrl && imageUrl.length > 250) {
        setError("URL gambar terlalu panjang. Maksimal 250 karakter.");
        setIsSubmitting(false);
        return;
      }

      if (imageFile) {
        try {
          // Upload gambar
          console.log("Uploading image file:", imageFile);
          const uploadResult = await MenuService.uploadImage(imageFile);
          imageUrl = uploadResult.url;

          // Validasi panjang URL hasil upload
          if (imageUrl && imageUrl.length > 250) {
            throw new Error("URL gambar hasil upload terlalu panjang");
          }

          console.log("Image uploaded successfully:", imageUrl);
        } catch (uploadErr) {
          console.error("Error uploading image:", uploadErr);
          // Gunakan placeholder sederhana jika error
          imageUrl =
            "https://placehold.co/300x200/FFD700/000000?text=dinner-table";
        }
      }

      // Persiapkan data menu
      const menuData = {
        ...formData,
        price: parseFloat(formData.price),
        image_url: imageUrl,
      };

      console.log("Submitting menu data:", menuData);

      if (editingId) {
        console.log(`Updating menu with ID: ${editingId}`);
        await MenuService.updateMenu(editingId, menuData);
        setSuccess("Menu berhasil diperbarui");
      } else {
        console.log("Creating new menu");
        await MenuService.createMenu(menuData);
        setSuccess("Menu baru berhasil ditambahkan");
      }

      // Refresh daftar menu
      await fetchMenus();

      // Reset form
      resetForm();
      setIsFormVisible(false);

      // Hapus pesan sukses setelah 3 detik
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error submitting menu:", err);
      setError(
        editingId ? "Gagal memperbarui menu" : "Gagal membuat menu baru"
      );

      // Tampilkan detail error jika ada
      if (err.response && err.response.data && err.response.data.message) {
        setError(
          `${
            editingId ? "Gagal memperbarui menu" : "Gagal membuat menu baru"
          }: ${err.response.data.message}`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAvailability = async (menu) => {
    try {
      const updatedMenu = {
        ...menu,
        available: !menu.available,
      };

      await MenuService.updateMenu(menu.id, updatedMenu);
      setSuccess(
        `Menu "${menu.name}" sekarang ${
          updatedMenu.available ? "tersedia" : "tidak tersedia"
        }`
      );
      fetchMenus();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error updating availability:", err);
      setError("Gagal mengubah status ketersediaan menu");
    }
  };

  const handleEdit = (menu) => {
    console.log("Editing menu:", menu);
    setFormData({
      name: menu.name,
      description: menu.description || "",
      price: String(menu.price),
      image_url: menu.image_url || "",
      category: menu.category,
      min_order: menu.min_order || 1,
      available: menu.available || true,
    });
    setImagePreview(menu.image_url);
    setEditingId(menu.id);
    setIsFormVisible(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus menu ini?")) {
      try {
        setIsLoading(true);
        console.log(`Deleting menu with ID: ${id}`);
        await MenuService.deleteMenu(id);
        setSuccess("Menu berhasil dihapus");
        await fetchMenus();

        // Hapus pesan sukses setelah 3 detik
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        console.error("Error deleting menu:", err);
        setError("Gagal menghapus menu");

        // Tampilkan detail error jika ada
        if (err.response && err.response.data && err.response.data.message) {
          setError(`Gagal menghapus menu: ${err.response.data.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">Manajemen Menu</h2>
        <button
          onClick={() => {
            resetForm();
            setIsFormVisible(!isFormVisible);
          }}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          {isFormVisible ? "Batal" : "Tambah Menu Baru"}
        </button>
      </div>

      {error && (
        <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {success && (
        <div className="p-4 mb-4 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      {isFormVisible && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded">
          <h3 className="text-lg font-medium mb-4">
            {editingId ? "Edit Menu" : "Tambah Menu Baru"}
          </h3>
          <div className="mb-4">
            <label className="block mb-1">Nama Menu</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Kategori</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Pilih kategori</option>
              {/* <option value="Harian">Harian</option> */}
              <option value="Acara">Acara</option>
              <option value="Prasmanan">Prasmanan</option>
            </select>
          </div>{" "}
          {/* <div className="mb-4">
            <label className="block mb-1">Kategori</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div> */}
          <div className="mb-4">
            <label className="block mb-1">Minimal Order</label>
            <input
              type="text"
              name="min_order"
              value={formData.min_order}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Ketersediaan</label>
            <select
              name="available"
              value={formData.available}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="true">Ya</option>
              <option value="false">Tidak</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Deskripsi</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="3"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Harga</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Gambar</label>
            <div className="flex items-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="w-full p-2 border rounded"
              />
            </div>

            {/* URL Gambar Existing */}
            {!imageFile && (
              <div className="mt-2">
                <label className="block mb-1">URL Gambar</label>
                <input
                  type="text"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="Masukkan URL gambar (opsional)"
                />
              </div>
            )}

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-2">
                <p className="mb-1">Preview:</p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-40 h-40 object-cover border rounded"
                />
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setIsFormVisible(false);
              }}
              className="px-4 py-2 mr-2 bg-gray-300 rounded hover:bg-gray-400"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Menyimpan..."
                : editingId
                ? "Update Menu"
                : "Simpan Menu"}
            </button>
          </div>
        </form>
      )}

      {isLoading && !isFormVisible ? (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500"></div>
          <p className="mt-2">Loading...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Gambar</th>
                <th className="px-4 py-2 text-left">Nama</th>
                <th className="px-4 py-2 text-left">Kategori</th>

                <th className="px-4 py-2 text-left">Deskripsi</th>
                <th className="px-4 py-2 text-left">Harga</th>
                <th className="px-4 py-2 text-left">Aksi</th>
                <th className="px-4 py-2 text-left">Ketersediaan</th>
              </tr>
            </thead>
            <tbody>
              {menus.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-2 text-center">
                    Tidak ada menu tersedia
                  </td>
                </tr>
              ) : (
                menus.map((menu) => (
                  <tr key={menu.id} className="border-b">
                    <td className="px-4 py-2">
                      {menu.image_url ? (
                        <img
                          src={menu.image_url}
                          alt={menu.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                          No Image
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2">{menu.name}</td>
                    <td className="px-4 py-2">{menu.category}</td>

                    <td className="px-4 py-2">{menu.description || "-"}</td>
                    <td className="px-4 py-2">
                      Rp {menu.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEdit(menu)}
                        className="px-3 py-1 mr-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(menu.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Hapus
                      </button>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                          menu.available
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {menu.available ? "Nonaktifkan" : "Aktifkan"}
                      </span>
                      <button
                        onClick={() => handleToggleAvailability(menu)}
                        className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                      >
                        Ubah
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
