import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavLink from "../Elements/NavLink";
import AuthService from "../services/authService";
import { useCart } from "../../context/CartContext";
import CartModal from "../Elements/cartModal";
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const { cartItemCount, openCart, isCartOpen, closeCart } = useCart();
  const navigate = useNavigate();
  // Cek status login saat komponen dimuat
  useEffect(() => {
    try {
      const checkLoginStatus = () => {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
          setIsLoggedIn(true);
          setUser(currentUser);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      };

      checkLoginStatus();
    } catch (error) {
      console.error("Error checking login status:", error);
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  // Fungsi untuk mendapatkan tampilan user (initial atau nama)
  const getUserDisplay = () => {
    if (!user) return "U";

    // Jika user memiliki name, gunakan inisial
    if (user.name && typeof user.name === "string") {
      return user.name.charAt(0).toUpperCase();
    }

    // Jika user memiliki email, gunakan karakter pertama email
    if (user.email && typeof user.email === "string") {
      return user.email.charAt(0).toUpperCase();
    }

    // Jika user memiliki id, gunakan karakter pertama id
    if (user.id && typeof user.id === "string") {
      return user.id.charAt(0).toUpperCase();
    }

    // Fallback ke 'A' untuk Admin atau 'U' untuk User
    return user.role === "admin" ? "A" : "U";
  };

  // Fungsi untuk mendapatkan nama display
  const getDisplayName = () => {
    if (!user) return "User";

    if (user.name && typeof user.name === "string") {
      const nameParts = user.name.split(" ");
      return nameParts[0]; // Return first name
    }

    if (user.email && typeof user.email === "string") {
      // Return part before @ in email
      return user.email.split("@")[0];
    }

    return user.role === "admin" ? "Admin" : "User";
  };

  // Fungsi untuk toggle menu mobile
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Fungsi untuk handle logout
  const handleLogout = () => {
    try {
      AuthService.logout();
      setIsLoggedIn(false);
      setUser(null);
      setShowUserMenu(false);
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Dropdown menu untuk user profile
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Menutup dropdown jika user mengklik di luar dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest(".user-menu-container")) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="font-bold text-xl text-yellow-600">
          Resto App
        </Link>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu}>
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/">Beranda</NavLink>
          <NavLink to="/menu">Menu</NavLink>
          <NavLink to="/tentang-kami">Tentang Kami</NavLink>
          <NavLink to="/kontak">Kontak</NavLink>

          {/* Keranjang Button */}
          <button
            onClick={openCart}
            className="relative transition-transform duration-200 hover:scale-110"
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Login Button atau User Icon */}
          {!isLoggedIn ? (
            <Link
              to="/login"
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md transition-colors duration-300"
            >
              Masuk
            </Link>
          ) : (
            <div className="relative user-menu-container">
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-yellow-100 transition-colors duration-200"
              >
                <div className="h-8 w-8 rounded-full bg-yellow-500 text-white flex items-center justify-center">
                  {getUserDisplay()}
                </div>
                <span className="hidden lg:inline text-sm font-medium">
                  {getDisplayName()}
                </span>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50">
                  {/* User Info Section */}
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name ||
                        user?.email ||
                        (user?.role === "admin" ? "Admin User" : "User")}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>

                  {/* Menu Links */}
                  {isLoggedIn && (
                    <>
                      <Link
                        to="/my-orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50"
                      >
                        Pesanan Saya
                      </Link>

                      {/* Tampilkan link Admin Dashboard jika user adalah admin */}
                      {user?.role === "admin" && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                    </>
                  )}

                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Keluar
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md z-50">
            <div className="flex flex-col p-4">
              {/* User Info Section for Mobile (when logged in) */}
              {isLoggedIn && (
                <div className="py-3 border-b mb-2">
                  <div className="flex items-center mb-2">
                    <div className="h-8 w-8 rounded-full bg-yellow-500 text-white flex items-center justify-center mr-2">
                      {getUserDisplay()}
                    </div>
                    <div>
                      <p className="font-medium">
                        {user?.name ||
                          user?.email ||
                          (user?.role === "admin" ? "Admin User" : "User")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.email || ""}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <NavLink to="/" className="py-2">
                Beranda
              </NavLink>
              <NavLink to="/menu" className="py-2">
                Menu
              </NavLink>
              <NavLink to="/tentang-kami" className="py-2">
                Tentang Kami
              </NavLink>
              <NavLink to="/kontak" className="py-2">
                Kontak
              </NavLink>

              {/* Keranjang untuk Mobile */}
              <button
                onClick={() => {
                  openCart();
                  setIsMenuOpen(false);
                }}
                className="flex items-center py-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Keranjang
                {cartItemCount > 0 && (
                  <span className="ml-2 bg-yellow-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Login/Profile untuk Mobile */}
              {!isLoggedIn ? (
                <Link
                  to="/login"
                  className="flex items-center py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Masuk
                </Link>
              ) : (
                <>
                  <Link
                    to="/my-orders"
                    className="flex items-center py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-2"
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
                    </svg>
                    Pesanan Saya
                  </Link>

                  {/* Tampilkan link Admin Dashboard di mobile jika user adalah admin */}
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="flex items-center py-2 text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center py-2 text-red-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Keluar
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={closeCart} />
    </header>
  );
};

export default Header;
