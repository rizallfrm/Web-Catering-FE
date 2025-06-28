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
      icon: <FaPhone className="text-amber-500" />,
      title: "Telepon",
      content: "+62 812-3456-7890",
      action: "tel:+6281234567890",
      actionText: "Hubungi",
    },
    {
      icon: <FaWhatsapp className="text-amber-500" />,
      title: "WhatsApp",
      content: "+62 812-3456-7890",
      action: "https://wa.me/6281234567890",
      actionText: "Chat",
    },
    {
      icon: <FaEnvelope className="text-amber-500" />,
      title: "Email",
      content: "info@cateringku.com",
      action: "mailto:info@cateringku.com",
      actionText: "Kirim Email",
    },
    {
      icon: <FaMapMarkerAlt className="text-amber-500" />,
      title: "Alamat",
      content: "Jalan Sudirman No. 123, Jakarta Pusat, 10220",
      action: "https://maps.google.com/?q=Jalan+Sudirman+No.+123+Jakarta",
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
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-amber-500 p-6 text-white">
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
                    { day: "Senin - Jumat", hours: "08.00 - 17.00 WIB" },
                    { day: "Sabtu", hours: "09.00 - 15.00 WIB" },
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

          {/* Contact Form Section */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-amber-500 p-6 text-white">
                <h2 className="text-xl font-bold">Kirim Pesan</h2>
                <p className="text-amber-100 mt-1">
                  Isi formulir di bawah ini dan kami akan menghubungi Anda
                </p>
              </div>

              <div className="p-6">
                {isSubmitted ? (
                  <div className="bg-green-50 border border-green-100 text-green-700 px-6 py-8 rounded-lg flex flex-col items-center text-center">
                    <CheckCircle size={48} className="text-green-500 mb-4" />
                    <h3 className="text-xl font-bold text-green-800 mb-2">
                      Pesan Terkirim!
                    </h3>
                    <p className="text-green-700 mb-4">
                      Terima kasih telah menghubungi kami. Tim kami akan segera
                      merespons pesan Anda.
                    </p>
                    <div className="w-full max-w-xs h-2 bg-green-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full animate-progress"></div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Nama Lengkap <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          id="name"
                          name="name"
                          placeholder="Masukkan nama lengkap"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full bg-gray-50 border-gray-200 focus:border-amber-300 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="Masukkan alamat email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full bg-gray-50 border-gray-200 focus:border-amber-300 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Nomor Telepon <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="tel"
                          id="phone"
                          name="phone"
                          placeholder="Masukkan nomor telepon"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full bg-gray-50 border-gray-200 focus:border-amber-300 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="subject"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Subjek
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:border-amber-300 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
                        >
                          {subjectOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Pesan <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows="5"
                        placeholder="Tuliskan pesan atau pertanyaan Anda"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-2 focus:outline-none focus:border-amber-300 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
                        required
                      ></textarea>
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        className={`w-full bg-amber-500 hover:bg-amber-600 text-white ${
                          isLoading ? "opacity-70 cursor-wait" : ""
                        }`}
                        disabled={isLoading}
                      >
                        <div className="flex items-center justify-center">
                          {isLoading ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              <span>Mengirim...</span>
                            </>
                          ) : (
                            <>
                              <Send size={18} className="mr-2" />
                              <span>Kirim Pesan</span>
                            </>
                          )}
                        </div>
                      </Button>
                    </div>
                  </form>
                )}

                <div className="mt-8 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <p>
                    <span className="font-medium">Catatan:</span> Kami
                    berkomitmen untuk merespons setiap pertanyaan dalam waktu 24
                    jam pada hari kerja. Terima kasih atas kesabaran dan
                    kepercayaan Anda kepada CateringKu.
                  </p>
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
                    Peta lokasi - Jalan Sudirman No. 123, Jakarta Pusat
                  </p>
                  <a
                    href="https://maps.google.com/?q=Jalan+Sudirman+No.+123+Jakarta"
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
