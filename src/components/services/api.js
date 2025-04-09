import axios from 'axios';

// Create an axios instance
const API = axios.create({
  baseURL:'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token in headers
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // Only add the token if it exists
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle auth errors
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If we get a 401 error (unauthorized), clear the token
    if (error.response && error.response.status === 401) {
      // Don't auto-logout if we're already on login page or trying to login
      const isLoginRequest = error.config.url.includes('/login');
      const isLoginPage = window.location.pathname.includes('/login');
      
      if (!isLoginRequest && !isLoginPage) {
        console.log('Unauthorized access - clearing auth data');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login page (if not already there)
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default API;