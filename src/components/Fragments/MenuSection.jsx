import Card from '../Elements/Card';
import menu1 from '../../assets/images/menu1.jpg';
import menu2 from '../../assets/images/menu2.jpg';
import menu3 from '../../assets/images/menu3.jpg';

const MenuSection = () => {
  const menuItems = [
    {
      id: 1,
      image: menu1,
      title: 'Nasi Tumpeng Komplit',
      description: 'Tumpeng tradisional dengan lauk pauk lengkap untuk acara spesial',
      price: 1350000
    },
    {
      id: 2,
      image: menu2,
      title: 'Paket Prasmanan Premium',
      description: 'Pilihan aneka menu prasmanan eksklusif',
      price: 2500000
    },
    {
      id: 3,
      image: menu3,
      title: 'Paket Snack Box Deluxe',
      description: 'Aneka kue dan minuman dalam kotak eksklusif',
      price: 60000
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12">Menu Unggulan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map(item => (
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
    </section>
  );
};

export default MenuSection;
