import React from "react";
import { Link } from "react-router-dom";

const AuthLayout = ({ children, title }) => {
  return (
    <div className="min-h-screen w-full bg-cover bg-center flex justify-center items-center py-12 px-4"
         style={{ backgroundImage: "url('/src/assets/images/menu1.jpg')" }}>
      
      {/* Overlay gelap untuk memastikan konten di atasnya terbaca */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      {/* Container Form dengan efek glass */}
      <div className="z-10 w-full max-w-md">
        {/* Logo dengan ukuran yang lebih seimbang */}
        <div className="mb-6 text-center">
          <Link to="/">
            <img 
              className="h-36 w-36 mx-auto mb-2" 
              src="/src/assets/images/logo.svg" 
              alt="Dapur Mamake"
            />
            <h1 className="text-4xl font-bold text-yellow-400 drop-shadow-lg">
              Dapur Mamake
            </h1>
            <p className="mt-2 text-white font-medium drop-shadow-md">
              Rasanya seperti masakan rumah, hangatnya seperti pelukan ibu
            </p>
          </Link>
        </div>
        
        <div className="bg-white shadow-xl rounded-xl overflow-hidden">
          <div className="bg-white p-8">
            <h2 className="text-center text-2xl font-semibold text-gray-800 mb-6">
              {title}
            </h2>
            {children}
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Link to="/" className="text-white hover:text-yellow-300 font-medium transition-colors">
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;