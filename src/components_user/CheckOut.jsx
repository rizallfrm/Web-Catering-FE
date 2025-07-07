import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import OrderService from "../components/services/orderService";
import LoadingSpinner from "./LoadingSpinner";
import { getNextDateForDay, formatIndonesianDate } from "../utils/dateUtils";
import dayjs from "dayjs";
import "dayjs/locale/id";

dayjs.locale("id");
const initialWeeklySchedule = {
  senin: { selected: false, date: "", time: "" },
  selasa: { selected: false, date: "", time: "" },
  rabu: { selected: false, date: "", time: "" },
  kamis: { selected: false, date: "", time: "" },
  jumat: { selected: false, date: "", time: "" },
  sabtu: { selected: false, date: "", time: "" },
};

const initialFormData = {
  delivery_date: "",
  wa_number: "",
  delivery_address: "",
  delivery_time: "",
  notes: "",
};

const CheckoutPage = () => {
  const { cart, isLoading: isCartLoading, clearCart } = useCart();
  const navigate = useNavigate();

  // State management
  const [weeklySchedule, setWeeklySchedule] = useState(initialWeeklySchedule);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Derived values
  const isAllHarian = cart.items.every(
    (item) => item.Menu?.category?.toLowerCase() === "harian"
  );
  const subtotal = cart.items.reduce(
    (total, item) => total + (item.Menu?.price || 0) * item.quantity,
    0
  );

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDaySelection = (day, isChecked) => {
    setWeeklySchedule((prev) => {
      const newSchedule = {
        ...prev,
        [day]: {
          ...prev[day],
          selected: isChecked,
          // Set tanggal otomatis saat dicentang
          ...(isChecked && {
            date: getNextDateForDay(day).format("YYYY-MM-DD"),
            time: "07:00",
          }),
        },
      };
      return newSchedule;
    });
  };

  const handleDayDateChange = (day, date) => {
    setWeeklySchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], date },
    }));
  };

  const handleDayTimeChange = (day, time) => {
    setWeeklySchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], time },
    }));
  };

  const validateForm = () => {
    // Validasi dasar
    if (cart.items.length === 0) {
      setError(
        "Keranjang belanja Anda kosong. Silakan tambahkan item terlebih dahulu."
      );
      return false;
    }

    // Validasi field wajib
    if (!formData.wa_number || !formData.delivery_address) {
      setError("Harap isi nomor WhatsApp dan alamat pengantaran");
      return false;
    }

    // Validasi khusus tipe pesanan
    if (isAllHarian) {
      const selectedDays = Object.entries(weeklySchedule).filter(
        ([_, data]) => data.selected
      );

      if (selectedDays.length === 0) {
        setError("Pilih minimal satu hari dan isi tanggal serta jam.");
        return false;
      }

      for (const [day, data] of selectedDays) {
        if (!data.date || !data.time) {
          setError(`Harap isi tanggal dan waktu untuk hari ${day}`);
          return false;
        }

        if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data.time)) {
          setError(`Format waktu tidak valid untuk hari ${day}`);
          return false;
        }
      }
    } else if (!formData.delivery_date || !formData.delivery_time) {
      setError("Harap isi tanggal dan waktu pengantaran");
      return false;
    }

    return true;
  };

  const preparePayload = () => {
    const payload = {
      wa_number: formData.wa_number,
      delivery_address: formData.delivery_address,
      notes: formData.notes,
      items: cart.items.map((item) => ({
        menu_id: item.menu_id || item.Menu?.id,
        quantity: item.quantity,
      })),
    };

    if (isAllHarian) {
      payload.weekly_schedule = Object.entries(weeklySchedule)
        .filter(([_, data]) => data.selected)
        .map(([day, data]) => ({
          day,
          date: data.date,
          time: data.time,
          datetime: new Date(`${data.date}T${data.time}`).toISOString(),
        }));

      // Gunakan tanggal pertama sebagai delivery_date utama
      const firstDay = Object.values(weeklySchedule).find((d) => d.selected);
      if (firstDay) {
        payload.delivery_date = new Date(
          `${firstDay.date}T${firstDay.time}`
        ).toISOString();
      }
    } else {
      payload.delivery_date = new Date(
        `${formData.delivery_date}T${formData.delivery_time}`
      ).toISOString();
    }

    return payload;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const payload = preparePayload();

      console.log("Checkout payload:", payload);
      const order = await OrderService.checkout(payload);

      clearCart();
      navigate(`/orders/${order.id}/confirmation`);
    } catch (err) {
      console.error("Checkout error:", err);

      // Handle error response lebih baik
      const backendErrorMessage =
        err.response?.data?.message || err.response?.data?.error || err.message;

      setError(
        backendErrorMessage || "Gagal melakukan checkout. Silakan coba lagi."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOrderConfirmation = (e) => {
    if (isSubmitting || cart.items.length === 0) return;

    const isFormValid = validateForm();
    if (!isFormValid) {
      alert("Silakan lengkapi semua data yang wajib diisi sebelum memesan.");
      return;
    }

    const confirmed = window.confirm(
      "Apakah Anda yakin ingin melakukan pemesanan?\nPastikan data pesanan Anda sudah benar."
    );

    if (confirmed) {
      handleSubmit(e);
    }
  };

  if (isCartLoading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout Pesanan</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Delivery Information */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Informasi Pengiriman</h2>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error.includes("hari") ? (
                  <>
                    <p>{error}</p>
                    <ul className="list-disc pl-5 mt-2">
                      {Object.entries(weeklySchedule)
                        .filter(([_, data]) => data.selected)
                        .map(([day, data]) => (
                          <li key={day}>
                            {day}: {data.date || "Tanggal kosong"}{" "}
                            {data.time || "Waktu kosong"}
                          </li>
                        ))}
                    </ul>
                  </>
                ) : (
                  error
                )}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {isAllHarian ? (
                <DailyScheduleForm
                  weeklySchedule={weeklySchedule}
                  onDaySelection={handleDaySelection}
                  onDayDateChange={handleDayDateChange}
                  onDayTimeChange={handleDayTimeChange}
                />
              ) : (
                <SingleDateForm
                  formData={formData}
                  handleChange={handleChange}
                />
              )}

              <ContactForm formData={formData} handleChange={handleChange} />

              {cart.items.length === 0 && <EmptyCartWarning />}

              <button
                type="button"
                disabled={isSubmitting || cart.items.length === 0}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md disabled:opacity-50"
                onClick={handleOrderConfirmation}
              >
                {isSubmitting ? "Memproses..." : "Buat Pesanan"}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <OrderSummary items={cart.items} subtotal={subtotal} />
      </div>
    </div>
  );
};

