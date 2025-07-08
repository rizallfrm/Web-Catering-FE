import { useState, useEffect } from "react";
import {
  FaSearch,
  FaShoppingCart,
  FaCheckCircle,
  FaWhatsapp,
  FaMoneyBillWave,
  FaClock,
  FaUtensils,
  FaTruck,
  FaBoxOpen,
} from "react-icons/fa";

const OrderProcess = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById("order-process-section");
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev % 9) + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const processGroups = [
    {
      title: "Pemesanan",
      steps: [
        {
          id: 1,
          icon: <FaSearch className="w-6 h-6" />,
          title: "Pilih Menu",
          description: "Lihat dan pilih menu catering favorit Anda",
        },
        {
          id: 2,
          icon: <FaShoppingCart className="w-6 h-6" />,
          title: "Keranjang",
          description: "Tambahkan makanan ke keranjang belanja",
        },
        {
          id: 3,
          icon: <FaCheckCircle className="w-6 h-6" />,
          title: "Checkout",
          description: "Lengkapi detail pengiriman & pembayaran",
        },
      ],
    },
    {
      title: "Konfirmasi",
      steps: [
        {
          id: 4,
          icon: <FaWhatsapp className="w-6 h-6" />,
          title: "Konfirmasi",
          description: "Admin akan memverifikasi pesanan Anda",
        },
        {
          id: 5,
          icon: <FaMoneyBillWave className="w-6 h-6" />,
          title: "Pembayaran",
          description: "Upload bukti transfer pembayaran",
        },
        {
          id: 6,
          icon: <FaClock className="w-6 h-6" />,
          title: "Verifikasi",
          description: "Tim kami akan memvalidasi pembayaran",
        },
      ],
    },
    {
      title: "Pengiriman",
      steps: [
        {
          id: 7,
          icon: <FaUtensils className="w-6 h-6" />,
          title: "Persiapan",
          description: "Pesanan sedang disiapkan oleh tim kami",
        },
        {
          id: 8,
          icon: <FaTruck className="w-6 h-6" />,
          title: "Pengantaran",
          description: "Pesanan dikirim ke alamat Anda",
        },
        {
          id: 9,
          icon: <FaBoxOpen className="w-6 h-6" />,
          title: "Selesai",
          description: "Pesanan telah sampai dengan selamat",
        },
      ],
    },
  ];

  return (
    <section
      id="order-process-section"
      className="py-16 md:py-24 px-4 bg-gradient-to-br from-amber-50 to-white"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-amber-600 font-medium mb-2">Proses Mudah</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Cara Memesan Catering
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Proses pemesanan dalam 3 tahap sederhana
          </p>
        </div>

        {/* Desktop Timeline View */}
        <div className="hidden md:block">
          <div className="space-y-12">
            {processGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-12">
                <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
                  {groupIndex + 1}. {group.title}
                </h3>
                <div className="grid grid-cols-3 gap-6">
                  {group.steps.map((step) => (
                    <div
                      key={step.id}
                      className="flex flex-col items-center"
                      onMouseEnter={() => setActiveStep(step.id)}
                    >
                      <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                          activeStep === step.id
                            ? "bg-amber-500 text-white scale-105 shadow-lg"
                            : "bg-white text-gray-600 border-2 border-gray-300"
                        }`}
                      >
                        {step.icon}
                      </div>
                      <div
                        className={`bg-white p-6 rounded-lg shadow-md w-full text-center transition-all duration-300 min-h-[180px] border-t-4 ${
                          activeStep === step.id
                            ? "border-amber-500 transform -translate-y-2 shadow-lg"
                            : "border-gray-200"
                        }`}
                      >
                        <h4 className="font-bold text-lg mb-2 text-gray-800">
                          {step.title}
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {step.description}
                        </p>
                        {activeStep === step.id && (
                          <div className="mt-4">
                            <span className="inline-block w-8 h-1 rounded-full bg-amber-500"></span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Carousel View */}
        <div className="md:hidden">
          <div className="space-y-8">
            {processGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4 pl-2">
                  {groupIndex + 1}. {group.title}
                </h3>
                <div className="flex overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4">
                  {group.steps.map((step) => (
                    <div
                      key={step.id}
                      className="flex-shrink-0 w-10/12 snap-center px-2"
                    >
                      <div
                        className={`bg-white p-6 rounded-xl shadow-md h-full border-l-4 ${
                          activeStep === step.id
                            ? "border-amber-500"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center mb-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                              activeStep === step.id
                                ? "bg-amber-500 text-white"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {step.icon}
                          </div>
                          <h4 className="font-bold text-gray-800">
                            {step.title}
                          </h4>
                        </div>
                        <p className="text-gray-600 text-sm pl-14 -mt-2">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderProcess;