import { useCart } from "../../context/CartContext";

const Card = ({ image, title, description, price, onAddToCart }) => {
    return (
      <div className="hover:shadow-2xl bg-white rounded-lg overflow-hidden shadow-xl">
        <div className="h-48 bg-gray-200">
          {image ? (
            <img src={image} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Tidak ada gambar tersedia
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-medium text-lg">{title}</h3>
          <p className="text-gray-600 text-sm mt-1">{description}</p>
          {price && (
            <p className="font-bold mt-3 text-gray-800">
              Rp {price.toLocaleString()}
            </p>
          )}
          {onAddToCart && (
            <button
              onClick={onAddToCart}
              className="mt-4 px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
            >
              Tambah ke Keranjang
            </button>
          )}
        </div>
      </div>
    );
  };
export default Card  