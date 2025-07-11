import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../Elements/Button";

const images = [
  "/public/hero-bg.jpg",
  "/public/herobg2.jpg",
  "/public/herobg3.jpg",
];

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Set loaded after component mount for entrance animation
    setIsLoaded(true);
    
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); // 5 detik

    return () => clearInterval(interval); // bersihkan saat unmount
  }, []);

  return (
    <div className="relative h-[500px] sm:h-[550px] lg:h-[650px] overflow-hidden text-white">
      {/* Background Images with parallax effect */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1500 ease-in-out bg-center bg-cover bg-no-repeat transform scale-110 ${
            currentImage === index ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${image})`,
            transform: currentImage === index ? "scale(1.05)" : "scale(1)",
            transition: "transform 6s ease-out, opacity 1.5s ease-in-out",
          }}
        ></div>
      ))}

      {/* Image navigation dots */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              currentImage === index 
                ? "bg-white w-6" 
                : "bg-white/50 hover:bg-white/70"
            }`}
            onClick={() => setCurrentImage(index)}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>

      {/* Content with staggered fade-in */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <div 
          className={`max-w-4xl mx-auto text-center transform transition-all duration-1000 ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h5 className="font-light text-lg mb-3 tracking-widest uppercase">Pesanan Catering Premium</h5>
          <div className="w-16 h-0.5 bg-white/70 mx-auto mb-6"></div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
           Cita Rasa Khas Mamake, <br className="hidden sm:block" /> Gurihnya Bikin Nagih 
          </h1>
          <p className="text-lg sm:text-xl mb-10 font-light max-w-2xl mx-auto text-gray-100">
            Hidangan berkualitas prima dengan rasa autentik dan presentasi 
            yang memukau untuk momen spesial Anda
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu">
              <Button
                className="px-8 py-3 text-base rounded-full bg-transparent border-2 border-white hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
              >
                Lihat Menu
              </Button>
            </Link>
            <Link to="/kontak">
              <Button 
                className="px-8 py-3 text-base rounded-full bg-transparent border-2 border-white hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
              >
                Hubungi Kami
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black/40 to-transparent z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
    </div>
  );
};

export default Hero;