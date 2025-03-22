import { useState } from 'react';
import Card from '../Elements/Card';
import menu1 from '../../assets/images/menu1.jpg';
import menu2 from '../../assets/images/menu2.jpg';
import menu3 from '../../assets/images/menu3.jpg';

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const categories = [
    { id: 'all', name: 'Semua Menu' },
    { id: 'tumpeng', name: 'Tumpeng' },
    { id: 'prasmanan', name: 'Prasmanan' },
    { id: 'snack', name: 'Snack Box' }
  ];
  
  const menuItems = [
    {
      id: 1,
      category: 'tumpeng',
      image: menu1,
      title: 'Nasi Tumpeng Komplit',
      description: 'Tumpeng tradisional dengan lauk pauk lengkap untuk acara spesial',
      price: 1350000
    },
    {
      id: 2,
      category: 'prasmanan',
      image: menu2,
      title: 'Paket Prasmanan Premium',
      description: 'Pilihan aneka menu prasmanan eksklusif',
      price: 2500000
    },
    {
      id: 3,
      category: 'snack',
      image: menu3,
      title: 'Paket Snack Box Deluxe',
      description: 'Aneka kue dan minuman dalam kotak eksklusif',
      price: 60000
    },
    {
      id: 4,
      category: 'tumpeng',
      image: menu1,
      title: 'Nasi Tumpeng Mini',
      description: 'Tumpeng ukuran kecil untuk acara intimate',
      price: 750000
    },
    {
      id: 5,
      category: 'prasmanan',
      image: menu2,
      title: 'Paket Prasmanan Standar',
      description: 'Menu prasmanan lengkap dengan harga terjangkau',
      price: 1500000
    },
    {
      id: 6,
      category: 'snack',
      image: menu3,
      title: 'Paket Snack Box Standard',
      description: 'Aneka kue dan minuman dalam kotak',
      price: 40000
    }
  ];
  
  const filteredMenuItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-12">Menu Kami</h1>
      
      <div className="flex flex-wrap justify-center mb-8 gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category.id
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMenuItems.map(item => (
          <Card
            key={item.id}
            image={item.image}
            title={item.title}
            description={item.description}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default Menu;