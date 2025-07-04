import React, { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  Package,
  MapPin,
  Award,
  Utensils,
  Clock,
  DollarSign,
} from "lucide-react";

const AccordionItem = ({
  title,
  icon: Icon,
  children,
  isOpen,
  onClick,
  animationDelay,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    // Set a timeout to stagger the animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, animationDelay);

    return () => clearTimeout(timer);
  }, [animationDelay]);

  return (
    <div
      className={`border border-gray-100 rounded-xl mb-4 shadow-sm overflow-hidden transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      } ${isOpen ? "ring-2 ring-amber-300" : "hover:shadow-md"}`}
    >
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center p-5 text-left 
        bg-white hover:bg-amber-50 transition-all duration-300"
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-4">
          {Icon && (
            <div
              className={`p-2.5 rounded-full ${
                isOpen
                  ? "bg-amber-500 text-white"
                  : "bg-amber-100 text-amber-600"
              } transition-colors duration-300`}
            >
              <Icon className="h-5 w-5" />
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? "bg-amber-500 text-white rotate-180"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>
      <div
        ref={contentRef}
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-6 bg-white border-t border-gray-100">{children}</div>
      </div>
    </div>
  );
};

const CateringAccordion = () => {
  const [openIndex, setOpenIndex] = useState(0); // First one open by default
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      ref={sectionRef}
      className="py-20 px-4 bg-gradient-to-br from-amber-50 to-white"
    >
      <div className="max-w-4xl mx-auto">
        <div
          className={`text-center mb-12 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="px-4 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium inline-block mb-4">
            Layanan Premium
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Informasi Lengkap Catering Mamake
          </h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kami menyediakan layanan catering berkualitas untuk berbagai acara
            dengan menu beragam dan pelayanan profesional
          </p>
        </div>

        {/* Accordion items */}
        <div>
          <AccordionItem
            title="Produk Catering Kami"
            icon={Utensils}
            isOpen={openIndex === 0}
            onClick={() => toggleAccordion(0)}
            animationDelay={100}
          >
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-5">
                {[
                  {
                    title: "Nasi Kotak Lengkap",
                    desc: "Paket nasi dengan lauk pauk pilihan, cocok untuk berbagai acara.",
                    price: "Mulai Rp 25.000/porsi",
                    icon: <Package className="w-8 h-8" />,
                  },
                  {
                    title: "Prasmanan Hemat",
                    desc: "Layanan prasmanan dengan menu variatif untuk acara besar.",
                    price: "Mulai Rp 50.000/porsi",
                    icon: <Utensils className="w-8 h-8" />,
                  },
                  {
                    title: "Snack Box Premium",
                    desc: "Paket snack berkualitas untuk meeting atau acara kecil.",
                    price: "Mulai Rp 15.000/porsi",
                    icon: <Package className="w-8 h-8" />,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-amber-100"
                  >
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-4">
                      {item.icon}
                    </div>
                    <h4 className="font-semibold text-amber-800 text-lg mb-2">
                      {item.title}
                    </h4>
                    <p className="text-gray-600 mb-4">{item.desc}</p>
                    <div className="bg-amber-500 text-white font-medium px-3 py-1 rounded-lg inline-block">
                      {item.price}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-amber-50 p-4 rounded-lg border border-amber-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-1">
                    <svg
                      className="w-5 h-5 text-amber-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h5 className="font-medium text-amber-800">Custom Menu</h5>
                    <p className="text-sm text-gray-600">
                      Kami juga menyediakan menu khusus sesuai permintaan.
                      Silakan hubungi kami untuk konsultasi menu.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AccordionItem>

          <AccordionItem
            title="Area Layanan Kami"
            icon={MapPin}
            isOpen={openIndex === 1}
            onClick={() => toggleAccordion(1)}
            animationDelay={200}
          >
            <div className="space-y-5">
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 mb-6">
                <h4 className="font-semibold text-amber-800 mb-2 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Wilayah Jangkauan Catering
                </h4>
                <p className="text-gray-600 mb-3">
                  Kami melayani pengantaran ke berbagai wilayah di Banjarnegara
                  dan sekitarnya:
                </p>
              </div>

              <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-4">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-gray-600">
                    <span className="font-medium">Pengantaran:</span> 09.00 -
                    17.00 WIB (Setiap Hari)
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    * Untuk area di luar jangkauan, silakan hubungi kami untuk
                    konfirmasi
                  </p>
                </div>
              </div>
            </div>
          </AccordionItem>

          <AccordionItem
            title="Mengapa Memilih Kami"
            icon={Award}
            isOpen={openIndex === 2}
            onClick={() => toggleAccordion(2)}
            animationDelay={300}
          >
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-5">
                {[
                  {
                    title: "Kualitas Terjamin",
                    desc: "Bahan berkualitas dan fresh setiap hari",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ),
                  },
                  {
                    title: "Tepat Waktu",
                    desc: "Pengantaran selalu tepat waktu",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ),
                  },
                  {
                    title: "Tim Profesional",
                    desc: "Dilayani oleh tenaga ahli catering",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
                        />
                      </svg>
                    ),
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md hover:border-amber-100 transition-all duration-300"
                  >
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mx-auto mb-4">
                      {item.icon}
                    </div>
                    <h4 className="font-semibold text-amber-800 text-lg mb-2">
                      {item.title}
                    </h4>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </AccordionItem>
        </div>
      </div>
    </div>
  );
};

export default CateringAccordion;
