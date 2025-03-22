const Card = ({ image, title, description, price }) => {
    return (
      <div className="bg-white rounded-lg overflow-hidden shadow-md">
        <div className="h-48 bg-gray-200">
          {image ? (
            <img src={image} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Tidak ada gambar tersedia
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-medium text-lg">{title}</h3>
          <p className="text-gray-600 text-sm mt-1">{description}</p>
          {price && (
            <p className="font-bold mt-3 text-gray-800">Rp {price.toLocaleString()}</p>
          )}
        </div>
      </div>
    );
  };
  
  export default Card;
  