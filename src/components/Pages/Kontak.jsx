import { useState, useRef, useEffect } from "react";
import Input from "../Elements/Input";
import Button from "../Elements/Button";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaWhatsapp,
} from "react-icons/fa";
import { Send, CheckCircle } from "lucide-react";

const Kontak = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    subject: "Umum", // Default subject
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const pageRef = useRef(null);

  // Animation when page enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (pageRef.current) {
      observer.observe(pageRef.current);
    }

    return () => {
      if (pageRef.current) {
        observer.unobserve(pageRef.current);
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulasi pengiriman form dengan delay
    setTimeout(() => {
      console.log("Form data submitted:", formData);
      setIsLoading(false);
      setIsSubmitted(true);

      // Reset form setelah beberapa detik
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          subject: "Umum",
        });
      }, 5000);
    }, 1500);
  };

  // Contact info items
  const contactInfo = [
    {
      icon: <FaWhatsapp className="text-amber-500" />,
      title: "WhatsApp",
      content: "+62 89527308651",
      action: "https://wa.me/6289527308651",
      actionText: "Chat",
    },

    {
      icon: <FaMapMarkerAlt className="text-amber-500" />,
      title: "Alamat",
      content:
        "Ds. Karangjati RT 01 / RW 03, Kec. Susukan, Kab. Banjarnegara, Prov. Jawa Tengah",
      action: "https://maps.app.goo.gl/F43ScTAwDyRYt7aM8",
      actionText: "Lihat Peta",
    },
  ];

  // Subject options
  const subjectOptions = [
    "Umum",
    "Pemesanan",
    "Informasi Menu",
    "Kerjasama",
    "Komplain",
  ];

  return (
    <div ref={pageRef} className="py-16 px-4 bg-gradient-to-b ">
      <div className="max-w-6xl mx-auto">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Kontak Kami</h1>
          <div className="w-24 h-1 bg-amber-500 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kami siap membantu menjawab pertanyaan dan memenuhi kebutuhan
            catering Anda
          </p>
        </div>

        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-12 transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Contact Info Section */}
          <div className="flex flex-col lg:col-span-12 ">
          <div className="lg:col-span-5 space-y-8 ">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-amber-500 p-6 text-white ">
                <h2 className="text-xl font-bold">Informasi Kontak</h2>
                <p className="text-amber-100 mt-1">
                  Hubungi kami melalui berbagai cara berikut
                </p>
              </div>

              <div className="p-6 space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mt-1 mr-4 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mb-2">{item.content}</p>
                      <a
                        href={item.action}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm inline-flex items-center text-amber-600 hover:text-amber-700 transition-colors"
                      >
                        <span>{item.actionText}</span>
                        <svg
                          className="w-3.5 h-3.5 ml-1"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gray-800 p-6 text-white">
                <div className="flex items-center">
                  <FaClock className="mr-2" />
                  <h2 className="text-xl font-bold">Jam Operasional</h2>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-3">
                  {[
                    { day: "Senin - Jumat", hours: "09.00 - 16.00 WIB" },
                    { day: "Sabtu", hours: "09.00 - 16.00 WIB" },
                    { day: "Minggu", hours: "Tutup" },
                  ].map((schedule, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                    >
                      <span className="font-medium text-gray-800">
                        {schedule.day}
                      </span>
                      <span
                        className={`text-sm px-3 py-1 rounded-full ${
                          schedule.hours === "Tutup"
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
</div>
        {/* Map Section */}
        <div
          className={`mt-16 transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 bg-amber-500 text-white">
              <h2 className="text-xl font-bold">Lokasi Kami</h2>
              <p className="text-amber-100 mt-1">
                Kunjungi kami di lokasi berikut
              </p>
            </div>

            <div className="aspect-w-16 aspect-h-9 h-96 bg-gray-200">
              {/* Replace with your actual map implementation */}
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 mx-auto mb-3">
                    <FaMapMarkerAlt size={24} />
                  </div>
                  <p className="text-gray-600">
                    Ds. Karangjati RT 01 / RW 03, Kec. Susukan, Kab.
                    Banjarnegara, Prov. Jawa Tengah
                  </p>
                  <a
                    href="https://maps.app.goo.gl/F43ScTAwDyRYt7aM8 "
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
                  >
                    Buka di Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
        .animate-progress {
          animation: progress 5s linear;
        }
      `}</style>
    </div>
  );
};

export default Kontak;
