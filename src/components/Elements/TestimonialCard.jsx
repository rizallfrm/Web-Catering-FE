const TestimonialCard = ({ image, name, role, testimonial }) => {
    return (
      <div className="flex flex-col items-center text-center p-4">
        <img 
          src={image} 
          alt={name} 
          className="w-16 h-16 rounded-full object-cover mb-4" 
        />
        <h3 className="font-medium">{name}</h3>
        <p className="text-sm text-gray-600 mb-2">{role}</p>
        <p className="text-sm text-gray-800">{testimonial}</p>
      </div>
    );
  };
  
  export default TestimonialCard;