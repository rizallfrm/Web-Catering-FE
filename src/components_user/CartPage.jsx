import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from './CartItem';
import LoadingSpinner from './LoadingSpinner';

const CartPage = () => {
  const { cart, isLoading, error, updateItemQuantity, removeItem } = useCart();
  
  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      const itemPrice = item.Menu?.price || 0;
      return total + (itemPrice * item.quantity);
    }, 0);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Keranjang Pesanan</h1>
      
      {cart.items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Keranjang Anda masih kosong</p>
          <Link 
            to="/menu" 
            className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Lihat Menu
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Detail Pesanan</h2>
              
              <div className="divide-y divide-gray-200">
                {cart.items.map(item => (
                  <CartItem 
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateItemQuantity}
                    onRemoveItem={removeItem}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>
              
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>Rp{calculateTotal().toLocaleString()}</span>
                </div>
                {/* <div className="flex justify-between mb-2">
                  <span>Biaya Pengiriman:</span>
                  <span>Gratis</span>
                </div> */}
                <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-gray-200">
                  <span>Total:</span>
                  <span>Rp{calculateTotal().toLocaleString()}</span>
                </div>
              </div>
              
              <Link 
                to="/checkout" 
                className="block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-3 rounded-lg transition-colors"
              >
                Lanjut ke Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;