import TestimonialCard from '../Elements/TestimonialCard';
import avatar1 from '../../assets/images/avatar1.jpg';
import avatar2 from '../../assets/images/avatar2.jpg';

const TestimonialSection = () => {
  const testimonials = [
    {
      id: 1,
      image: avatar1,
      name: 'Putra Wijaya',
      role: 'Wedding Organizer',
      testimonial: 'Makanan lezat, pelayanan memuaskan. Sangat recommended untuk acara pernikahan!'
    },
    {
      id: 2,
      image: avatar2,
      name: 'Anita Sari',
      role: 'Event Manager',
      testimonial: 'Profesional dan tepat waktu. Menu yang disajikan sesuai ekspektasi dan tamu sangat puas.'
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12">Testimoni Pelanggan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map(testimonial => (
            <TestimonialCard
              key={testimonial.id}
              image={testimonial.image}
              name={testimonial.name}
              role={testimonial.role}
              testimonial={testimonial.testimonial}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;