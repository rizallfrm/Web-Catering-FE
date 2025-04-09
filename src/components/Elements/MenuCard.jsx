import React from 'react';

const MenuCard = ({ menu, addToCart }) => {
  return (
    <div className="bg-red hover:shadow-lg  overflow-hidden">
      <img 
        src={menu.image} 
        alt={menu.name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4 ">
        <h3 className="font-semibold text-lg">{menu.name}</h3>
        <p className="text-gray-600 text-sm mt-1">{menu.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <span className="font-bold">Rp {menu.price.toLocaleString()}</span>
          <button 
            onClick={() => addToCart(menu)}
            className="px-3 py-1.5 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
          >
            Tambah ke Keranjang
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;