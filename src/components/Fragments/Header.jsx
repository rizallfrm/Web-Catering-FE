import { useState } from 'react';
import { Link } from 'react-router-dom';
import NavLink from '../Elements/NavLink';
import { FaShoppingCart } from 'react-icons/fa';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="font-bold text-xl">
              CateringKu
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink to="/">Beranda</NavLink>
            <NavLink to="/menu">Menu</NavLink>
            <NavLink to="/tentang-kami">Tentang Kami</NavLink>
            <NavLink to="/kontak">Kontak</NavLink>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-sm font-medium text-gray-700">
              Login
            </Link>
            <Link to="/cart" className="text-gray-700">
              <FaShoppingCart className="h-5 w-5" />
            </Link>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                type="button" 
                className="p-2 rounded-md text-gray-400 hover:text-gray-500"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="sr-only">Open menu</span>
                <svg 
                  className="h-6 w-6" 
                  xmlns="http://www.w3.org/2000/svg" 
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
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              to="/" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Beranda
            </Link>
            <Link 
              to="/menu" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Menu
            </Link>
            <Link 
              to="/tentang-kami" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tentang Kami
            </Link>
            <Link 
              to="/kontak" 
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Kontak
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
