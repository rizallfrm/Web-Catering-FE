import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import AuthService from "../services/authService";
import MenuService from "../services/menuService";

const Menu = () => {
  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { addItem, openCart } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedItemId, setAddedItemId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const pageRef = useRef(null);
  const [clickedItem, setClickedItem] = useState(null);

  const navigate = useNavigate();

  // Animation when page enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (pageRef.current) {
      observer.observe(pageRef.current);
    }

    return () => {
      if (pageRef.current) {
        observer.unobserve(pageRef.current);
      }
    };
  }, []);

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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      ),
    },
    ...Array.from(
      new Set(
        menus.filter((menu) => menu.category).map((menu) => menu.category)
      )
    ).map((category) => ({
      value: category,
      label: category,
      icon: getCategoryIcon(category),
    })),
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
        toast.error(
          "Silakan login terlebih dahulu untuk menambahkan ke keranjang."
        );
        setTimeout(() => {
          setNotification(null);
          navigate("/login");
        }, 1000);
        return;
      }

      const menuId = menu.id;
      if (!menu.id || typeof menu.id !== "string") {
        console.error("Invalid menu ID:", menu.id);
        toast.error("Gagal menambahkan ke keranjang: ID menu tidak valid");
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
    <div ref={pageRef} className="container mx-auto px-4 py-16 max-w-7xl">
      <div
        className={`mb-16 text-center transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Menu Kami</h1>
        <div className="w-20 h-1 bg-amber-500 mx-auto mb-6"></div>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Pilih hidangan favorit Anda dari berbagai pilihan menu spesial kami
        </p>
      </div>
      {/* Search dan Kategori */}
      <div
        className={`mb-12 transition-all duration-1000 delay-150 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
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
          {filteredMenus.map((menu, index) => (
            <div
              key={menu.id}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden 
                transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group
                transition-all duration-1000 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }
                ${
                  clickedItem === menu.id
                    ? "animate-pulse ring-2 ring-amber-500"
                    : ""
                }`}
              style={{ transitionDelay: `${(index % 6) * 100}ms` }}
              onClick={() => handleItemClick(menu.id)}
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
                  <span
                    className="absolute top-4 right-4 
                    bg-yellow-500/80 text-white px-3 py-1 
                    rounded-full text-xs"
                  >
                    {menu.category}
                  </span>
                )}
              </div>

              <div className="p-6">
                <h3
                  className="text-2xl font-bold mb-2 
                  text-gray-800 group-hover:text-yellow-600 
                  transition-colors"
                >
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(menu);
                    }}
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
                        ${
                          addingToCart && addedItemId === menu.id
                            ? "opacity-0"
                            : "group-hover:opacity-100 opacity-0"
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Floating Pesanan Saya Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          target="_blank"
          onClick={goToMyOrders}
          className="bg-yellow-600 text-white p-4 rounded-full 
            shadow-2xl hover:bg-yellow-600 hover:shadow-lg
            transition-all duration-300 transform hover:scale-110
            flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>{" "}
          <span className="px-2">Pesanan Saya </span>
        </button>
      </div>
      {/* Notifikasi */}
      {notification && (
        <div
          className="fixed bottom-4 right-4 bg-green-500 text-white 
          px-6 py-3 rounded-lg shadow-lg z-50 
          animate-bounce"
        >
          {notification}
        </div>
      )}
      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
        .animate-progress {
          animation: progress 5s linear;
        }
      `}</style>
    </div>
  );
};

export default Menu;
