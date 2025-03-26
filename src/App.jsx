import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Fragments/Header';
import Footer from './components/Fragments/Footer';
import Home from './components/Pages/Home';
import Menu from './components/Pages/Menu';
import TentangKami from './components/Pages/TentangKami';
import Kontak from './components/Pages/Kontak';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="font-poppins flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/tentang-kami" element={<TentangKami />} />
              <Route path="/kontak" element={<Kontak />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;