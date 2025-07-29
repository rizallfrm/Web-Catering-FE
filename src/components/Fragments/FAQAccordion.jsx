import { useState, useEffect, useRef } from "react";

const FAQAccordion = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const accordionRef = useRef(null);

  const faqs = [
    {
      question: "Berapa minimal order catering?",
      answer: "Minimal order untuk paket tersedia dalam Menu Page",
      category: "pemesanan",
    },
    {
      question: "Berapa lama waktu pemesanan sebelum acara?",
      answer:
        "Kami menyarankan pemesanan minimal 3 hari sebelum acara. Untuk acara besar atau di hari-hari libur, sebaiknya order minimal 1 minggu sebelumnya.",
      category: "pemesanan",
    },
    {
      question: "Apakah bisa custom menu?",
      answer:
        "Ya, kami menyediakan layanan custom menu sesuai kebutuhan Anda. Silakan konsultasikan kepada Admin Whatsapp kami untuk mendapatkan menu yang sesuai dengan ekspektasi dan anggaran Anda.",
      category: "menu",
    },
    {
      question: "Berapa biaya tambahan untuk pengantaran?",
      answer:
        "Biaya pengantaran tergantung pada jarak pengiriman untuk area Banjarnegara, dan sekitarnya dengan minimum order tertentu. Untuk area di luar jangkauan, akan dikenakan biaya tambahan sesuai jarak lokasi pengantaran.",
      category: "pengantaran",
    },
    {
      question: "Bagaimana cara pembayaran?",
      answer:
        "Untuk pembayaran, Anda upload file bukti pembayaran ketika checkout dan sudah diterima. Kami akan memproses pembayaran Anda secara otomatis. Jika ada pertanyaan lebih lanjut, silakan hubungi Admin Whatsapp kami.",
      category: "pembayaran",
    },
    {
      question: "Apa yang terjadi jika ada perubahan jumlah porsi?",
      answer:
        "Perubahan jumlah porsi dapat dilakukan maksimal 3 hari sebelum acara. Penambahan porsi bergantung pada ketersediaan, sedangkan pengurangan porsi hanya dapat dilakukan maksimal 20% dari total pesanan awal. Jika ada pertanyaan lebih lanjut, silakan hubungi Admin Whatsapp kami.",
      category: "pemesanan",
    },
  ];

  const categories = [...new Set(faqs.map((faq) => faq.category))];

  useEffect(() => {
    setFilteredFaqs(faqs);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredFaqs(faqs);
    } else {
      const filtered = faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFaqs(filtered);
    }
  }, [searchTerm]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (accordionRef.current) {
      observer.observe(accordionRef.current);
    }

    return () => {
      if (accordionRef.current) {
        observer.unobserve(accordionRef.current);
      }
    };
  }, []);

  const filterByCategory = (category) => {
    if (category === "all") {
      setFilteredFaqs(faqs);
    } else {
      const filtered = faqs.filter((faq) => faq.category === category);
      setFilteredFaqs(filtered);
    }
    setSearchTerm("");
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div
      ref={accordionRef}
      className={`max-w-4xl mx-auto my-16 px-4 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-amber-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Pertanyaan Umum</h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          ❓ Temukan jawaban untuk pertanyaan yang sering diajukan mengenai layanan
          catering kami
        </p>

        {/* Search bar */}
        <div className="relative max-w-md mx-auto mb-10">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Cari pertanyaan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => filterByCategory("all")}
            className="px-4 py-1.5 rounded-full text-sm font-medium bg-amber-500 text-white shadow-sm hover:bg-amber-600 transition-colors duration-300"
          >
            Semua
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => filterByCategory(category)}
              className="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700 shadow-sm hover:bg-gray-200 transition-colors duration-300 capitalize"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${
                openIndex === index ? "ring-1 ring-amber-400" : ""
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center p-5 text-left hover:bg-amber-50/50 transition-colors duration-300"
                aria-expanded={openIndex === index}
              >
                <h3 className="text-lg font-semibold text-gray-800 pr-8">
                  {faq.question}
                </h3>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    openIndex === index
                      ? "bg-amber-500 text-white rotate-180"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="p-5 bg-amber-50/50 border-t border-amber-100">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>

                  <div className="mt-4 flex items-center">
                    <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded-full capitalize">
                      {faq.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
              <svg className="h-8 w-8 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Tidak ada hasil ditemukan
            </h3>
            <p className="text-gray-600">
              Tidak ada pertanyaan yang cocok dengan pencarian "{searchTerm}".
            </p>
            <button
              onClick={handleClearSearch}
              className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors duration-300"
            >
              Reset Pencarian
            </button>
          </div>
        )}
      </div>

      {/* Contact callout */}
      <div className="mt-12 p-6 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl text-white text-center shadow-lg">
        <h3 className="text-xl font-bold mb-2">Tidak menemukan jawaban?</h3>
        <p className="mb-4">Tim kami siap membantu menjawab pertanyaan Anda</p>

        <button 
          onClick={() => window.open("https://wa.me/6289527308651", "_blank")}
          className="px-6 py-2 bg-white text-amber-600 rounded-full font-medium hover:bg-gray-100 transition-colors duration-300 shadow-md"
        >
          Hubungi Kami
        </button>
      </div>
    </div>
  );
};

export default FAQAccordion;