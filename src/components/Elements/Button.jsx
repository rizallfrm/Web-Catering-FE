const Button = ({ children, primary, className = "", onClick }) => {
    return (
      <button
        onClick={onClick}
        className={`px-6 py-2 rounded-full font-medium transition-colors ${
          primary
            ? "bg-white text-gray-800 hover:bg-gray-100"
            : "bg-gray-800 text-white hover:bg-gray-700"
        } ${className}`}
      >
        {children}
      </button>
    );
  };
  
  export default Button;