// Sub-components for better organization
const DailyScheduleForm = ({
  weeklySchedule,
  onDaySelection,
  onDayDateChange,
  onDayTimeChange,
}) => {
  // Fungsi untuk validasi tanggal sesuai hari
  const validateDateForDay = (day, date) => {
    const dayIndex = [
      "minggu",
      "senin",
      "selasa",
      "rabu",
      "kamis",
      "jumat",
      "sabtu",
    ].indexOf(day.toLowerCase());
    const selectedDayIndex = new Date(date).getDay();
    return dayIndex === selectedDayIndex;
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 mb-2">
        Jadwal Pengantaran Harian <span className="text-red-500">*</span>
      </label>
      <div className="space-y-4">
        {Object.entries(weeklySchedule).map(([day, data]) => (
          <div key={day} className="flex flex-col space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={data.selected}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  onDaySelection(day, isChecked);

                  // Set tanggal otomatis saat dicentang
                  if (isChecked) {
                    const nextDate = getNextDateForDay(day);
                    onDayDateChange(day, nextDate.format("YYYY-MM-DD"));
                    onDayTimeChange(day, "07:00");
                  }
                }}
              />
              <span className="capitalize">{day}</span>
            </label>

            {data.selected && (
              <div className="flex flex-col space-y-2 ml-6 bg-gray-50 p-3 rounded-md">
                {/* Tampilkan nama hari dalam bahasa Indonesia */}
                <div className="text-sm font-medium">
                  Hari: {formatIndonesianDate(data.date).split(",")[0]}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Input Tanggal */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Pilih Tanggal
                    </label>
                    <input
                      type="date"
                      value={data.date}
                      onChange={(e) => {
                        if (!validateDateForDay(day, e.target.value)) {
                          alert(`Tanggal harus jatuh pada hari ${day}`);
                          return;
                        }
                        onDayDateChange(day, e.target.value);
                      }}
                      min={getNextDateForDay(day).format("YYYY-MM-DD")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  {/* Input Waktu */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Pilih Jam
                    </label>
                    <input
                      type="time"
                      value={data.time}
                      onChange={(e) => onDayTimeChange(day, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>

                {/* Tampilkan tanggal lengkap */}
                <div className="text-sm text-gray-600">
                  Akan dikirim pada: {formatIndonesianDate(data.date)} jam{" "}
                  {data.time}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const SingleDateForm = ({ formData, handleChange }) => {
  const [selectedDay, setSelectedDay] = useState("");

  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    // Update form data
    handleChange(e);

    // Update hari yang ditampilkan
    if (dateValue) {
      const dayName = dayjs(dateValue).format("dddd");
      setSelectedDay(dayName);
    } else {
      setSelectedDay("");
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 mb-2">
        Tanggal Pengantaran <span className="text-red-500">*</span>
      </label>

      <div className="flex flex-col space-y-2 ml-6 bg-gray-50 p-3 rounded-md">
        {/* Tampilan Hari */}
        <div className="flex items-center">
          <span className="text-sm text-gray-600 mr-2">Hari:</span>
          {selectedDay ? (
            <span className="font-medium capitalize">{selectedDay}</span>
          ) : (
            <span className="text-gray-400">
              Pilih tanggal untuk melihat hari
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* Input Tanggal */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Pilih Tanggal
            </label>
            <input
              type="date"
              name="delivery_date"
              value={formData.delivery_date}
              onChange={handleDateChange}
              min={dayjs().format("YYYY-MM-DD")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Input Waktu */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Pilih Jam
            </label>
            <input
              type="time"
              name="delivery_time"
              value={formData.delivery_time}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>

        {/* Tampilkan info lengkap */}
        {formData.delivery_date && formData.delivery_time && (
          <div className="text-sm text-gray-600 mt-2">
            Akan dikirim pada:{" "}
            <span className="font-medium">
              {dayjs(formData.delivery_date).format("dddd, D MMMM YYYY")} pukul{" "}
              {formData.delivery_time}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
const ContactForm = ({ formData, handleChange }) => (
  <>
    <div className="mb-4">
      <label className="block text-gray-700 mb-2" htmlFor="wa_number">
        Nomor WhatsApp <span className="text-red-500">*</span>
      </label>
      <input
        type="tel"
        id="wa_number"
        name="wa_number"
        value={formData.wa_number}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
        placeholder="Contoh: 081234567890"
        required
      />
    </div>

    <div className="mb-4">
      <label className="block text-gray-700 mb-2" htmlFor="delivery_address">
        Alamat Pengantaran <span className="text-red-500">*</span>
      </label>
      <textarea
        id="delivery_address"
        name="delivery_address"
        value={formData.delivery_address}
        onChange={handleChange}
        rows="3"
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
        required
      />
    </div>

    <div className="mb-6">
      <label className="block text-gray-700 mb-2" htmlFor="notes">
        Catatan Tambahan (Opsional)
      </label>
      <textarea
        id="notes"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        rows="2"
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
        placeholder="Contoh: Tanpa sambal, antar jam 10 pagi"
      />
    </div>
  </>
);

const EmptyCartWarning = () => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
    <p className="text-red-600">
      Keranjang belanja Anda kosong. Silakan tambahkan item terlebih dahulu.
    </p>
    <Link
      to="/menu"
      className="inline-block mt-2 text-blue-600 hover:underline"
    >
      Kembali ke Menu
    </Link>
  </div>
);

const OrderSummary = ({ items, subtotal }) => (
  <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
    <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>

    <div className="divide-y divide-gray-200">
      {items.map((item) => (
        <div key={item.id} className="py-3 flex justify-between">
          <div>
            <p>
              {item.Menu?.name} × {item.quantity}
            </p>
            <p className="text-sm text-gray-500">{item.Menu?.category}</p>
          </div>
          <p>Rp{(item.Menu?.price * item.quantity).toLocaleString()}</p>
        </div>
      ))}
    </div>

    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="flex justify-between font-medium mb-2">
        <span>Subtotal:</span>
        <span>Rp{subtotal.toLocaleString()}</span>
      </div>
      {/* <div className="flex justify-between font-medium mb-2">
        <span>Biaya Pengiriman:</span>
        <span>Gratis</span>
      </div> */}
      <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-200">
        <span>Total:</span>
        <span>Rp{subtotal.toLocaleString()}</span>
      </div>
    </div>
  </div>
);

export default CheckoutPage;
