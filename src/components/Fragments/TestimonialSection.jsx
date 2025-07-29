import { useState, useEffect } from "react";

const TestimonialSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Data testimoni - ganti dengan data asli Anda
  const testimonials = [
    {
      id: 1,
      name: "Bu Eno Kertayasa",
      text: "Makanannya enak dan mantul banget",
      images: ["../../../public/testimoni/Bu Eno Kertayasa.jpg"],
    },
    {
      id: 2,
      name: "Handayani",
      text: "Nasi daun jeruk nya enak banget",
      images: ["../../../public/testimoni/Handayani.jpg"],
    },
    {
      id: 3,
      name: "Laras",
      text: "Semuanya enak gausah diragukan lagi",
      images: ["../../../public/testimoni/Laras.jpg"],
    },
    {
      id: 4,
      name: "Fani",
      text: "Rasanya selalu enak gapernah gagal",
      images: ["../../../public/testimoni/Fani.jpg"],
    },
    {
      id: 5,
      name: "Desti Ariska",
      text: "Ayamnya enak, nasinya juga mantul",
      images: ["../../../public/testimoni/Desti Ariska.jpg"],
    },
    {
      id: 6,
      name: "Prof Akira",
      text: "Nasil liwetnya enak",
      images: ["../../../public/testimoni/Prof Akira.jpg"],
    },
  ];

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) =>
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
      setCurrentImageIndex(0);
    }, 8000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  // Auto-play images within current testimonial
  useEffect(() => {
    if (!isAutoPlaying || testimonials[currentTestimonial].images.length <= 1)
      return;

    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === testimonials[currentTestimonial].images.length - 1
          ? 0
          : prev + 1
      );
    }, 4000);

    return () => clearInterval(imageInterval);
  }, [currentTestimonial, isAutoPlaying, testimonials]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
    setCurrentImageIndex(0);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === testimonials[currentTestimonial].images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? testimonials[currentTestimonial].images.length - 1 : prev - 1
    );
  };

  const goToTestimonial = (index) => {
    setCurrentTestimonial(index);
    setCurrentImageIndex(0);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Testimoni Klien
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Kepercayaan dan kepuasan klien adalah yang terpenting bagi kami.
            Simak pengalaman mereka yang telah mempercayakan event spesial
            kepada kami.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Image Carousel - Left Side */}
            <div className="w-full lg:w-1/2">
              <div className="relative">
                {/* Main Image */}
                <div className="relative h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={
                      testimonials[currentTestimonial].images[currentImageIndex]
                    }
                    alt={`Testimonial ${currentTestimonial + 1} - Image ${
                      currentImageIndex + 1
                    }`}
                    className="w-full h-full object-cover transition-all duration-700 ease-out"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/600x500/f3f4f6/9ca3af?text=Testimonial+Image";
                    }}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                  {/* Image Navigation */}
                  {testimonials[currentTestimonial].images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        onMouseEnter={() => setIsAutoPlaying(false)}
                        onMouseLeave={() => setIsAutoPlaying(true)}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 transition-all duration-300 shadow-lg backdrop-blur-sm"
                      >
                        <svg
                          className="w-5 h-5 text-gray-700"
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
                        onMouseEnter={() => setIsAutoPlaying(false)}
                        onMouseLeave={() => setIsAutoPlaying(true)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 transition-all duration-300 shadow-lg backdrop-blur-sm"
                      >
                        <svg
                          className="w-5 h-5 text-gray-700"
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
                  <div className="absolute bottom-6 right-6 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                    {currentImageIndex + 1} /{" "}
                    {testimonials[currentTestimonial].images.length}
                  </div>

                  {/* Auto-play Toggle */}
                  <div className="absolute top-6 right-6">
                    <button
                      onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                      className="bg-black/60 text-white p-3 rounded-full hover:bg-black/80 transition-all backdrop-blur-sm"
                      title={
                        isAutoPlaying ? "Pause slideshow" : "Play slideshow"
                      }
                    >
                      {isAutoPlaying ? (
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Image Dots Indicator */}
                {testimonials[currentTestimonial].images.length > 1 && (
                  <div className="flex justify-center mt-6 space-x-3">
                    {testimonials[currentTestimonial].images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentImageIndex
                            ? "bg-orange-500 scale-125"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Testimonial Content - Right Side */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              {/* Quote Icon */}
              <div className="mb-8 flex justify-center lg:justify-start">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-orange-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                  </svg>
                </div>
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-2xl md:text-3xl leading-relaxed text-gray-700 mb-8 font-light italic">
                "{testimonials[currentTestimonial].text}"
              </blockquote>

              {/* Client Name */}
              <div className="mb-10">
                <h4 className="text-2xl font-bold text-gray-800">
                  {testimonials[currentTestimonial].name}
                </h4>
              </div>

              {/* Testimonial Navigation */}
              <div className="flex items-center justify-center lg:justify-start space-x-6">
                <button
                  onClick={prevTestimonial}
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  onMouseLeave={() => setIsAutoPlaying(true)}
                  className="bg-gray-100 hover:bg-orange-500 hover:text-white text-gray-600 rounded-full p-4 transition-all duration-300 shadow-md hover:shadow-lg group"
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

                {/* Pagination Dots */}
                <div className="flex space-x-3">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToTestimonial(index)}
                      onMouseEnter={() => setIsAutoPlaying(false)}
                      onMouseLeave={() => setIsAutoPlaying(true)}
                      className={`w-4 h-4 rounded-full transition-all duration-300 ${
                        index === currentTestimonial
                          ? "bg-orange-500 scale-125"
                          : "bg-gray-300 hover:bg-orange-300"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextTestimonial}
                  onMouseEnter={() => setIsAutoPlaying(false)}
                  onMouseLeave={() => setIsAutoPlaying(true)}
                  className="bg-gray-100 hover:bg-orange-500 hover:text-white text-gray-600 rounded-full p-4 transition-all duration-300 shadow-md hover:shadow-lg group"
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
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="mt-20">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-12 text-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-5xl md:text-6xl font-bold mb-4">100+</div>
                <div className="text-xl opacity-90">Event Sukses</div>
              </div>
              <div>
                <div className="text-5xl md:text-6xl font-bold mb-4">98%</div>
                <div className="text-xl opacity-90">Kepuasan Klien</div>
              </div>
              <div>
                <div className="text-5xl md:text-6xl font-bold mb-4">5★</div>
                <div className="text-xl opacity-90">Rating Rata-rata</div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        {/* <div className="text-center mt-16">
          <h3 className="text-3xl font-bold text-gray-800 mb-6">
            Siap Mewujudkan Event Impian Anda?
          </h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ratusan klien yang telah merasakan pelayanan terbaik dari kami
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Konsultasi Gratis Sekarang
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default TestimonialSection;
