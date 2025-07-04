import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import OrderService from '../components/services/orderService';
import LoadingSpinner from './LoadingSpinner';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await OrderService.getOrderDetails(id);
        setOrder(orderData);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Gagal memuat detail pesanan');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadError('Pilih file terlebih dahulu');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('payment_proof', file);

      await OrderService.uploadPaymentProof(id, formData);
      
      // Refresh order data
      const updatedOrder = await OrderService.getOrderDetails(id);
      setOrder(updatedOrder);
      
      setFile(null);
      setUploadError(null);
    } catch (err) {
      console.error('Error uploading payment proof:', err);
      setUploadError(err.serverMessage || 'Gagal mengunggah bukti pembayaran');
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Menunggu Konfirmasi':
        return 'bg-yellow-100 text-yellow-800';
      case 'Dikonfirmasi':
        return 'bg-blue-100 text-blue-800';
      case 'Diproses':
        return 'bg-purple-100 text-purple-800';
      case 'Selesai':
        return 'bg-green-100 text-green-800';
      case 'Dibatalkan':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!order) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">Detail Pesanan</h1>
            <p className="text-gray-500">ID: #{order.id}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(order.status)}`}>
            {order.status}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Informasi Pesanan</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600">Tanggal Pesan</p>
                <p>{new Date(order.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
              <div>
                <p className="text-gray-600">Tanggal Pengantaran</p>
                <p>{new Date(order.delivery_date).toLocaleDateString('id-ID')}</p>
              </div>
              <div>
                <p className="text-gray-600">Alamat Pengantaran</p>
                <p>{order.delivery_address}</p>
              </div>
              <div>
                <p className="text-gray-600">Catatan</p>
                <p>{order.delivery_notes || '-'}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Informasi Pembayaran</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600">Status Pembayaran</p>
                <p className="capitalize">{order.payment_status?.toLowerCase()}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Pembayaran</p>
                <p className="font-bold">Rp{order.total_price?.toLocaleString()}</p>
              </div>
              {order.proof_image_url && (
                <div>
                  <p className="text-gray-600">Bukti Pembayaran</p>
                  <a 
                    href={order.proof_image_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Lihat Bukti
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Item Pesanan</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            {order.OrderItems?.map(item => (
              <div key={item.id} className="py-3 border-b border-gray-200 last:border-0 flex justify-between">
                <div>
                  <p className="font-medium">{item.Menu?.name}</p>
                  <p className="text-sm text-gray-500">{item.quantity} × Rp{item.price?.toLocaleString()}</p>
                </div>
                <p>Rp{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
            
            <div className="pt-4 mt-4 border-t border-gray-200">
              <div className="flex justify-between font-medium">
                <span>Subtotal:</span>
                <span>Rp{order.total_price?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Biaya Pengiriman:</span>
                <span>Gratis</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-200">
                <span>Total:</span>
                <span>Rp{order.total_price?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
        
        {order.status === 'Dikonfirmasi' && order.payment_status === 'Belum Bayar' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-lg mb-2">Lanjutkan Pembayaran</h3>
            <p className="mb-4">Silakan transfer ke rekening berikut:</p>
            
            <div className="bg-white p-4 rounded-md mb-4">
              <p className="font-medium">Bank BCA</p>
              <p className="text-gray-600">1234567890</p>
              <p className="font-medium">a.n. Nama Catering Anda</p>
              <p className="text-gray-600">Jumlah: Rp{order.total_price?.toLocaleString()}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Unggah Bukti Pembayaran</label>
              <input 
                type="file" 
                onChange={handleFileChange}
                accept="image/*,.pdf"
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-orange-50 file:text-orange-700
                  hover:file:bg-orange-100"
              />
              {uploadError && <p className="text-red-500 text-sm mt-1">{uploadError}</p>}
            </div>
            
            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {isUploading ? 'Mengunggah...' : 'Kirim Bukti Pembayaran'}
            </button>
          </div>
        )}
        
        {order.payment_status === 'Menunggu Verifikasi' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-lg mb-2">Bukti Pembayaran Terkirim</h3>
            <p>Bukti pembayaran Anda telah berhasil dikirim dan sedang menunggu verifikasi admin.</p>
          </div>
        )}
        
        {order.payment_status === 'Sudah Dibayar' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Pembayaran Terverifikasi</h3>
            <p>Pembayaran Anda telah diverifikasi. Pesanan sedang diproses.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;