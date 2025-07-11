import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import API from "../components/services/api";
import MenuCategoryTabs from "./MenuCategoryTable";
import MenuItemCard from "./MenuItemCard";
import LoadingSpinner from "./LoadingSpinner";

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await API.get("/menus");
        const items = response.data.data.menus || response.data.menus || [];

        setMenuItems(items);

        // Extract unique categories
        const uniqueCategories = [
          "all",
          ...new Set(items.map((item) => item.category)),
        ];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching menu items:", err);
        setError("Gagal memuat menu. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const filteredItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  const handleAddToCart = (menuId, minOrder) => {
    addItem(menuId, minOrder); // Automatically add minimum order quantity
  };

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 ">
      <h1 className="text-4xl bg text-center font-bold text-gray-800 mb-4 pt-8">Menu Kami</h1>
      <div className="w-20 h-1 bg-amber-500 mx-auto mb-6 "></div>
      <p className="text-gray-600 max-w-2xl mx-auto text-center pb-14">
    Temukan ragam menu pilihan yang diracik dengan bahan segar dan penuh cinta dan sempurna untuk setiap momen spesial Anda.

</p>

      <MenuCategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredItems.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            menuType="daily"
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Tidak ada menu dalam kategori ini</p>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
