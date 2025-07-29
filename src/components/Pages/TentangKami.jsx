import { useState, useEffect, useRef } from "react";

const TentangKami = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const pageRef = useRef(null);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % keunggulan.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const keunggulan = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      title: "Rasa yang Khas",
      desc: "Rasa khas rumahan yang autentik dan menggugah selera",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: "Bahan Berkualitas",
      desc: "Bahan baku segar dan lokal, tanpa pengawet",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Tenaga Profesional",
      desc: "Tenaga kerja lokal, berpengalaman, dan penuh dedikasi",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Harga Terjangkau",
      desc: "Harga terjangkau dengan porsi mengenyangkan",
    },
  ];

  return (
    <div ref={pageRef} className="py-16 px-4 bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="max-w-4xl mx-auto">
        {/* Header with animation */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Tentang Kami
          </h1>
          <div className="w-20 h-1 bg-amber-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            🏠 Dapur Catering Mamake adalah penyedia jasa catering berkualitas yang
            telah melayani berbagai acara sejak tahun 2018.
          </p>
        </div>

        {/* Profile Section with animation */}
        <section
          className={`mb-16 bg-white rounded-lg shadow-md p-8 transition-all duration-1000 delay-150 border border-amber-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Profil Kami</h2>
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Dapur Catering Mamake adalah usaha mikro kecil menengah (UMKM) yang
            berdiri tahun 2018. Usaha ini lahir dari tangan hangat seorang ibu
            rumah tangga yang tak hanya piawai mengolah rasa, tetapi juga
            memiliki kecintaan mendalam terhadap dunia kuliner.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Berawal dari hobi memasak, Dapur Catering Mamake didirikan dengan melayani
            pesanan dari kerabat dan tetangga. Berkat kualitas dan cita rasa
            yang konsisten, kami terus berkembang hingga menjadi perusahaan
            catering yang dipercaya untuk menangani berbagai acara.
          </p>
        </section>

        {/* Visi & Misi with staggered animation */}
        <section
          className={`mb-16 transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Visi & Misi</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-amber-100">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-amber-600">
                  Visi
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Menjadi usaha catering terpercaya yang menyajikan cita rasa khas
                masakan rumahan sambil berkontribusi dalam menciptakan lapangan
                pekerjaan.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-amber-100">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-amber-600">
                  Misi
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Menyediakan makanan berkualitas dengan cita rasa khas rumahan
                yang sehat, higienis, dan lezat serta menciptakan lapangan
                pekerjaan bagi masyarakat sekitar.
              </p>
            </div>
          </div>
        </section>

        {/* Keunggulan with staggered animation */}
        <section
          className={`mb-16 transition-all duration-1000 delay-450 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Keunggulan Kami
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {keunggulan.map((item, index) => (
              <div
                key={index}
                className={`bg-white p-6 rounded-lg shadow-md flex items-start transition-all duration-500 border hover:shadow-lg ${
                  activeFeature === index 
                    ? "border-amber-300 transform scale-105" 
                    : "border-amber-100"
                } ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-4 flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                  {activeFeature === index && (
                    <div className="mt-3">
                      <div className="w-8 h-1 bg-amber-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action with animation */}
        <div
          className={`bg-amber-500 text-white rounded-lg shadow-lg p-8 text-center transition-all duration-1000 delay-750 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-2xl font-bold mb-4">🍽️ Siap Memesan?</h2>
          <p className="mb-6">
            Kami siap membantu mewujudkan acara spesial Anda dengan hidangan
            lezat berkualitas.
          </p>
          <button
            onClick={() => console.log("Navigate to /kontak")}
            className="inline-block bg-white text-amber-500 px-6 py-2 rounded-md hover:bg-gray-100 transition-colors duration-300 font-medium"
          >
            📞 Hubungi Kami
          </button>
        </div>

        {/* Timeline section */}
        <section
          className={`mt-16 transition-all duration-1000 delay-600 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Perjalanan Kami
            </h2>
          </div>
          
          <div className="space-y-8">
            {[
              {
                year: "2018",
                title: "Berdiri dengan Cinta",
                desc: "Dimulai dari dapur rumah dengan passion memasak seorang ibu rumah tangga",
                icon: "🏠"
              },
              {
                year: "2019-2020",
                title: "Kepercayaan Tetangga",
                desc: "Mulai melayani pesanan dari kerabat dan tetangga dengan konsistensi rasa",
                icon: "🤝"
              },
              {
                year: "2021-2023",
                title: "Berkembang Pesat",
                desc: "Ekspansi layanan dengan beragam paket catering untuk berbagai acara",
                icon: "📈"
              },
              {
                year: "Sekarang",
                title: "Catering Terpercaya",
                desc: "Menjadi pilihan utama catering di Banjarnegara dengan pelayanan profesional",
                icon: "🏆"
              }
            ].map((milestone, index) => (
              <div key={index} className="flex items-start bg-white rounded-lg p-6 shadow-md border border-amber-100">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-2xl">
                    {milestone.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-bold mr-3">
                      {milestone.year}
                    </span>
                    <h3 className="text-lg font-bold text-gray-800">
                      {milestone.title}
                    </h3>
                  </div>
                  <p className="text-gray-600">
                    {milestone.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats section */}
        <section
          className={`mt-16 transition-all duration-1000 delay-800 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="bg-white rounded-lg shadow-lg p-8 border border-amber-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              📊 Pencapaian Kami
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { number: "6+", label: "Tahun Pengalaman", icon: "📅" },
                { number: "1000+", label: "Acara Dilayani", icon: "🎉" },
                { number: "50+", label: "Menu Variatif", icon: "🍽️" },
                { number: "98%", label: "Kepuasan Pelanggan", icon: "⭐" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold text-amber-600 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg p-8 text-white shadow-lg">
          <h3 className="text-2xl font-bold mb-4">
            🤝 Mari Berkolaborasi!
          </h3>
          <p className="text-amber-100 mb-6">
            Wujudkan acara impian Anda bersama Dapur Catering Mamake
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.open("https://wa.me/6289527308651", "_blank")}
              className="px-6 py-3 bg-white text-amber-600 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 shadow-md transform hover:scale-105"
            >
              📞 Hubungi Kami Sekarang
            </button>
            <button
              onClick={() => console.log("Navigate to /menu")}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white border border-white rounded-full font-bold hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
            >
              🍽️ Lihat Menu Kami
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TentangKami;