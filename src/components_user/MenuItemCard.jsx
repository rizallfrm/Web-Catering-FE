import React from 'react';

const MenuItemCard = ({ item, onAddToCart }) => {
  const { name, description, price, image_url, category, min_order, available } = item;

  const handleAddClick = () => {
    if (available) {
      onAddToCart(item.id, min_order);
    }
  };

  return (
    <div className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200 hover:-translate-y-2 relative ${
      !available ? 'opacity-60 pointer-events-none' : ''
    }`}>
      {/* Overlay untuk item tidak tersedia */}
      {!available && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/30 to-gray-900/60 flex items-center justify-center z-20 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-md rounded-full px-6 py-3 shadow-lg">
            <span className="text-gray-800 font-semibold text-sm">
              Tidak Tersedia
            </span>
          </div>
        </div>
      )}

      {/* Container gambar */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={image_url || '/images/default-food.jpg'}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Badge kategori */}
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-800 shadow-lg border border-white/50">
            {category}
          </span>
        </div>
      </div>

      {/* Konten card */}
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300">
            {name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Footer dengan harga dan button */}
        <div className="flex items-end justify-between pt-2">
          <div className="space-y-1">
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-gray-900">
                Rp{price.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Min. order: {min_order} pcs
            </p>
          </div>

          {/* Button */}
          <button
            onClick={handleAddClick}
            disabled={!available}
            className={`group/btn relative overflow-hidden px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg ${
              available
                ? 'bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-orange-500/25 hover:shadow-orange-500/40'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-gray-200/50'
            }`}
          >
            {available && (
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
            )}
            <span className="relative flex items-center space-x-2">
              {available ? (
                <>
                  <span>Tambah</span>
                  <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </>
              ) : (
                <span>Tidak Tersedia</span>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;