import React from "react";
import { Link } from "react-router-dom";

const AuthLayout = ({ children, title }) => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
      
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>
      
      {/* Background image with modern overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/public/menu1.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60 backdrop-blur-sm"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex justify-center items-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Logo section with modern styling */}
          <div className="mb-6 text-center">
          <Link to="/">
            <img 
              className="h-80 w-auto mx-auto -mb-20"
              src="/public/logo.png"
              alt="Dapur Mamake"
            />
            <h1 className="text-3xl font-bold text-yellow-400 drop-shadow-lg">
              Dapur Catering Mamake
            </h1>
            <p className="mt-2 text-white font-medium drop-shadow-md">
              Rasanya seperti masakan rumah, hangatnya seperti pelukan ibu
            </p>
          </Link>
        </div>
          
          {/* Modern glassmorphism card */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden hover:bg-white/15 transition-all duration-300">
            {/* Card header with gradient */}
            <div className="bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm border-b border-white/20 p-6">
              <h2 className="text-center text-2xl font-bold text-white mb-2">
                {title}
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto"></div>
            </div>
            
            {/* Card content */}
            <div className="p-8 bg-white/95 backdrop-blur-sm">
              {children}
            </div>
          </div>
          
          {/* Back to home link with modern styling */}
          <div className="mt-8 text-center">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white font-medium transition-all duration-300 group hover:gap-3"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali ke Beranda
            </Link>
          </div>
          
          {/* Decorative floating elements */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>
      </div>
      
      {/* Subtle grain texture overlay */}
      <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }}></div>
    </div>
  );
};

export default AuthLayout;