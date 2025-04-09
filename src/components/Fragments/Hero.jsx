import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../Elements/Button";

const images = [
  "/src/assets/images/hero-bg.jpg",
  "/src/assets/images/hero-bg2.jpg",
  "/src/assets/images/hero-bg3.jpg",
];

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); // 5 detik

    return () => clearInterval(interval); // bersihkan saat unmount
  }, []);

  return (
    <div className="relative h-[400px] sm:h-[400px] lg:h-[500px] overflow-hidden text-white text-center">
      {/* Background Images */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            currentImage === index ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      ))}

      {/* Content */}
      <div className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto py-14">
          <h1 className="text-xl sm:text-4xl font-bold mb-4">
            Catering Lezat untuk Setiap Acara
          </h1>
          <p className="text-lg mb-8">
            Hidangan berkualitas prima dengan rasa spesial untuk Anda
          </p>
          <Link to="/menu">
            <Button className="hover:bg-gray-300" primary>Pesan Sekarang</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
