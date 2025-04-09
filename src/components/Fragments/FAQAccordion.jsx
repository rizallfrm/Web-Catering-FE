import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQAccordion = () => {
    const faqs = [
      {
        question: "Berapa minimal order catering?",
        answer: "Minimal order untuk paket nasi kotak adalah 20 porsi, sedangkan prasmanan minimal 50 porsi. Untuk paket snack, minimal order 30 box."
      },
      {
        question: "Berapa lama waktu pemesanan sebelum acara?",
        answer: "Kami menyarankan pemesanan minimal 3 hari sebelum acara. Untuk acara besar atau di hari-hari libur, sebaiknya order minimal 1 minggu sebelumnya."
      },
      {
        question: "Apakah bisa custom menu?",
        answer: "Ya, kami menyediakan layanan custom menu sesuai kebutuhan Anda. Silakan konsultasikan detail menu dengan tim kami."
      },
      {
        question: "Berapa biaya tambahan untuk pengantaran?",
        answer: "Biaya pengantaran gratis untuk area Jakarta Selatan, Depok, dan sekitarnya. Untuk area di luar jangkauan, akan dikenakan biaya tambahan sesuai jarak."
      },
      {
        question: "Bagaimana cara pembayaran?",
        answer: "Kami menerima pembayaran via transfer bank (BCA, Mandiri, BRI) dan e-wallet. Untuk pemesanan di atas Rp 5 juta, kami menerima pembayaran bertahap."
      }
    ];
  
    const [openIndex, setOpenIndex] = useState(null);
  
    return (
      <div className="max-w-4xl mx-auto my-12 px-4">
        <div className="flex items-center justify-center mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-3xl font-bold text-gray-800">Pertanyaan Umum</h2>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center p-4 text-left 
                hover:bg-yellow-50 transition-colors duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="text-yellow-600" />
                ) : (
                  <ChevronDown className="text-yellow-600" />
                )}
              </button>
              {openIndex === index && (
                <div className="p-4 bg-yellow-50 text-gray-700">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

export default FAQAccordion;
