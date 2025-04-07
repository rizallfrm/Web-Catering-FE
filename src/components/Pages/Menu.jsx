import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuService from '../services/menuService';
import { useCart } from '../../context/CartContext';
import AuthService from '../services/authService';

const Menu = () => {
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { addItem, openCart } = useCart(); // Changed from addToCart to addItem
  const navigate = useNavigate();
  
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedItemId, setAddedItemId] = useState(null);
  // State untuk menampilkan notifikasi
  const [notification, setNotification] = useState(null);
  // Check if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check login status
    const checkLoginStatus = () => {
      const isAuthenticated = AuthService.isAuthenticated();
      setIsLoggedIn(isAuthenticated);
    };
    
    checkLoginStatus();
    
    // Add event listener for storage changes to detect login/logout
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setIsLoading(true);
        const data = await MenuService.getAllMenus();
        setMenus(data);
        setError(null);
      } catch (err) {
        setError('Gagal memuat menu. Silakan coba lagi nanti.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenus();
  }, []);
 
  // Mendapatkan kategori unik dari menu
  const categories = ['all', ...new Set(menus.filter(menu => menu.category).map(menu => menu.category))];

  // Filter menu berdasarkan kategori dan pencarian
  const filteredMenus = menus.filter(menu => {
    // Filter berdasarkan kategori
    const matchCategory = selectedCategory === 'all' || menu.category === selectedCategory;
    
    // Filter berdasarkan pencarian (nama atau deskripsi)
    const matchSearch = searchQuery === '' || 
      menu.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (menu.description && menu.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchCategory && matchSearch;
  });

  const handleAddToCart = async (menu) => {
    try {
      // Check if user is logged in
      if (!isLoggedIn) {
        setNotification("Silakan login terlebih dahulu untuk menambahkan ke keranjang");
        setTimeout(() => {
          setNotification(null);
          navigate('/login'); // Redirect to login page
        }, 2000);
        return;
      }
      
      const menuId = menu.id;
      if (!menu.id || typeof menu.id !== 'string') {
        console.error("Invalid menu ID:", menu.id);
        setNotification("Gagal menambahkan ke keranjang: ID menu tidak valid");
        return;
      }
      
      console.log("Adding menu with ID:", menu.id);
      
      // Set loading state
      setAddingToCart(true);
      setAddedItemId(menu.id);
      
      // Use addItem instead of addToCart
      await addItem(menu.id, 1);
      
      // Tampilkan notifikasi
      setNotification(`${menu.name} ditambahkan ke keranjang`);
      
      // Reset loading state
      setAddingToCart(false);
      setAddedItemId(null);
      
      setTimeout(() => {
        setNotification(null);
      }, 3000);
      
    } catch (error) {
      console.error("Error adding to cart:", error);
      setNotification("Gagal menambahkan ke keranjang. Silakan coba lagi.");
      
      // Reset loading state
      setAddingToCart(false);
      setAddedItemId(null);
      
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  const goToMyOrders = () => {
    if (!isLoggedIn) {
      setNotification("Silakan login terlebih dahulu untuk melihat pesanan");
      setTimeout(() => {
        setNotification(null);
        navigate('/login');
      }, 2000);
      return;
    }
    navigate('/my-orders');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Menu Kami</h1>
      
      {/* Pencarian dan Filter */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div className="w-full md:w-1/2 mb-4 md:mb-0 flex gap-2">
            <input
              type="text"
              placeholder="Cari menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 border rounded-md"
            />
            <button
              onClick={goToMyOrders}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-3 rounded-md transition-colors duration-300 font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Pesanan Saya
            </button>
          </div>
        </div>
      </div>
      
      {/* Notifikasi */}
      {notification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {notification}
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMenus.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">Tidak ada menu yang ditemukan.</p>
            </div>
          ) : (
            filteredMenus.map((menu) => (
              
              <div key={menu.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                {menu.image_url ? (
                  <img 
                    src={menu.image_url} 
                    alt={menu.name} 
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
                
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{menu.name}</h3>
                  
                  {menu.category && (
                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mb-2">
                      {menu.category}
                    </span>
                  )}
                  
                  {menu.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{menu.description}</p>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-yellow-600">Rp {menu.price.toLocaleString()}</span>
                    <button
                      onClick={() => handleAddToCart(menu)}
                      disabled={addingToCart && addedItemId === menu.id}
                      className={`
                        ${addingToCart && addedItemId === menu.id
                          ? 'bg-gray-400'
                          : 'bg-yellow-500 hover:bg-yellow-600'
                        } text-white px-3 py-1 rounded-md transition-colors duration-300`}
                    >
                      {addingToCart && addedItemId === menu.id ? 'Loading...' : '+ Keranjang'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Menu;