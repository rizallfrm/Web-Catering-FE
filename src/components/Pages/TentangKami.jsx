import { Award, Users, Clock, BookOpen } from 'lucide-react';

const TentangKami = () => {
  // Data keunggulan
  const keunggulan = [
    {
      icon: <Award className="w-6 h-6" />,
      title: "Menu Bervariasi",
      desc: "Menu bervariasi yang dapat disesuaikan dengan kebutuhan acara"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Bahan Berkualitas",
      desc: "Bahan-bahan segar dan berkualitas untuk semua hidangan"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Tim Profesional",
      desc: "Tim profesional yang berpengalaman di bidangnya"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Tepat Waktu",
      desc: "Jaminan pengiriman tepat waktu sesuai jadwal"
    }
  ];

  return (
    <div className="py-16 px-4 ">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Tentang Kami</h1>
          <div className="w-20 h-1 bg-amber-500 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            CateringKu adalah penyedia jasa catering berkualitas yang telah melayani berbagai acara 
            sejak tahun 2010.
          </p>
        </div>
        
        {/* Profile Section */}
        <section className="mb-16 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Profil Kami</h2>
          <p className="text-gray-600 mb-4">
            CateringKu adalah penyedia jasa catering berkualitas yang telah melayani berbagai acara 
            sejak tahun 2010. Kami mengutamakan kepuasan pelanggan dengan menyajikan hidangan 
            lezat yang dibuat dari bahan-bahan berkualitas.
          </p>
          <p className="text-gray-600">
            Berawal dari hobi memasak, CateringKu didirikan dengan melayani 
            pesanan dari kerabat dan tetangga. Berkat kualitas dan cita rasa yang konsisten, 
            kami terus berkembang hingga menjadi perusahaan catering yang dipercaya untuk 
            menangani berbagai acara mulai dari pernikahan, ulang tahun, hingga acara korporat.
          </p>
        </section>
        
        {/* Visi & Misi */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Visi & Misi</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-amber-600 mb-3">Visi</h3>
              <p className="text-gray-600">
                Menjadi penyedia jasa catering pilihan utama untuk berbagai acara spesial di Indonesia.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-amber-600 mb-3">Misi</h3>
              <p className="text-gray-600">
                Menyajikan hidangan lezat berkualitas dengan pelayanan prima yang mengutamakan kepuasan pelanggan.
              </p>
            </div>
          </div>
        </section>
        
        {/* Keunggulan */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Keunggulan Kami</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {keunggulan.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md flex items-start">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-4 flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Tim Kami */}
        <section className="mb-16 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Tim Kami</h2>
          <p className="text-gray-600">
            Tim CateringKu terdiri dari para profesional berpengalaman di bidang kuliner dan event. 
            Dipimpin oleh Chef Berpengalaman yang telah mendalami berbagai masakan tradisional 
            dan internasional, kami berkomitmen untuk selalu memberikan yang terbaik.
          </p>
        </section>
        
        {/* Klien */}
        <section className="mb-16 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Klien Kami</h2>
          <p className="text-gray-600">
            Kami telah dipercaya oleh berbagai perusahaan dan individu untuk menyediakan 
            catering di acara-acara penting mereka. Beberapa klien kami termasuk perusahaan 
            multinasional, instansi pemerintah, dan berbagai event organizer terkemuka.
          </p>
        </section>
        
        {/* Call to Action */}
        <div className="bg-amber-500 text-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Siap Memesan?</h2>
          <p className="mb-6">
            Kami siap membantu mewujudkan acara spesial Anda dengan hidangan lezat berkualitas.
          </p>
          <button className="px-6 py-3 bg-white text-amber-600 rounded-md font-medium hover:bg-gray-100 transition-colors duration-300">
            Hubungi Kami
          </button>
        </div>
      </div>
    </div>
  );
};

export default TentangKami;