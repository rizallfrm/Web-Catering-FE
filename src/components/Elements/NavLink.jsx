import { Link, useLocation } from 'react-router-dom';

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`px-3 py-2 text-sm font-medium transition-colors duration-300 rounded-md
        ${isActive ? 'text-white bg-yellow-500' : 'text-gray-600 hover:text-white hover:bg-yellow-500'}
      `}
    >
      {children}
    </Link>
  );
  
};

export default NavLink;