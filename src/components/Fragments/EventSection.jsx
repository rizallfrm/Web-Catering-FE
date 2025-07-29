import { useState } from "react";

const EventSection = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Data contoh event - ganti dengan data asli Anda
  const events = [
    {
      id: 1,
      title: "Peresmian Gedung Puskesmas Susukan 1",
      date: "15 Januari 2024",
      location: "Puskesmas Susukan 1",
      guests: "200 Tamu",
      category: "Peresmian",
      description:
        "Acara peresmian Gedung Puskesmas Susukan 1 dihadiri oleh tamu undangan dari berbagai kalangan, termasuk pejabat daerah, tenaga medis, dan masyarakat setempat. ",
      images: [
        "../../../public/event/p.gedung susukan1.jpg",
        "../../../public/event/p.gedung ssukan2.jpg",
      ],
      highlights: [
        "Menu 4 course dinner",
        "Live cooking station",
        "Dessert bar premium",
        "Pelayanan white glove service",
      ],
    },
    {
      id: 2,
      title: "Penlilaian Akreditasi MTS NU Ma'arif Susukan 1",
      date: "28 Februari 2024",
      location: "MTS NU Ma'arif Susukan 1",
      guests: "500 Tamu",
      category: "Akreditasi",
      description:
        "Kegiatan penilaian akreditasi MTS NU Ma'arif Susukan 1 yang bertujuan untuk memastikan mutu pendidikan sesuai standar nasional. ",
      images: [
        "../../../public/event/p.akred.jpg",
        "../../../public/event/p.akred2.jpg",
      ],
      highlights: [
        "Indonesian buffet premium",
        "Coffee break station",
        "Team building lunch",
        "Dokumentasi profesional",
      ],
    },
    {
      id: 3,
      title: "Acara Akhirusanah MTS NU Ma'arif",
      date: "10 Maret 2024",
      location: "MTS NU Ma'arif",
      guests: "150 Tamu",
      category: "Perpisahan",
      description:
        "Acara Akhirusanah MTS NU Ma'arif menjadi momen perpisahan dan apresiasi bagi siswa-siswi kelas akhir.",
      images: ["../../../public/event/300 box.jpg"],
      highlights: [
        "Custom birthday cake 3 tier",
        "Candy corner station",
        "Photo booth setup",
        "DJ dan entertainment",
      ],
    },
    {
      id: 4,
      title: "Event Kampanye calon bupati",
      date: "22 April 2024",
      location: "Banjarnegara",
      guests: "100 Tamu",
      category: "Kampanye",
      description:
        "Acara kampanye calon bupati yang dihadiri oleh relawan, simpatisan, dan tokoh masyarakat. Kegiatan ini mencakup pemaparan visi-misi, dialog interaktif dengan warga, serta sesi diskusi mengenai program pembangunan daerah. ",
      images: ["../../../public/event/600 box.jpg"],
      highlights: [
        "Coffee tasting session",
        "Signature pastries",
        "Live acoustic performance",
        "Networking session",
      ],
    },
  ];

  const openModal = (event) => {
    setSelectedEvent(event);
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedEvent) {
      setCurrentImageIndex((prev) =>
        prev === selectedEvent.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedEvent) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedEvent.images.length - 1 : prev - 1
      );
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Wedding: "bg-pink-100 text-pink-800",
      Corporate: "bg-blue-100 text-blue-800",
      Birthday: "bg-purple-100 text-purple-800",
      "Grand Opening": "bg-green-100 text-green-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Event yang Pernah Kami Tangani
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kepercayaan klien adalah prioritas utama kami. Berikut adalah
            beberapa event yang telah berhasil kami layani dengan penuh dedikasi
            dan profesionalisme.
          </p>
        </div>

        {/* Event Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => openModal(event)}
            >
              {/* Event Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={event.images[0]}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=Event+Image";
                  }}
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                      event.category
                    )}`}
                  >
                    {event.category}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  +{event.images.length} foto
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                  {event.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {event.description}
                </p>

                {/* Event Details */}
                <div className="space-y-2 text-sm text-gray-500">
                  {/* <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {event.date}
                  </div> */}
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {event.location}
                  </div>
                  {/* <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                    {event.guests}
                  </div> */}
                </div>

                {/* View Details Button */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="text-orange-600 font-medium group-hover:text-orange-700">
                    Lihat Detail →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Ingin event Anda menjadi yang terbaik seperti mereka?
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300">
            Konsultasi Gratis Sekarang
          </button>
        </div> */}
      </div>

      {/* Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {selectedEvent.title}
                </h3>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getCategoryColor(
                    selectedEvent.category
                  )}`}
                >
                  {selectedEvent.category}
                </span>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Image Carousel */}
              <div className="relative mb-6">
                <div className="relative h-80 rounded-lg overflow-hidden">
                  <img
                    src={selectedEvent.images[currentImageIndex]}
                    alt={`${selectedEvent.title} ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/800x400/f3f4f6/9ca3af?text=Event+Image";
                    }}
                  />

                  {/* Navigation Arrows */}
                  {selectedEvent.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {selectedEvent.images.length}
                  </div>
                </div>

                {/* Thumbnail Navigation */}
                {selectedEvent.images.length > 1 && (
                  <div className="flex space-x-2 mt-4 overflow-x-auto">
                    {selectedEvent.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex
                            ? "border-orange-500"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/80x64/f3f4f6/9ca3af?text=Img";
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    Detail Event
                  </h4>
                  <div className="space-y-3 text-sm">
                    {/* Lokasi */}
                    {/* <div className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-3 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-600">
                        {selectedEvent.date}
                      </span>
                    </div> */}
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-3 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-600">
                        {selectedEvent.location}
                      </span>
                    </div>
                    {/* Tamu */}
                    {/* <div className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-3 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                      </svg>
                      <span className="text-gray-600">
                        {selectedEvent.guests}
                      </span>
                    </div> */}
                  </div>

                  <div className="mt-6">
                    <h5 className="font-semibold text-gray-800 mb-2">
                      Deskripsi
                    </h5>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {selectedEvent.description}
                    </p>
                  </div>
                </div>

                {/* <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    Highlights
                  </h4>
                  <div className="space-y-2">
                    {selectedEvent.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center">
                        <svg
                          className="w-5 h-5 mr-3 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-600 text-sm">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                    <h5 className="font-semibold text-gray-800 mb-2">
                      Tertarik dengan event serupa?
                    </h5>
                    <p className="text-sm text-gray-600 mb-3">
                      Konsultasikan kebutuhan event Anda dengan tim profesional
                      kami
                    </p>
                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300">
                      Hubungi Kami Sekarang
                    </button>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default EventSection;
