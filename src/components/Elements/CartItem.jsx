import React from 'react';

const CartItem = ({ item, updateQuantity, removeItem }) => {
  return (
    <div className="flex items-center justify-between py-4 border-b">
      <div className="flex items-center">
        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
        <div>
          <h3 className="font-medium">{item.name}</h3>
          <p className="text-gray-500 text-sm">Rp {item.price.toLocaleString()}</p>
        </div>
      </div>
      <div className="flex items-center">
        <div className="flex items-center border rounded-md">
          <button 
            className="px-3 py-1 text-lg" 
            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
          >
            -
          </button>
          <span className="px-3">{item.quantity}</span>
          <button 
            className="px-3 py-1 text-lg" 
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
          >
            +
          </button>
        </div>
        <button 
          className="ml-4 text-red-500" 
          onClick={() => removeItem(item.id)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
