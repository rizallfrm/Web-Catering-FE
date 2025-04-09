import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MenuService from "../services/menuService";
import { useCart } from "../../context/CartContext";
import AuthService from "../services/authService";

const Menu = () => {
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
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
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
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
        setError("Gagal memuat menu. Silakan coba lagi nanti.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenus();
  }, []);

  // Mendapatkan kategori unik dari menu
  const categories = [
    { 
      value: "all", 
      label: "Semua", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      )
    },
    ...Array.from(
      new Set(
        menus.filter((menu) => menu.category).map((menu) => menu.category)
      )
    ).map(category => ({
      value: category,
      label: category,
      icon: getCategoryIcon(category)
    }))
  ];

  // Filter menu berdasarkan kategori dan pencarian
  const filteredMenus = menus.filter((menu) => {
    // Filter berdasarkan kategori
    const matchCategory =
      selectedCategory === "all" || menu.category === selectedCategory;

    // Filter berdasarkan pencarian (nama atau deskripsi)
    const matchSearch =
      searchQuery === "" ||
      menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (menu.description &&
        menu.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchCategory && matchSearch;
  });

  const handleAddToCart = async (menu) => {
    try {
      // Check if user is logged in
      if (!isLoggedIn) {
        setNotification(
          "Silakan login terlebih dahulu untuk menambahkan ke keranjang"
        );
        setTimeout(() => {
          setNotification(null);
          navigate("/login"); // Redirect to login page
        }, 2000);
        return;
      }

      const menuId = menu.id;
      if (!menu.id || typeof menu.id !== "string") {
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
        navigate("/login");
      }, 2000);
      return;
    }
    navigate("/my-orders");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 
          bg-gradient-to-r from-yellow-500 to-yellow-600 
          text-transparent bg-clip-text">
          Menu Kami
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Pilih hidangan favorit Anda dari berbagai pilihan menu spesial kami
        </p>
      </div>

      {/* Search dan Kategori */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Input */}
          <div className="relative w-full md:w-2/3">
            <input
              type="text" 
              placeholder="Cari menu favoritmu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-4 pl-10 border-2 border-yellow-100 
                rounded-full focus:outline-none focus:ring-2 
                focus:ring-yellow-400 transition-all duration-300"
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

    
        </div>
      </div>

      {/* Loading & Error Handling */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMenus.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-24 w-24 mx-auto text-gray-300 mb-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 005.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-500 text-xl">Ups! Menu tidak ditemukan</p>
            </div>
          ) : (
            filteredMenus.map((menu) => (
              <div
                key={menu.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden 
                  transform transition-all duration-300 
                  hover:scale-105 hover:shadow-2xl group"
              >
                <div className="relative">
                  {menu.image_url ? (
                    <img
                      src={menu.image_url}
                      alt={menu.name}
                      className="w-full h-56 object-cover 
                        transition-transform duration-300 
                        group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-56 bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                  
                  {menu.category && (
                    <span className="absolute top-4 right-4 
                      bg-yellow-500/80 text-white px-3 py-1 
                      rounded-full text-xs">
                      {menu.category}
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 
                    text-gray-800 group-hover:text-yellow-600 
                    transition-colors">
                    {menu.name}
                  </h3>

                  {menu.description && (
                    <p className="text-gray-500 mb-4 line-clamp-2">
                      {menu.description}
                    </p>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-yellow-600">
                      Rp {menu.price.toLocaleString()}
                    </span>
                    
                    <button
                      onClick={() => handleAddToCart(menu)}
                      disabled={addingToCart && addedItemId === menu.id}
                      className={`
                        px-5 py-2 rounded-full transition-all duration-300
                        flex items-center space-x-2 group
                        ${
                          addingToCart && addedItemId === menu.id
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-yellow-500 text-white hover:bg-yellow-600 hover:shadow-lg"
                        }
                      `}
                    >
                      <span>
                        {addingToCart && addedItemId === menu.id 
                          ? "Loading..." 
                          : "+ Keranjang"}
                      </span>
                      <svg 
                        className={`w-5 h-5 transition-opacity duration-300 
                          ${addingToCart && addedItemId === menu.id 
                            ? 'opacity-0' 
                            : 'group-hover:opacity-100 opacity-0'}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Floating Pesanan Saya Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={goToMyOrders}
          className="bg-yellow-500 text-white p-4 rounded-full 
            shadow-2xl hover:bg-yellow-600 hover:shadow-lg
            transition-all duration-300 transform hover:scale-110
            flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </button>
      </div>

      {/* Notifikasi */}
      {notification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white 
          px-6 py-3 rounded-lg shadow-lg z-50 
          animate-bounce">
          {notification}
        </div>
      )}
    </div>
  );
};

export default Menu;
