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
      subtitle: "Pilih menu favorit Anda",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      steps: [
        {
          id: 1,
          icon: <FaSearch className="w-7 h-7" />,
          title: "Pilih Menu",
          description: "Jelajahi dan pilih menu catering favorit Anda dari berbagai kategori yang tersedia",
          detail: "📱 Browse menu online",
          color: "bg-orange-500"
        },
        {
          id: 2,
          icon: <FaShoppingCart className="w-7 h-7" />,
          title: "Keranjang",
          description: "Tambahkan makanan ke keranjang dan sesuaikan jumlah porsi yang dibutuhkan",
          detail: "🛒 Atur jumlah porsi",
          color: "bg-orange-600"
        },
        {
          id: 3,
          icon: <FaCheckCircle className="w-7 h-7" />,
          title: "Checkout",
          description: "Lengkapi detail pengiriman, tanggal acara, dan informasi pembayaran",
          detail: "📝 Isi detail lengkap",
          color: "bg-orange-700"
        },
      ],
    },
    {
      title: "Konfirmasi",
      subtitle: "Proses verifikasi pesanan",
      color: "from-blue-500 to-purple-500",
      bgColor: "bg-blue-50",
      steps: [
        {
          id: 4,
          icon: <FaWhatsapp className="w-7 h-7" />,
          title: "Konfirmasi",
          description: "Admin akan menghubungi Anda via WhatsApp untuk memverifikasi pesanan",
          detail: "💬 Konfirmasi via WA",
          color: "bg-blue-500"
        },
        {
          id: 5,
          icon: <FaMoneyBillWave className="w-7 h-7" />,
          title: "Pembayaran",
          description: "Lakukan pembayaran dan upload bukti transfer melalui sistem kami",
          detail: "💳 Transfer & upload bukti",
          color: "bg-blue-600"
        },
        {
          id: 6,
          icon: <FaClock className="w-7 h-7" />,
          title: "Verifikasi",
          description: "Tim kami akan memvalidasi pembayaran dalam waktu maksimal 2 jam",
          detail: "✅ Validasi pembayaran",
          color: "bg-blue-700"
        },
      ],
    },
    {
      title: "Pengiriman",
      subtitle: "Persiapan hingga pengantaran",
      color: "from-green-500 to-teal-500",
      bgColor: "bg-green-50",
      steps: [
        {
          id: 7,
          icon: <FaUtensils className="w-7 h-7" />,
          title: "Persiapan",
          description: "Tim chef kami mulai menyiapkan pesanan dengan bahan-bahan segar pilihan",
          detail: "👨‍🍳 Memasak dengan cinta",
          color: "bg-green-500"
        },
        {
          id: 8,
          icon: <FaTruck className="w-7 h-7" />,
          title: "Pengantaran",
          description: "Pesanan dikemas dengan rapi dan dikirim tepat waktu ke alamat Anda",
          detail: "🚚 Antar tepat waktu",
          color: "bg-green-600"
        },
        {
          id: 9,
          icon: <FaBoxOpen className="w-7 h-7" />,
          title: "Selesai",
          description: "Pesanan telah sampai dengan selamat dan siap untuk dinikmati",
          detail: "🎉 Nikmati hidangan",
          color: "bg-green-700"
        },
      ],
    },
  ];

  return (
    <section
      id="order-process-section"
      className="py-20 px-4 bg-gradient-to-br from-orange-50 via-white to-red-50 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-orange-200/30 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-red-200/30 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-green-200/30 rounded-full animate-pulse delay-2000"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-full font-medium mb-6 shadow-lg">
            <span className="mr-2">🎯</span>
            Proses Mudah & Cepat
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            <span className="text-orange-600">Cara</span> <span className="text-red-600">Memesan</span> <span className="text-green-600">Catering</span>
          </h2>
          <div className="flex justify-center items-center gap-2 mb-8">
            <div className="w-12 h-1 bg-orange-500 rounded"></div>
            <div className="w-6 h-1 bg-red-500 rounded"></div>
            <div className="w-12 h-1 bg-green-600 rounded"></div>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Hanya dengan 3 langkah mudah, Anda sudah bisa menikmati hidangan catering berkualitas 
            dari Dapur Mamake untuk acara spesial Anda
          </p>
        </div>

        {/* Desktop Timeline View */}
        <div className="hidden lg:block">
          <div className="space-y-20">
            {processGroups.map((group, groupIndex) => (
              <div key={groupIndex} className={`${group.bgColor} rounded-3xl p-8 shadow-xl border border-gray-100`}>
                <div className="text-center mb-12">
                  <div className={`inline-block bg-gradient-to-r ${group.color} text-white px-8 py-4 rounded-2xl shadow-lg mb-4`}>
                    <h3 className="text-2xl font-bold">
                      Tahap {groupIndex + 1}: {group.title}
                    </h3>
                    <p className="text-sm opacity-90 mt-1">{group.subtitle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-8">
                  {group.steps.map((step, stepIndex) => (
                    <div
                      key={step.id}
                      className="flex flex-col items-center relative"
                      onMouseEnter={() => setActiveStep(step.id)}
                    >
                      {/* Connecting line */}
                      {stepIndex < group.steps.length - 1 && (
                        <div className="absolute top-10 left-1/2 w-full h-1 bg-gray-200 z-0">
                          <div className={`h-full transition-all duration-1000 ${
                            activeStep >= step.id ? step.color : 'bg-gray-200'
                          } bg-gradient-to-r`} style={{width: activeStep > step.id ? '100%' : '0%'}}></div>
                        </div>
                      )}

                      {/* Icon */}
                      <div
                        className={`relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 shadow-lg ${
                          activeStep === step.id
                            ? `${step.color} text-white scale-110 shadow-xl`
                            : "bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {step.icon}
                      </div>

                      {/* Content Card */}
                      <div
                        className={`bg-white rounded-2xl shadow-lg w-full text-center transition-all duration-500 min-h-[220px] p-6 border-2 ${
                          activeStep === step.id
                            ? "border-orange-300 transform -translate-y-4 shadow-2xl"
                            : "border-gray-100 hover:border-gray-200"
                        }`}
                      >
                        <h4 className="font-bold text-xl mb-3 text-gray-800">
                          {step.title}
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                          {step.description}
                        </p>
                        <div className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-medium ${
                          activeStep === step.id ? `${step.color} text-white` : 'bg-gray-100 text-gray-600'
                        }`}>
                          {step.detail}
                        </div>
                        {activeStep === step.id && (
                          <div className="mt-4">
                            <div className="w-12 h-1 bg-orange-500 mx-auto rounded-full"></div>
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

        {/* Mobile View */}
        <div className="lg:hidden">
          <div className="space-y-12">
            {processGroups.map((group, groupIndex) => (
              <div key={groupIndex} className={`${group.bgColor} rounded-2xl p-6 shadow-lg`}>
                <div className={`bg-gradient-to-r ${group.color} text-white text-center py-4 px-6 rounded-xl mb-8 shadow-lg`}>
                  <h3 className="text-lg font-bold">
                    Tahap {groupIndex + 1}: {group.title}
                  </h3>
                  <p className="text-sm opacity-90">{group.subtitle}</p>
                </div>

                <div className="space-y-6">
                  {group.steps.map((step) => (
                    <div
                      key={step.id}
                      className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${
                        activeStep === step.id ? 'border-orange-500 shadow-lg' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 ${
                            activeStep === step.id
                              ? `${step.color} text-white shadow-lg`
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {step.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 mb-2">
                            {step.title}
                          </h4>
                          <p className="text-gray-600 text-sm mb-3">
                            {step.description}
                          </p>
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            activeStep === step.id ? `${step.color} text-white` : 'bg-gray-100 text-gray-600'
                          }`}>
                            {step.detail}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        {/* <div className="mt-20 text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
            <div className="text-6xl mb-6">🚀</div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Siap untuk <span className="text-orange-600">Memesan</span>?
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg">
              Proses pemesanan yang mudah dan cepat menanti Anda. 
              Mulai pilih menu favorit Anda sekarang juga!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg">
                🍽️ Pilih Menu Sekarang
              </button>
              <button className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg">
                💬 Chat WhatsApp
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default OrderProcess;