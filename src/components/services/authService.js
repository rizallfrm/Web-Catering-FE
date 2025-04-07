import API from "./api";
import { jwtDecode } from "jwt-decode";

const AuthService = {
  login: async (credentials) => {
    try {
      const response = await API.post("/users/login", credentials);

      if (response.data.token) {
        const token = response.data.token;
        localStorage.setItem("token", token);

        // Gunakan jwtDecode untuk membaca token
        const decodedToken = jwtDecode(token);

        // Simpan user info dari token
        const userData = {
          id: decodedToken.id || "unknown",
          role: decodedToken.role || "user",
          email: credentials.email,
          name: credentials.email ? credentials.email.split("@")[0] : "User",
        };

        console.log("User data saved:", userData);
        localStorage.setItem("user", JSON.stringify(userData));
      }
      return response.data;
    } catch (error) {
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
      // Gabungkan firstName dan lastName menjadi satu name
      const completeUserData = {
        ...userData,
        name: `${userData.firstName} ${userData.lastName || ''}`.trim()
      };
  
      const response = await API.post("/users/register", completeUserData);
      
      // Setelah registrasi berhasil, simpan data user ke localStorage
      if (response.data.user) {
        const userInfo = {
          id: response.data.user.id,
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role || "user"
        };
        
        localStorage.setItem("user", JSON.stringify(userInfo));
      }
      
      return response.data;
    } catch (error) {
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
    return !!localStorage.getItem("token");
  },
};

export default AuthService;
