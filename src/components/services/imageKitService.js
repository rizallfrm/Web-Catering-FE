import API from "./api";

const ImageKitService = {
  uploadImage: async (file) => {
    try {
      // Buat FormData untuk mengirim file
      const formData = new FormData();
      formData.append('image', file);
      
      // Kirim ke endpoint upload di backend
      const response = await API.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  getPlaceholderImage: (name) => {
    // Gunakan Placeholder.com untuk menghasilkan placeholder image
    const encodedName = encodeURIComponent(name);
    return `https://via.placeholder.com/300x200/FFD700/000000?text=${encodedName}`;
  }
};

export default ImageKitService;