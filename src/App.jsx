import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import AuthService from './components/services/authService';

// Import Components
import Header from './components/Fragments/Header';
import Footer from './components/Fragments/Footer';
import AdminHeader from './components/Pages/AdminDashboard/AdminHeader'; // You'll need to create this

// Import Pages
import Home from './components/Pages/Home';
import Menu from './components/Pages/Menu';
import TentangKami from './components/Pages/TentangKami';
import Kontak from './components/Pages/Kontak';
import Login from './components/Pages/Login.jsX';
import Register from './components/Pages/Register';
import Checkout from './components/Pages/Checkout';
import MyOrders from './components/Pages/MyOrder';
import AdminDashboard from './components/Pages/AdminDashboard/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = AuthService.isAuthenticated();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const isLoggedIn = AuthService.isAuthenticated();
  const isAdmin = AuthService.isAdmin();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  
  return children;
};

// Layout component with conditional header
const AppLayout = () => {
  const location = useLocation();
  const pathname = location.pathname;
  
  // Check if current path is login or register page
  const isAuthPage = pathname === '/login' || pathname === '/register';
  
  // Check if current path is admin page
  const isAdminPage = pathname.startsWith('/admin');
  
  return (
    <div className="font-poppins flex flex-col min-h-screen">
      {/* Conditional Header Rendering */}
      {isAuthPage ? (
        // No header for login/register pages
        null
      ) : isAdminPage ? (
        // Admin header for admin pages
        <AdminHeader />
      ) : (
        // Regular header for all other pages
        <Header />
      )}
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/tentang-kami" element={<TentangKami />} />
          <Route path="/kontak" element={<Kontak />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-orders" 
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/*" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      
      {/* Footer - you might also want to conditionally render this */}
      {!isAuthPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <CartProvider>
      <Router>
        <AppLayout />
      </Router>
    </CartProvider>
  );
}

export default App;