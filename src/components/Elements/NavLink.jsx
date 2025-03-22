import { Link, useLocation } from 'react-router-dom';

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`px-3 py-2 text-sm font-medium transition-colors ${
        isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {children}
    </Link>
  );
};

export default NavLink;