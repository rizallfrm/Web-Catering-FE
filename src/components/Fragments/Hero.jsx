import Button from "../Elements/Button";
const Hero = () => {
  return (
    <div className="hero-section py-24 px-4 sm:px-6 lg:px-8 text-white text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Catering Lezat untuk Setiap Acara
        </h1>
        <p className="text-lg mb-8">
          Hidangan berkualitas prima dengan rasa spesial untuk Anda
        </p>
        <Button primary>Pesan Sekarang</Button>
      </div>
    </div>
  );
};

export default Hero;
