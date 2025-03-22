import { useState } from 'react';
import Input from '../Elements/Input';
import Button from '../Elements/Button';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Kontak = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulasi pengiriman form
    console.log('Form data submitted:', formData);
    setIsSubmitted(true);
    
    // Reset form setelah beberapa detik
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <div className="py-12 px-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-12">Kontak Kami</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-bold mb-6">Informasi Kontak</h2>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <FaPhone className="mt-1 mr-4 text-gray-700" />
              <div>
                <h3 className="font-medium">Telepon</h3>
                <p className="text-gray-600">+62 812-3456-7890</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <FaEnvelope className="mt-1 mr-4 text-gray-700" />
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-gray-600">info@cateringku.com</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <FaMapMarkerAlt className="mt-1 mr-4 text-gray-700" />
              <div>
                <h3 className="font-medium">Alamat</h3>
                <p className="text-gray-600">Jalan Sudirman No. 123<br />Jakarta Pusat, 10220<br />Indonesia</p>
              </div>
            </div>
          </div>
          
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-6">Jam Operasional</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Senin - Jumat:</span> 08.00 - 17.00 WIB</p>
              <p><span className="font-medium">Sabtu:</span> 09.00 - 15.00 WIB</p>
              <p><span className="font-medium">Minggu:</span> Tutup</p>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-6">Kirim Pesan</h2>
          
          {isSubmitted ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              <p className="font-medium">Terima kasih!</p>
              <p>Pesan Anda telah kami terima. Tim kami akan segera menghubungi Anda.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Masukkan nama lengkap Anda"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Masukkan alamat email Anda"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Telepon
                </label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Masukkan nomor telepon Anda"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Pesan
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  placeholder="Tuliskan pesan atau pertanyaan Anda"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                  required
                ></textarea>
              </div>
              
              <div className="pt-2">
                <Button type="submit" className="w-full">
                  Kirim Pesan
                </Button>
              </div>
            </form>
          )}
          
          <div className="mt-8 text-sm text-gray-600">
            <p>
              Kami berkomitmen untuk merespons setiap pertanyaan dalam waktu 24 jam pada hari kerja.
              Terima kasih atas kesabaran dan kepercayaan Anda kepada CateringKu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kontak;