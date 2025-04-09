import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

const PriceCalculator = () => {
    const [paket, setPaket] = useState('nasi-kotak');
    const [jumlahPorsi, setJumlahPorsi] = useState(20);
    const [totalHarga, setTotalHarga] = useState(0);
  
    const hargaPaket = {
      'nasi-kotak': 25000,
      'prasmanan': 50000,
      'snack-box': 15000
    };
  
    const hitungHarga = () => {
      const harga = hargaPaket[paket] * jumlahPorsi;
      setTotalHarga(harga);
    };
  
    const paketOptions = [
      { value: 'nasi-kotak', label: 'Nasi Kotak Lengkap', harga: 25000 },
      { value: 'prasmanan', label: 'Prasmanan Hemat', harga: 50000 },
      { value: 'snack-box', label: 'Snack Box Premium', harga: 15000 }
    ];
  
    return (
      <div className="max-w-4xl mx-auto my-12 px-4">
        <div className="flex items-center justify-center mb-8">
          <Calculator className="h-8 w-8 text-yellow-600 mr-3" />
          <h2 className="text-3xl font-bold text-gray-800">Kalkulator Harga Catering</h2>
        </div>
        
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Pilih Paket Catering</label>
              <select 
                value={paket}
                onChange={(e) => setPaket(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                {paketOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} - Rp {option.harga.toLocaleString()}/porsi
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 font-bold mb-2">Jumlah Porsi</label>
              <input 
                type="number" 
                value={jumlahPorsi}
                onChange={(e) => setJumlahPorsi(Math.max(20, Number(e.target.value)))}
                min={20}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <p className="text-sm text-gray-500 mt-2">
                Minimal order 20 porsi
              </p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <button 
              onClick={hitungHarga}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-md transition-colors duration-300 flex items-center mx-auto"
            >
              <Calculator className="mr-2" />
              Hitung Total Harga
            </button>
          </div>
          
          {totalHarga > 0 && (
            <div className="mt-8 text-center">
              <h3 className="text-2xl font-bold text-gray-800">Total Estimasi Harga</h3>
              <p className="text-3xl font-extrabold text-yellow-600 mt-2">
                Rp {totalHarga.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                * Harga dapat berubah sesuai kebutuhan spesifik
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default PriceCalculator;