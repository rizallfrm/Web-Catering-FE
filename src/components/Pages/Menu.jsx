import React, { useState, useEffect } from "react";
import MenuCard from "../Elements/MenuCard";
import CartModal from "../Elements/CartModal";
import { useCart } from "../../context/CartContext";

// Sample menu data - in a real app you might fetch this from an API
const menuData = [
  {
    id: 1,
    name: "Soto Ayam Spesial",
    description:
      "Soto ayam dengan kuah gurih, potongan ayam, dan rempah pilihan",
    price: 25000,
    image: "/src/assets/images/menu1.jpg",
    category: "makanan",
  },
  {
    id: 2,
    name: "Nasi Goreng Kampung",
    description: "Nasi goreng dengan bumbu tradisional dan telur mata sapi",
    price: 30000,
    image: "/src/assets/images/menu2.jpg",
    category: "makanan",
  },
  {
    id: 3,
    name: "Es Teh Manis",
    description: "Teh manis dingin dengan es batu",
    price: 8000,
    image: "/src/assets/images/menu3.jpg",
    category: "minuman",
  },
  // Add more menu items as needed
];

const Menu = () => {
  const {
    cart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    isCartOpen,
    closeCart,
    cartItemCount,
  } = useCart();

  const [activeCategory, setActiveCategory] = useState("semua");
  const [filteredMenu, setFilteredMenu] = useState(menuData);

  // Filter menu when category changes
  useEffect(() => {
    if (activeCategory === "semua") {
      setFilteredMenu(menuData);
    } else {
      setFilteredMenu(
        menuData.filter((item) => item.category === activeCategory)
      );
    }
  }, [activeCategory]);

  const categories = [
    { id: "semua", name: "Semua Menu" },
    { id: "makanan", name: "Makanan" },
    { id: "minuman", name: "Minuman" },
    { id: "dessert", name: "Dessert" },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Menu Kami</h1>
      </div>

      {/* Category tabs */}
      <div className="py-2 flex justify-center items-center overflow-x-auto space-x-4 mb-8 pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              activeCategory === category.id
                ? "bg-yellow-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Menu grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMenu.map((menuItem) => (
          <MenuCard key={menuItem.id} menu={menuItem} addToCart={addToCart} />
        ))}
      </div>

      {/* Cart Modal */}
      <CartModal
        isOpen={isCartOpen}
        closeModal={closeCart}
        cart={cart}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        clearCart={clearCart}
      />
    </div>
  );
};

export default Menu;
