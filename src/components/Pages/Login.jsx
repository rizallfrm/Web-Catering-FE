import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/authService';
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await AuthService.login(formData);
      
      // Login berhasil
      setIsLoading(false);
      
      // Redirect berdasarkan role
      if (AuthService.isAdmin()) {
        // Redirect ke admin dashboard jika user adalah admin
        navigate('/admin');
        console.log('Redirecting to admin dashboard...');
      } else {
        // Redirect ke halaman utama untuk user biasa
        navigate('/');
        console.log('Redirecting to home...');
      }
    } catch (err) {
      setIsLoading(false);
      console.error('Login error:', err);
      
      // Handle error berdasarkan response dari backend
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Login gagal. Silakan coba lagi.');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Masuk</h1>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block mb-1">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md transition-colors duration-300"
            disabled={isLoading}
          >
            {isLoading ? 'Sedang Masuk...' : 'Masuk'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p>
            Belum punya akun?{' '}
            <Link to="/register" className="text-yellow-600 hover:text-yellow-800">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;