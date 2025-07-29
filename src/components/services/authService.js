import API from "./api";
import { jwtDecode } from "jwt-decode";

const AuthService = {
  login: async (credentials) => {
    try {
      console.log("Attempting login with:", {
        identifier: credentials.identifier,
        passwordLength: credentials.password?.length
      });

      const response = await API.post("/users/login", {
        identifier: credentials.identifier, // kirim email atau name
        password: credentials.password,
      });

      console.log("Login response:", response.data);

      if (response.data.token) {
        const token = response.data.token;
        localStorage.setItem("token", token);

        // Gunakan jwtDecode untuk membaca token
        const decodedToken = jwtDecode(token);

        // Simpan user info dari response dan token
        const userData = {
          id: decodedToken.id || response.data.user?.id || "unknown",
          role: decodedToken.role || response.data.user?.role || "user",
          email: response.data.user?.email || "",
          name: response.data.user?.name || "",
          // Jangan simpan phone/address karena mungkin encrypted di backend
        };

        console.log("User data saved:", userData);
        localStorage.setItem("user", JSON.stringify(userData));
        return userData;
      }

      throw new Error("Token tidak diterima dari server");
    } catch (error) {
      console.error("Login error detail:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Re-throw dengan pesan yang lebih informatif
      if (error.response?.status === 401) {
        throw new Error(error.response.data?.message || "Email/nama atau password salah");
      } else if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || "Data login tidak valid");
      } else if (error.response?.status >= 500) {
        throw new Error("Server sedang bermasalah. Silakan coba lagi nanti.");
      } else if (!error.response) {
        throw new Error("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
      }
      
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
  },

  register: async (userData) => {
    try {
      console.log("Attempting registration with:", {
        ...userData,
        password: "[HIDDEN]"
      });

      const response = await API.post("/users/register", userData);

      console.log("Registration response:", response.data);

      // Setelah registrasi berhasil, simpan data user ke localStorage
      if (response.data.user) {
        const userInfo = {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role || "user",
        };

        localStorage.setItem("user", JSON.stringify(userInfo));
      }

      return response.data;
    } catch (error) {
      console.error("Registration error detail:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Re-throw dengan pesan yang lebih informatif
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || "Data registrasi tidak valid");
      } else if (error.response?.status >= 500) {
        throw new Error("Server sedang bermasalah. Silakan coba lagi nanti.");
      } else if (!error.response) {
        throw new Error("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
      }
      
      throw error;
    }
  },

  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr || userStr === "undefined") {
        return null;
      }
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Error parsing user data:", error);
      localStorage.removeItem("user");
      return null;
    }
  },

  isAdmin: () => {
    try {
      const user = AuthService.getCurrentUser();
      return user && user.role === "admin";
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  },

  updateUserData: (userData) => {
    try {
      const currentUser = AuthService.getCurrentUser();
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  },

  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    const user = AuthService.getCurrentUser();
    
    if (!token || !user) {
      return false;
    }
    
    try {
      // Cek apakah token masih valid (belum expired)
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if (decodedToken.exp < currentTime) {
        // Token expired, hapus dari localStorage
        AuthService.logout();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error checking token validity:", error);
      AuthService.logout();
      return false;
    }
  },

  getToken: () => {
    return localStorage.getItem("token");
  },

  // Method tambahan untuk debugging
  debugAuth: () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    console.group("🔍 Auth Debug Info");
    console.log("Token exists:", !!token);
    console.log("Token length:", token?.length || 0);
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);
        console.log("Token expires at:", new Date(decoded.exp * 1000));
        console.log("Is token expired:", decoded.exp < Date.now() / 1000);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    
    console.log("User data:", user);
    console.log("Is authenticated:", AuthService.isAuthenticated());
    console.groupEnd();
  }
};

export default AuthService;