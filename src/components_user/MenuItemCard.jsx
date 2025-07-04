import React from 'react';

const MenuItemCard = ({ item, onAddToCart }) => {
  const {
    name,
    description,
    price,
    image_url,
    category,
    min_order,
    available,
  } = item;

  const handleAddClick = () => {
    if (available) {
      onAddToCart(item.id, min_order);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative ${
        !available ? 'opacity-60 pointer-events-none' : ''
      }`}
    >
      {/* Overlay jika tidak tersedia */}
      {!available && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-10">
          <span className="text-white font-semibold text-sm">
            Tidak Tersedia
          </span>
        </div>
      )}

      <div className="relative h-48 overflow-hidden">
        <img
          src={image_url || '/images/default-food.jpg'}
          alt={name}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
          {category}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-gray-600 mb-3 line-clamp-2">{description}</p>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-bold text-orange-600">
              Rp{price.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Min. order: {min_order}</p>
          </div>

          <button
            onClick={handleAddClick}
            disabled={!available}
            className={`px-4 py-2 rounded-lg transition-colors ${
              available
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {available ? 'Tambah' : 'Tidak Tersedia'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
