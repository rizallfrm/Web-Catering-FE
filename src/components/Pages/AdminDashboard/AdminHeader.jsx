import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../services/authService";

const AdminHeader = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin on component mount
    const currentUser = AuthService.getCurrentUser();
    if (currentUser && currentUser.role === "admin") {
      setUser(currentUser);
    } else {
      // Redirect to home if not admin
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    try {
      AuthService.logout();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <header className="bg-blue-800 text-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/admin" className="font-bold text-xl">
            Admin Dashboard
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {/* Admin Links */}
          <Link to="/admin/menu" className="hover:text-blue-200">
            Kelola Menu
          </Link>
          <Link to="/admin/orders" className="hover:text-blue-200">
            Pesanan
          </Link>
          <Link to="/admin/users" className="hover:text-blue-200">
            Users
          </Link>
          
          {/* Separator */}
          <span className="h-6 w-px bg-blue-300"></span>
          
          {/* User info and logout */}
          <div className="flex items-center">
            <span className="mr-3">
              {user?.name || user?.email || "Admin"}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md text-sm transition-colors duration-300"
            >
              Logout
            </button>
          </div>
          
          {/* Link to main site */}
          <Link 
            to="/" 
            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md text-sm transition-colors duration-300"
          >
            Lihat Website
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;