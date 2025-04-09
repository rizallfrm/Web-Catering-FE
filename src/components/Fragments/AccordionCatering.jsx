import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Package, MapPin, Award } from 'lucide-react';
const AccordionItem = ({ title, icon: Icon, children }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <div className="border-b border-gray-200 mb-2">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center p-4 text-left 
          bg-white hover:bg-yellow-50 transition-colors duration-300"
        >
          <div className="flex items-center space-x-4">
            {Icon && <Icon className="text-yellow-600 h-6 w-6" />}
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          </div>
          {isOpen ? (
            <ChevronUp className="text-yellow-600" />
          ) : (
            <ChevronDown className="text-yellow-600" />
          )}
        </button>
        {isOpen && (
          <div className="p-4 bg-white text-gray-700">
            {children}
          </div>
        )}
      </div>
    );
  };
const CateringAccordion = () => {
    return (
      <div className="max-w-4xl mx-auto my-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Informasi Lengkap Catering Mamake
        </h2>
        
        <div className="shadow-lg rounded-lg overflow-hidden">
          <AccordionItem 
            title="Produk Catering Kami" 
            icon={Package}
          >
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Nasi Kotak Lengkap</h4>
                  <p className="text-gray-600">Paket nasi dengan lauk pauk pilihan, cocok untuk berbagai acara.</p>
                  <p className="text-yellow-700 font-bold mt-2">Mulai Rp 25.000/porsi</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Prasmanan Hemat</h4>
                  <p className="text-gray-600">Layanan prasmanan dengan menu variatif untuk acara besar.</p>
                  <p className="text-yellow-700 font-bold mt-2">Mulai Rp 50.000/porsi</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Snack Box Premium</h4>
                  <p className="text-gray-600">Paket snack berkualitas untuk meeting atau acara kecil.</p>
                  <p className="text-yellow-700 font-bold mt-2">Mulai Rp 15.000/porsi</p>
                </div>
              </div>
            </div>
          </AccordionItem>
  
          <AccordionItem 
            title="Area Layanan Kami" 
            icon={MapPin}
          >
            <div className="space-y-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Wilayah Jangkauan Catering</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Kota:</h5>
                  <ul className="list-disc list-inside text-gray-600">
                    <li>Jakarta Selatan</li>
                    <li>Jakarta Timur</li>
                    <li>Jakarta Barat</li>
                    <li>Depok</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Kecamatan Utama:</h5>
                  <ul className="list-disc list-inside text-gray-600">
                    <li>Pancoran</li>
                    <li>Kebayoran Baru</li>
                    <li>Pondok Indah</li>
                    <li>Cilandak</li>
                  </ul>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                * Untuk area di luar jangkauan, silakan hubungi kami untuk konfirmasi
              </p>
            </div>
          </AccordionItem>
  
          <AccordionItem 
            title="Mengapa Memilih Kami" 
            icon={Award}
          >
            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-yellow-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="font-semibold text-yellow-800 mb-2">Kualitas Terjamin</h4>
                  <p className="text-gray-600">Bahan berkualitas dan fresh setiap hari</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-yellow-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="font-semibold text-yellow-800 mb-2">Tepat Waktu</h4>
                  <p className="text-gray-600">Pengantaran selalu tepat waktu</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-yellow-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
                  </svg>
                  <h4 className="font-semibold text-yellow-800 mb-2">Tim Profesional</h4>
                  <p className="text-gray-600">Dilayani oleh tenaga ahli catering</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4 text-center">
                Kami berkomitmen memberikan pelayanan terbaik untuk setiap pelanggan
              </p>
            </div>
          </AccordionItem>
        </div>
      </div>
    );
  };
  
  export default CateringAccordion;