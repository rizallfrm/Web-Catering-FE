import API from './api';

const MenuService = {
  getAllMenus: async () => {
    try {
      const response = await API.get('/menus');
      return response.data.data.menus;
    } catch (error) {
      throw error;
    }
  },

  getMenuById: async (id) => {
    try {
      const response = await API.get(`/menus/${id}`);
      return response.data.data.menu;
    } catch (error) {
      throw error;
    }
  },

  createMenu: async (menuData) => {
    try {
      const response = await API.post('/menus', menuData);
      return response.data.data.menu;
    } catch (error) {
      throw error;
    }
  },

  updateMenu: async (id, menuData) => {
    try {
      const response = await API.put(`/menus/${id}`, menuData);
      return response.data.data.menu;
    } catch (error) {
      throw error;
    }
  },

  deleteMenu: async (id) => {
    try {
      const response = await API.delete(`/menus/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  uploadImage: async (file) => {
    try {
      // Buat form data untuk upload
      const formData = new FormData();
      formData.append('image', file);
      
      // Upload image melalui endpoint upload
      const response = await API.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return { url: response.data.url };
    } catch (error) {
      console.error('Error uploading image:', error);
      // Fallback ke placeholder jika upload gagal - gunakan URL pendek
      return { url: `https://via.placeholder.com/300x200/FFD700/000000?text=${encodeURIComponent(file.name || 'menu')}`.substring(0, 250) };
    }
  }
};

export default MenuService;