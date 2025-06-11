import { useState, useEffect, useRef } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import avatar1 from '../../../public/avatar1.jpg';
import avatar2 from '../../../public/avatar2.jpg';

// Expanded testimonials array with more detailed content
const allTestimonials = [
  {
    id: 1,
    image: avatar1,
    name: 'Putra Wijaya',
    role: 'Wedding Organizer',
    testimonial: 'Makanan lezat, pelayanan memuaskan. Sangat recommended untuk acara pernikahan! Tim mereka sangat kooperatif dan membantu kami dalam menentukan menu yang tepat untuk tamu undangan kami.',
    rating: 5,
    date: '15 Maret 2023',
    event: 'Pernikahan'
  },
  {
    id: 2,
    image: avatar2,
    name: 'Anita Sari',
    role: 'Event Manager',
    testimonial: 'Profesional dan tepat waktu. Menu yang disajikan sesuai ekspektasi dan tamu sangat puas. Kualitas makanan sangat konsisten dari awal hingga akhir acara.',
    rating: 5,
    date: '28 April 2023',
    event: 'Corporate Gathering'
  },
  {
    id: 3,
    image: null, // Will use initials instead
    name: 'Budi Santoso',
    role: 'Kepala Divisi HR',
    testimonial: 'Catering Mamake selalu menjadi pilihan utama untuk acara perusahaan kami. Selain rasa yang enak, presentasi makanan juga sangat menarik dan menggugah selera.',
    rating: 4,
    date: '10 Juni 2023',
    event: 'Company Anniversary'
  },
  {
    id: 4,
    image: null,
    name: 'Dian Permata',
    role: 'Ibu Rumah Tangga',
    testimonial: 'Pesan nasi tumpeng untuk acara syukuran keluarga, rasanya enak sekali. Porsinya juga pas dan penataan sangat cantik. Pasti akan pesan lagi.',
    rating: 5,
    date: '5 Mei 2023',
    event: 'Syukuran Keluarga'
  }
];

const TestimonialSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleTestimonials, setVisibleTestimonials] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const testimonialRef = useRef(null);
  
  // Configure how many testimonials to show based on screen size
  const getVisibleCount = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024 ? 2 : 1;
    }
    return 1;
  };
  
  useEffect(() => {
    const handleResize = () => {
      const visibleCount = getVisibleCount();
      updateVisibleTestimonials(activeIndex, visibleCount);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  useEffect(() => {
    const visibleCount = getVisibleCount();
    updateVisibleTestimonials(activeIndex, visibleCount);
  }, [activeIndex]);
  
  // Update which testimonials are visible
  const updateVisibleTestimonials = (startIndex, count) => {
    const testimonials = [];
    for (let i = 0; i < count; i++) {
      const index = (startIndex + i) % allTestimonials.length;
      testimonials.push(allTestimonials[index]);
    }
    setVisibleTestimonials(testimonials);
  };
  
  const goToNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % allTestimonials.length);
  };
  
  const goToPrev = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? allTestimonials.length - 1 : prevIndex - 1
    );
  };

  // Auto rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  // Intersection observer for animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Generate initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Render stars based on rating
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        className={`${i < rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <section 
      ref={sectionRef}
      className="py-24 px-4 bg-gradient-to-b from-white to-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <span className="px-4 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium inline-block mb-4">
            Kata Mereka
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Testimoni Pelanggan
          </h2>
          <div className="w-24 h-1 bg-amber-500 mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Apa kata pelanggan kami yang telah merasakan layanan catering Mamake
            untuk berbagai acara spesial mereka
          </p>
        </div>

        {/* Testimonial cards section with animation */}
        <div 
          ref={testimonialRef}
          className={`relative transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Large quote icon */}
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-amber-200 opacity-60">
            <Quote size={120} />
          </div>
          
          {/* Testimonial cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
            {visibleTestimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 transform ${
                  index === 0 ? 'lg:translate-y-4' : 'lg:-translate-y-4'
                } hover:shadow-xl`}
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center">
                      {testimonial.image ? (
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          className="w-14 h-14 rounded-full object-cover border-2 border-amber-200"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-lg border-2 border-amber-200">
                          {getInitials(testimonial.name)}
                        </div>
                      )}
                      <div className="ml-4">
                        <h3 className="font-bold text-lg text-gray-800">{testimonial.name}</h3>
                        <p className="text-gray-600 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-medium">
                        {testimonial.event}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-6 relative">
                    <Quote size={20} className="absolute -top-2 -left-1 text-amber-300 opacity-40" />
                    <p className="text-gray-700 italic pl-5">
                      "{testimonial.testimonial}"
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex">
                      {renderStars(testimonial.rating)}
                    </div>
                    <span className="text-xs text-gray-500">{testimonial.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-center mt-10 space-x-4">
            <button 
              onClick={goToPrev} 
              className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-amber-500 hover:text-white transition-colors duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center space-x-2">
              {allTestimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    activeIndex === idx 
                      ? 'bg-amber-500 w-6' 
                      : 'bg-gray-300 hover:bg-amber-300'
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
            <button 
              onClick={goToNext}
              className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-amber-500 hover:text-white transition-colors duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        {/* Call to action */}
        <div className={`mt-20 bg-white p-8 rounded-2xl shadow-lg max-w-3xl mx-auto border border-amber-100 transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <div className="flex items-center mb-2">
                <MessageSquare className="text-amber-500 mr-2" size={20} />
                <h3 className="text-xl font-bold text-gray-800">Bagikan Pengalaman Anda</h3>
              </div>
              <p className="text-gray-600">
                Sudah pernah menggunakan jasa catering kami? Kami akan senang mendengar cerita Anda!
              </p>
            </div>
            <button className="px-6 py-3 bg-amber-500 text-white rounded-full font-medium hover:bg-amber-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 whitespace-nowrap">
              Tulis Testimoni
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;