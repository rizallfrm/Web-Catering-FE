import { useState } from 'react';
import Card from '../Elements/Card';
import menu1 from '../../../public/menu1.jpg';
import menu2 from '../../../public/menu2.jpg';
import menu3 from '../../../public/menu3.jpg';
import { Link } from 'react-router-dom';

const categories = [
  { id: 'all', label: 'Semua Menu' },
  { id: 'tumpeng', label: 'Tumpeng' },
  { id: 'prasmanan', label: 'Prasmanan' },
  { id: 'snack', label: 'Snack Box' }
];

const MenuSection = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    {
      id: 1,
      image: menu1,
      title: 'Nasi Tumpeng Komplit',
      description: 'Tumpeng tradisional dengan lauk pauk lengkap untuk acara spesial',
      price: 1350000,
      category: 'tumpeng',
      featured: true
    },
    {
      id: 2,
      image: menu2,
      title: 'Paket Prasmanan Premium',
      description: 'Pilihan aneka menu prasmanan eksklusif dengan pilihan hidangan utama dan pendamping',
      price: 2500000,
      category: 'prasmanan',
      featured: true
    },
    {
      id: 3,
      image: menu3,
      title: 'Paket Snack Box Deluxe',
      description: 'Aneka kue dan minuman dalam kotak eksklusif dengan presentasi mewah',
      price: 60000,
      category: 'snack',
      featured: true
    }
  ];

  const filteredItems = menuItems.filter(
    item => activeCategory === 'all' || item.category === activeCategory
  );

  // Custom Card component with hover effects
  const EnhancedCard = ({ item }) => {
    const isHovered = hoveredItem === item.id;
    
    return (
      <div 
        className={`group bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 
          ${isHovered ? 'shadow-xl translate-y-[-8px]' : 'hover:shadow-xl hover:translate-y-[-8px]'}`}
        onMouseEnter={() => setHoveredItem(item.id)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        {/* Image container with zoom effect */}
        <div className="relative overflow-hidden h-64">
          <img 
            src={item.image} 
            alt={item.title} 
            className={`object-cover w-full h-full transition-transform duration-700 transform
              ${isHovered ? 'scale-110' : 'group-hover:scale-110'}`}
          />
          {item.featured && (
            <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              Favorit
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-amber-600 transition-colors duration-300">
              {item.title}
            </h3>
            <div className="text-amber-600 font-bold">
              {new Intl.NumberFormat('id-ID', { 
                style: 'currency', 
                currency: 'IDR',
                maximumFractionDigits: 0 
              }).format(item.price)}
            </div>
          </div>
          
          <p className="text-gray-600 mb-6 text-sm line-clamp-2">
            {item.description}
          </p>
          
          <div className="flex justify-between items-center">
            <button className="text-amber-600 font-medium text-sm hover:text-amber-700 transition-colors duration-300 flex items-center group">
              Detail Menu
              <svg 
                className="w-4 h-4 ml-1 transform transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            
            <button className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center hover:bg-amber-600 hover:text-white transition-colors duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-amber-600 font-medium mb-2">Pilihan Terbaik Kami</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Menu Unggulan</h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto mb-8"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Nikmati berbagai hidangan premium kami yang disiapkan dengan bahan-bahan terbaik
            dan resep tradisional yang disempurnakan dengan sentuhan modern.
          </p>
        </div>

        {/* Category navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${activeCategory === category.id
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Menu grid with animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => (
            <EnhancedCard key={item.id} item={item} />
          ))}
        </div>

        {/* See all menu button */}
        <div className="text-center mt-16">
          <Link to="/menu">
            <button className="px-8 py-3 bg-white border-2 border-amber-500 text-amber-600 rounded-full hover:bg-amber-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-medium">
              Lihat Semua Menu
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;