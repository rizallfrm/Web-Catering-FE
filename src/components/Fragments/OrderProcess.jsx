import { useState, useEffect } from 'react';
import { FaClipboardCheck, FaUserCog, FaClipboardList, FaSearch } from 'react-icons/fa';
import { Fa42Group } from 'react-icons/fa6';

const OrderProcess = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trigger animation when component is in view
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById("order-process-section");
    if (section) observer.observe(section);

    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  // Auto rotate through steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev % 3) + 1);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      id: 1,
      icon: <FaClipboardCheck className="w-8 h-8"/>,
      title: 'Pilih Paket',
      description: 'Pilih dan pesan menu yang sesuai dengan acara Anda dari berbagai pilihan paket premium kami'
    },
    {
      id: 2,
      icon: <FaClipboardList className="w-8 h-8"/>,
      title: 'Atur Tanggal',
      description: 'Tentukan tanggal dan waktu pengantaran yang sesuai dengan jadwal acara Anda'
    },
    {
      id: 3,
      icon: <Fa42Group className="w-8 h-8"/>,
      title: 'Pengiriman',
      description: 'Makanan disiapkan segar dan kami antar tepat waktu ke lokasi acara Anda'
    }
  ];

  return (
    <section id="order-process-section" className="py-24 px-4 bg-gradient-to-br from-amber-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-amber-600 font-medium mb-2">Mudah dan Cepat</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Cara Pemesanan</h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto mb-8"></div>
          <p className="text-gray-600 max-w-xl mx-auto">
            Proses pemesanan yang sederhana untuk memudahkan Anda mendapatkan 
            hidangan berkualitas untuk acara spesial
          </p>
        </div>
        
        {/* Visual process steps with connectors */}
        <div className="relative mb-20 hidden md:block">
          <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
          <div className="flex justify-between items-center">
            {steps.map((step) => (
              <div 
                key={step.id}
                className={`flex flex-col items-center relative ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                } transition-all duration-1000 delay-${(step.id - 1) * 300}`}
                style={{ transitionDelay: `${(step.id - 1) * 300}ms` }}
              >
                <div 
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-white ${
                    activeStep === step.id ? 'bg-amber-500 scale-110' : 'bg-gray-600'
                  } mb-4 transition-all duration-500 shadow-md`}
                >
                  <span className="text-xl font-bold">{step.id}</span>
                </div>
                <div className={`w-1 h-12 ${activeStep === step.id ? 'bg-amber-500' : 'bg-gray-300'} mb-2`}></div>
                <div 
                  className={`absolute top-full pt-2 text-center w-48 transition-all duration-500 ${
                    activeStep === step.id ? 'opacity-100 scale-105' : 'opacity-70 scale-100'
                  }`}
                >
                  <h3 className={`font-bold text-lg mb-1 ${activeStep === step.id ? 'text-amber-600' : 'text-gray-700'}`}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile view with cards */}
        <div className="grid grid-cols-1 md:hidden gap-8">
          {steps.map(step => (
            <div 
              key={step.id} 
              className={`bg-white p-6 rounded-xl shadow-md border-l-4 ${
                activeStep === step.id ? 'border-amber-500' : 'border-gray-200'
              } transform transition-all duration-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${(step.id - 1) * 200}ms` }}
            >
              <div className="flex items-center mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                  activeStep === step.id ? 'bg-amber-500' : 'bg-gray-200'
                } text-white transition-colors duration-300`}>
                  <span className="font-bold">{step.id}</span>
                </div>
                <h3 className={`font-bold text-lg ${
                  activeStep === step.id ? 'text-amber-600' : 'text-gray-700'
                }`}>
                  {step.title}
                </h3>
              </div>
              <p className="text-gray-600 ml-14">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Desktop grid view with icons */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 mt-36">
          {steps.map(step => (
            <div 
              key={step.id} 
              className={`p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 ${
                activeStep === step.id ? 'ring-2 ring-amber-500 transform -translate-y-2' : ''
              } ${isVisible ? 'opacity-100' : 'opacity-0'}`}
              style={{ transitionDelay: `${(step.id - 1) * 200 + 600}ms` }}
              onMouseEnter={() => setActiveStep(step.id)}
            >
              <div className={`w-16 h-16 rounded-full ${
                activeStep === step.id ? 'bg-amber-500' : 'bg-amber-100'
              } flex items-center justify-center mb-6 transition-colors duration-300 mx-auto`}>
                <div className={`${activeStep === step.id ? 'text-white' : 'text-amber-600'}`}>
                  {step.icon}
                </div>
              </div>
              <h3 className="font-bold text-xl text-center mb-4">{step.title}</h3>
              <p className="text-gray-600 text-center">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <button className="px-8 py-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-medium">
            Pesan Sekarang
          </button>
        </div>
      </div>
    </section>
  );
};

export default OrderProcess;