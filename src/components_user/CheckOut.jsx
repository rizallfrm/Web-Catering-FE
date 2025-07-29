import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import OrderService from "../components/services/orderService";
import LoadingSpinner from "./LoadingSpinner";
import SmartAddressInput from "../components/Address/SmartAddressInput";
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
  delivery_fee: 0,
};

const CheckoutPage = () => {
  const { cart, isLoading: isCartLoading, clearCart } = useCart();
  const navigate = useNavigate();

  // State management
  const [weeklySchedule, setWeeklySchedule] = useState(initialWeeklySchedule);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [isAddressValid, setIsAddressValid] = useState(true); // New state for address validation

  // Derived values
  const isAllHarian = cart.items.every(
    (item) => item.Menu?.category?.toLowerCase() === "harian"
  );
  const subtotal = cart.items.reduce(
    (total, item) => total + (item.Menu?.price || 0) * item.quantity,
    0
  );
  const totalWithDelivery = subtotal + (formData.delivery_fee || 0);

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeliveryFeeChange = (fee, info) => {
    setFormData((prev) => ({ ...prev, delivery_fee: fee }));
    setDeliveryInfo(info);
  };

  const handleAddressChange = (address) => {
    setFormData((prev) => ({ ...prev, delivery_address: address }));
  };

  // New handler for address validation
  const handleAddressValidationChange = (isValid) => {
    setIsAddressValid(isValid);
    if (!isValid) {
      setError(
        "Area yang dipilih berada di luar jangkauan layanan kami. Silakan pilih area lain yang tersedia."
      );
    } else if (error && error.includes("jangkauan")) {
      setError(null); // Clear out of range error when address becomes valid
    }
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

    // Validasi area delivery (NEW)
    if (!isAddressValid) {
      setError(
        "Area pengiriman tidak valid atau berada di luar jangkauan layanan. Silakan pilih area yang tersedia."
      );
      return false;
    }

    // Validasi delivery fee
    if (formData.delivery_fee === undefined || formData.delivery_fee < 0) {
      setError(
        "Biaya pengiriman belum terdeteksi. Silakan periksa alamat Anda."
      );
      return false;
    }

    // Validasi khusus untuk area di luar jangkauan
    if (deliveryInfo?.is_out_of_range || deliveryInfo?.blocked) {
      setError(
        "Pesanan tidak dapat diproses karena area berada di luar jangkauan layanan kami."
      );
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
      delivery_fee: formData.delivery_fee,
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

    // Enhanced confirmation with out of range check
    if (!isAddressValid || deliveryInfo?.is_out_of_range) {
      alert(
        "Pesanan tidak dapat diproses karena alamat berada di luar jangkauan layanan kami. Silakan pilih alamat yang tersedia."
      );
      return;
    }

    // Show confirmation dengan breakdown harga
    const confirmMessage = `
Konfirmasi Pesanan:

Subtotal Menu: Rp${subtotal.toLocaleString()}
Biaya Pengiriman: ${
      formData.delivery_fee === 0
        ? "GRATIS"
        : `Rp${formData.delivery_fee.toLocaleString()}`
    }
${deliveryInfo ? `Area: ${deliveryInfo.area_name || "Terdeteksi"}` : ""}
Total: Rp${totalWithDelivery.toLocaleString()}

Apakah Anda yakin ingin melakukan pemesanan?
    `.trim();

    const confirmed = window.confirm(confirmMessage);

    if (confirmed) {
      handleSubmit(e);
    }
  };

  // Calculate if checkout should be disabled
  const isCheckoutDisabled =
    isSubmitting ||
    cart.items.length === 0 ||
    !isAddressValid ||
    deliveryInfo?.is_out_of_range ||
    deliveryInfo?.blocked;

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
              {/* Smart Address Input - With validation callback */}
              <div className="mb-6">
                <SmartAddressInput
                  onDeliveryFeeChange={handleDeliveryFeeChange}
                  onAddressChange={handleAddressChange}
                  // onValidationChange={handleAddressValidationChange}
                  initialAddress={formData.delivery_address}
                  initialFee={formData.delivery_fee}
                />
              </div>

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

              {/* Enhanced Order Button with Better Disabled State */}
              <div className="space-y-3">
                {/* Out of Range Warning */}
                {(!isAddressValid || deliveryInfo?.is_out_of_range) && (
                  <div className="bg-red-50 border border-red-500 rounded-md p-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-red-500 text-xl">🚫</span>
                      <div>
                        <p className="font-medium text-red-800">
                          Pesanan Tidak Dapat Diproses
                        </p>
                        <p className="text-sm text-red-700">
                          Area pengiriman berada di luar jangkauan layanan kami.
                          Silakan pilih area yang tersedia untuk melanjutkan
                          pemesanan.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  disabled={isCheckoutDisabled}
                  className={`w-full py-3 rounded-md font-medium transition-colors ${
                    isCheckoutDisabled
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                  }`}
                  onClick={handleOrderConfirmation}
                  title={
                    isCheckoutDisabled
                      ? "Silakan lengkapi informasi pengiriman yang valid"
                      : "Lanjutkan ke pemesanan"
                  }
                >
                  {isSubmitting
                    ? "Memproses..."
                    : !isAddressValid || deliveryInfo?.is_out_of_range
                    ? "Area Tidak Tersedia"
                    : "Buat Pesanan"}
                </button>

                {/* Helper text for disabled state */}
                {isCheckoutDisabled &&
                  !isSubmitting &&
                  cart.items.length > 0 && (
                    <p className="text-sm text-gray-500 text-center">
                      {!isAddressValid || deliveryInfo?.is_out_of_range
                        ? "Pilih area pengiriman yang tersedia untuk melanjutkan"
                        : "Lengkapi semua informasi yang diperlukan"}
                    </p>
                  )}
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <OrderSummary
          items={cart.items}
          subtotal={subtotal}
          deliveryFee={formData.delivery_fee}
          deliveryInfo={deliveryInfo}
          total={totalWithDelivery}
          isAddressValid={isAddressValid}
        />
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
  const now = dayjs();
  const currentHour = now.hour();
  const currentMinute = now.minute();

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

  const isTimeDisabled = (day, time) => {
    const selectedDate = weeklySchedule[day]?.date;
    if (!selectedDate) return false;

    const isToday = dayjs(selectedDate).isSame(now, "day");
    if (!isToday) return false;

    const [hours, minutes] = time.split(":").map(Number);
    return (
      hours < currentHour || (hours === currentHour && minutes <= currentMinute)
    );
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 mb-2">
        Jadwal Pengantaran Harian <span className="text-red-500">*</span>
      </label>
      <div className="space-y-4">
        {Object.entries(weeklySchedule).map(([day, data]) => {
          const nextDate = getNextDateForDay(day);
          const isToday = nextDate.isSame(now, "day");

          return (
            <div key={day} className="flex flex-col space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={data.selected}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    onDaySelection(day, isChecked);

                    if (isChecked) {
                      onDayDateChange(day, nextDate.format("YYYY-MM-DD"));
                      // Set waktu default ke jam berikutnya jika hari ini
                      const defaultTime = isToday
                        ? `${currentHour + 1}:${currentMinute
                            .toString()
                            .padStart(2, "0")}`
                        : "07:00";
                      onDayTimeChange(day, defaultTime);
                    }
                  }}
                />
                <span className="capitalize">{day}</span>
              </label>

              {data.selected && (
                <div className="flex flex-col space-y-2 ml-6 bg-gray-50 p-3 rounded-md">
                  <div className="text-sm font-medium">
                    Hari: {formatIndonesianDate(data.date).split(",")[0]}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
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
                        min={nextDate.format("YYYY-MM-DD")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Pilih Jam
                      </label>
                      <input
                        type="time"
                        value={data.time}
                        onChange={(e) => onDayTimeChange(day, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        min={
                          isToday
                            ? `${currentHour + 1}:${currentMinute
                                .toString()
                                .padStart(2, "0")}`
                            : undefined
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    Akan dikirim pada: {formatIndonesianDate(data.date)} jam{" "}
                    {data.time}
                    {isTimeDisabled(day, data.time) && (
                      <span className="text-red-500 ml-2">
                        (Waktu sudah lewat, harap pilih waktu lain)
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SingleDateForm = ({ formData, handleChange }) => {
  const [selectedDay, setSelectedDay] = useState("");
  const now = dayjs();
  const minOrderDate = now.add(3, "day").format("YYYY-MM-DD"); // Minimal H+2 dari hari ini

  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    handleChange(e);

    if (dateValue) {
      const dayName = dayjs(dateValue).format("dddd");
      setSelectedDay(dayName);
    } else {
      setSelectedDay("");
    }
  };

  const isDateValid = formData.delivery_date
    ? dayjs(formData.delivery_date).isAfter(now.add(1, "day"))
    : false;

  return (
    <div className="mb-4">
      <label className="block text-gray-700 mb-2">
        Tanggal Pengantaran <span className="text-red-500">*</span>
      </label>

      {/* Notifikasi minimal pemesanan H-2 */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Pemesanan minimal H-3 hari dari tanggal pengiriman.
              <br />
              <span className="font-medium">
                Hari ini {now.format("dddd, D MMMM YYYY")}, pesanan paling cepat
                dikirim {dayjs(minOrderDate).format("dddd, D MMMM YYYY")}.
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-2 ml-6 bg-gray-50 p-3 rounded-md">
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
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Pilih Tanggal
            </label>
            <input
              type="date"
              name="delivery_date"
              value={formData.delivery_date}
              onChange={handleDateChange}
              min={minOrderDate}
              className={`w-full px-3 py-2 border rounded-md ${
                formData.delivery_date && !isDateValid
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
              required
            />
            {formData.delivery_date && !isDateValid && (
              <p className="mt-1 text-sm text-red-600">
                Tanggal pengiriman minimal H-2 hari dari hari ini.
              </p>
            )}
          </div>

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
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Contoh: 081234567890"
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
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Contoh: Rumah warna biru"
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

const OrderSummary = ({
  items,
  subtotal,
  deliveryFee = 0,
  deliveryInfo,
  total,
  isAddressValid,
}) => (
  <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
    <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>

    <div className="divide-y divide-gray-200">
      {items.map((item) => (
        <div key={item.id} className="py-3 flex justify-between">
          <div>
            <p className="font-medium">
              {item.Menu?.name} × {item.quantity}
            </p>
            <p className="text-sm text-gray-500">{item.Menu?.category}</p>
          </div>
          <p className="font-medium">
            Rp{(item.Menu?.price * item.quantity).toLocaleString()}
          </p>
        </div>
      ))}
    </div>

    <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
      <div className="flex justify-between">
        <span>Subtotal Menu:</span>
        <span>Rp{subtotal.toLocaleString()}</span>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <span>Biaya Pengiriman:</span>
          {deliveryInfo && (
            <div className="text-xs text-gray-500">
              {deliveryInfo.area_name || "Area terdeteksi"}
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="font-medium">
            {deliveryInfo?.is_out_of_range ? (
              <span className="text-red-600 font-bold">TIDAK TERSEDIA</span>
            ) : deliveryFee === 0 ? (
              <span className="text-green-600 font-bold">GRATIS</span>
            ) : (
              `Rp${deliveryFee.toLocaleString()}`
            )}
          </div>
          {deliveryInfo?.requires_confirmation &&
            !deliveryInfo?.is_out_of_range && (
              <div className="text-xs text-orange-600">*Akan dikonfirmasi</div>
            )}
        </div>
      </div>

      {/* Enhanced warning for out of range */}
      {(!isAddressValid || deliveryInfo?.is_out_of_range) && (
        <div className="bg-red-50 border border-red-200 rounded p-2">
          <p className="text-xs text-red-700">
            🚫 Area di luar jangkauan layanan - pesanan tidak dapat diproses
          </p>
        </div>
      )}

      {/* {deliveryInfo?.confidence && deliveryInfo.confidence !== 'high' && !deliveryInfo?.is_out_of_range && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
          <p className="text-xs text-yellow-700">
            ⚠️ Area pengiriman akan dikonfirmasi admin sebelum pemrosesan
          </p>
        </div>
      )} */}
    </div>

    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="flex justify-between font-bold text-lg">
        <span>Total Pembayaran:</span>
        <span
          className={`${
            deliveryInfo?.is_out_of_range ? "text-red-600" : "text-orange-600"
          }`}
        >
          {deliveryInfo?.is_out_of_range
            ? "TIDAK DAPAT DIPROSES"
            : `Rp${total.toLocaleString()}`}
        </span>
      </div>
    </div>

    {/* Delivery Info Summary */}
    {deliveryInfo && (
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h3 className="font-medium text-gray-800 mb-2">Info Pengiriman</h3>
        <div className="space-y-1 text-sm text-gray-600">
          <p className={deliveryInfo.is_out_of_range ? "text-red-600" : ""}>
            📍 {deliveryInfo.area_name}
            {deliveryInfo.is_out_of_range && " (Di Luar Jangkauan)"}
          </p>
          {deliveryInfo.distance_estimate && !deliveryInfo.is_out_of_range && (
            <p>📏 Jarak: {deliveryInfo.distance_estimate}</p>
          )}
          {!deliveryInfo.is_out_of_range && (
            <p>
              🎯 Akurasi:{" "}
              <span className="capitalize">{deliveryInfo.confidence}</span>
            </p>
          )}
        </div>
      </div>
    )}

    {/* Service Coverage Info */}
    <div className="mt-4 pt-4 border-t border-gray-200">
      <h3 className="font-medium text-gray-800 mb-2">Jangkauan Layanan</h3>
      <div className="text-sm text-gray-600 space-y-1">
        <p>✅ Banjarnegara, Purbalingga, Wonosobo</p>
        <p>✅ Kebumen (utara), Banyumas (utara)</p>
        <p>✅ Purwokerto & sekitarnya</p>
        <p className="text-red-600 text-xs mt-2">
          🚫 Tidak melayani: Jakarta, Bandung, Semarang, Yogyakarta, Solo, dan
          kota besar lainnya
        </p>
      </div>
    </div>

    {/* Payment Methods Info */}
    {/* <div className="mt-4 pt-4 border-t border-gray-200">
      <h3 className="font-medium text-gray-800 mb-2">Metode Pembayaran</h3>
      <div className="text-sm text-gray-600 space-y-1">
        <p>💳 Transfer Bank</p>
        <p>📱 E-Wallet (DANA, OVO, GoPay)</p>
        <p className="text-xs text-gray-500">
          *Detail pembayaran akan diberikan setelah konfirmasi pesanan
        </p>
      </div>
    </div> */}

    {/* Order Process Flow
    <div className="mt-4 pt-4 border-t border-gray-200">
      <h3 className="font-medium text-gray-800 mb-2">Alur Pesanan</h3>
      <div className="text-sm text-gray-600 space-y-1">
        <div className="flex items-center space-x-2">
          <span className="w-4 h-4 bg-blue-500 rounded-full flex-shrink-0"></span>
          <span>Buat Pesanan</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-4 h-4 bg-gray-300 rounded-full flex-shrink-0"></span>
          <span>Konfirmasi Admin</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-4 h-4 bg-gray-300 rounded-full flex-shrink-0"></span>
          <span>Upload Bukti Bayar</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-4 h-4 bg-gray-300 rounded-full flex-shrink-0"></span>
          <span>Verifikasi Pembayaran</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-4 h-4 bg-gray-300 rounded-full flex-shrink-0"></span>
          <span>Pesanan Diproses</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-4 h-4 bg-gray-300 rounded-full flex-shrink-0"></span>
          <span>Pengiriman</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-4 h-4 bg-gray-300 rounded-full flex-shrink-0"></span>
          <span>Selesai</span>
        </div>
      </div>
    </div> */}

    {/* Terms and Conditions */}
    <div className="mt-4 pt-4 border-t border-gray-200">
      <h3 className="font-medium text-gray-800 mb-2">Syarat & Ketentuan</h3>
      <div className="text-xs text-gray-600 space-y-1">
        <p>• Pesanan minimal H-2 hari sebelum pengiriman</p>
        <p>• Pembayaran maksimal 24 jam setelah konfirmasi</p>
        <p>• Pesanan yang tidak dibayar akan dibatalkan otomatis</p>
        {/* <p>• Harga dapat berubah sewaktu-waktu tanpa pemberitahuan</p>
        <p>• Komplain maksimal 2 jam setelah pesanan diterima</p>
        <p className="text-red-600 font-medium">• Layanan terbatas untuk Jawa Tengah Selatan</p> */}
      </div>
    </div>

    {/* Contact Info
    <div className="mt-4 pt-4 border-t border-gray-200 bg-gray-50 rounded-md p-3">
      <h3 className="font-medium text-gray-800 mb-2">Butuh Bantuan?</h3>
      <div className="text-sm text-gray-600 space-y-1">
        <p>📞 WhatsApp: 081234567890</p>
        <p>📧 Email: info@umkmbanjarnegara.com</p>
        <p>🕒 Layanan: 07:00 - 21:00 WIB</p>
      </div>
    </div> */}
  </div>
);

export default CheckoutPage;
