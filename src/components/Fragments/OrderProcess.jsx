import { FaClipboardCheck, FaUserCog, FaClipboardList, FaSearch } from 'react-icons/fa';
import { Fa42Group } from 'react-icons/fa6';

const OrderProcess = () => {
  const steps = [
    {
      id: 1,
      icon: <FaClipboardCheck className="w-8 h-8"/>,
      title: 'Pilih Paket',
      description: 'Pilih dan pesan menu yang sesuai dengan acara Anda'
    },
    {
      id: 2,
      icon: <FaClipboardList className="w-8 h-8"/>,
      title: 'Atur Tanggal',
      description: 'Tentukan tanggal dan waktu pengantaran'
    },
    {
      id: 3,
      icon: <Fa42Group className="w-8 h-8"/>,
      title: 'Pengiriman',
      description: 'Kami antar tepat waktu ke lokasi Anda'
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12">Cara Pemesanan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map(step => (
            <div key={step.id} className="flex flex-col items-center text-center">
              <div className="mb-4 text-gray-800">
                {step.icon}
              </div>
              <h3 className="font-medium text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrderProcess;