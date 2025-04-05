import axios from 'axios';

// Buat axios instance
const API = axios.create({
  baseURL: 'http://localhost:3000/api', // URL yang benar sesuai dengan endpoint Anda
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor untuk menambahkan token ke header
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk handling response
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle token expired atau unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;