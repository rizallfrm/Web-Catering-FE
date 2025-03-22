const Input = ({ type = "text", placeholder, value, onChange, className = "" }) => {
    return (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 ${className}`}
      />
    );
  };
  
  export default Input;