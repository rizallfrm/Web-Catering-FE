import { Award, Users, Clock, BookOpen, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const TentangKami = () => {
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

  const keunggulan = [
    {
      icon: <Award className="w-6 h-6" />,
      title: "Rasa yang Khas",
      desc: "Rasa khas rumahan yang autentik dan menggugah selera",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Bahan Berkualitas",
      desc: "Bahan baku segar dan lokal, tanpa pengawet",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Tenaga Profesional",
      desc: "Tenaga kerja lokal, berpengalaman, dan penuh dedikasi",
    },
    {
      icon: <Wallet className="w-6 h-6" />,
      title: "Harga Terjangkau",
      desc: "Harga terjangkau dengan porsi mengenyangkan",
    },
  ];

  return (
    <div ref={pageRef} className="py-16 px-4">
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
          <div className="w-20 h-1 bg-amber-500 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Dapur Catering Mamake adalah penyedia jasa catering berkualitas yang
            telah melayani berbagai acara sejak tahun 2018.
          </p>
        </div>

        {/* Profile Section with animation */}
        <section
          className={`mb-16 bg-white rounded-lg shadow-md p-8 transition-all duration-1000 delay-150 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Profil Kami</h2>
          <p className="text-gray-600 mb-4">
            Dapur Catering Mamake adalah usaha mikro kecil menengah (UMKM) yang
            berdiri tahun 2018. Usaha ini lahir dari tangan hangat seorang ibu
            rumah tangga yang tak hanya piawai mengolah rasa, tetapi juga
            memiliki kecintaan mendalam terhadap dunia kuliner.
          </p>
          <p className="text-gray-600">
            Berawal dari hobi memasak, CateringKu didirikan dengan melayani
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Visi & Misi</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-amber-600 mb-3">
                Visi
              </h3>
              <p className="text-gray-600">
                Menjadi usaha catering terpercaya yang menyajikan cita rasa khas
                masakan rumahan sambil berkontribusi dalam menciptakan lapangan
                pekerjaan.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-amber-600 mb-3">
                Misi
              </h3>
              <p className="text-gray-600">
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Keunggulan Kami
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {keunggulan.map((item, index) => (
              <div
                key={index}
                className={`bg-white p-6 rounded-lg shadow-md flex items-start transition-all duration-500 delay-${
                  index * 100
                } ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-4 flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tim Kami with animation */}
        {/* <section
          className={`mb-16 bg-white rounded-lg shadow-md p-8 transition-all duration-1000 delay-600 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Tim Kami</h2>
          <p className="text-gray-600">
            Tim CateringKu terdiri dari para profesional berpengalaman di bidang
            kuliner dan event. Dipimpin oleh Chef Berpengalaman yang telah
            mendalami berbagai masakan tradisional dan internasional.
          </p>
        </section> */}

        {/* Call to Action with animation */}
        {/* <div
          className={`bg-amber-500 text-white rounded-lg shadow-md p-8 text-center transition-all duration-1000 delay-750 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-2xl font-bold mb-4">Siap Memesan?</h2>
          <p className="mb-6">
            Kami siap membantu mewujudkan acara spesial Anda dengan hidangan
            lezat berkualitas.
          </p>
          <Link
            to="/kontak"
            className="inline-block bg-white text-amber-500 px-6 py-2 rounded-md hover:bg-gray-100 transition-colors duration-300"
          >
            Hubungi Kami
          </Link>
        </div> */}
      </div>
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

export default TentangKami;
