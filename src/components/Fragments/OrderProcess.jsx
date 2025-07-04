import { useState, useEffect } from "react";
import { FaBoxOpen, FaShoppingCart, FaWhatsapp } from "react-icons/fa";

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
      setActiveStep((prev) => (prev % 3) + 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      id: 1,
      icon: <FaBoxOpen className="w-6 h-6" />,
      title: "Pilih Paket",
      description:
        "Telusuri berbagai pilihan paket catering kami dan pilih yang sesuai dengan kebutuhan acara Anda",
    },
    {
      id: 2,
      icon: <FaShoppingCart className="w-6 h-6" />,
      title: "Tambahkan ke Keranjang",
      description:
        "Masukkan paket yang dipilih ke keranjang belanja dan atur jumlah pesanan sesuai kebutuhan",
    },
    {
      id: 3,
      icon: <FaWhatsapp className="w-6 h-6" />,
      title: "Checkout & Konfirmasi",
      description:
        "Selesaikan checkout dan upload bukti pembayaran dan konfirmasi pesanan melalui WhatsApp",
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
            Cara Memesan
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
            Hanya 3 langkah sederhana untuk memesan catering lezat kami
          </p>
        </div>

        {/* Desktop Timeline View */}
        <div className="hidden md:block mb-16">
          <div className="relative">
            {/* Timeline Bar */}
            <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -z-10"></div>

            <div className="flex justify-between">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className="flex flex-col items-center w-1/3 px-4"
                  onMouseEnter={() => setActiveStep(step.id)}
                >
                  {/* Step Number */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-all duration-300 ${
                      activeStep === step.id
                        ? "bg-amber-500 text-white scale-110 shadow-lg"
                        : "bg-white text-gray-600 border-2 border-gray-300"
                    }`}
                  >
                    {step.icon}
                  </div>

                  {/* Step Content */}
                  <div
                    className={`bg-white p-6 rounded-lg shadow-md w-full text-center transition-all duration-300 ${
                      activeStep === step.id
                        ? "border-t-4 border-amber-500 transform -translate-y-2 shadow-lg"
                        : "border-t-4 border-transparent"
                    }`}
                  >
                    <h3
                      className={`font-bold text-lg mb-2 ${
                        activeStep === step.id
                          ? "text-amber-600"
                          : "text-gray-700"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                    <div className="mt-4">
                      <span
                        className={`inline-block w-8 h-1 rounded-full ${
                          activeStep === step.id
                            ? "bg-amber-500"
                            : "bg-gray-300"
                        }`}
                      ></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Carousel View */}
        <div className="md:hidden mb-12">
          <div className="flex overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4">
            {steps.map((step) => (
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
                    <h3
                      className={`font-bold text-lg ${
                        activeStep === step.id
                          ? "text-amber-600"
                          : "text-gray-700"
                      }`}
                    >
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm pl-14 -mt-2">
                    {step.description}
                  </p>
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
