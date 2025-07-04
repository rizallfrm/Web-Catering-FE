import React from 'react';

const MenuCategoryTabs = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <div className="flex overflow-x-auto pb-2 -mx-4 px-4">
      {categories.map(category => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`whitespace-nowrap px-4 py-2 mr-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === category
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category === 'all' ? 'Semua' : category}
        </button>
      ))}
    </div>
  );
};

export default MenuCategoryTabs;