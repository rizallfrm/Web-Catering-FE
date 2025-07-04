import React, { useState } from 'react';

const CartItem = ({ item, onUpdateQuantity, onRemoveItem }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const menu = item.Menu || {};
  const minOrder = menu.min_order || 1;

  const handleQuantityChange = (newQuantity) => {
    const validatedQuantity = Math.max(newQuantity, minOrder);
    setQuantity(validatedQuantity);
    onUpdateQuantity(item.id, validatedQuantity);
  };

  const handleRemove = () => {
    onRemoveItem(item.id);
  };

  return (
    <div className="py-4 flex items-start">
      <div className="w-20 h-20 rounded-md overflow-hidden mr-4 flex-shrink-0">
        <img 
          src={menu.image_url || '/images/default-food.jpg'} 
          alt={menu.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-grow">
        <h3 className="font-medium">{menu.name}</h3>
        <p className="text-gray-600 text-sm">Rp{menu.price?.toLocaleString()}</p>
        
        <div className="mt-2 flex items-center">
          <button 
            onClick={() => handleQuantityChange(quantity - 1)}
            className="w-8 h-8 border border-gray-300 rounded-l-md flex items-center justify-center"
            disabled={quantity <= minOrder}
          >
            -
          </button>
          <span className="w-12 h-8 border-t border-b border-gray-300 flex items-center justify-center">
            {quantity}
          </span>
          <button 
            onClick={() => handleQuantityChange(quantity + 1)}
            className="w-8 h-8 border border-gray-300 rounded-r-md flex items-center justify-center"
          >
            +
          </button>
        </div>
      </div>
      
      <div className="ml-4 flex flex-col items-end">
        <p className="font-medium">Rp{(menu.price * quantity).toLocaleString()}</p>
        <button 
          onClick={handleRemove}
          className="text-red-500 text-sm mt-2 hover:text-red-700"
        >
          Hapus
        </button>
      </div>
    </div>
  );
};

export default CartItem;