import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/authService";
import AuthLayout from "./AuthLayout";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const navigate = useNavigate();

  // Watch password field for confirmation validation
  const password = watch("password", "");

  // Validasi nama yang ditingkatkan - huruf, spasi, apostrof, tanda hubung, underscore, dan angka di akhir
  const validateName = (value) => {
    if (!value || value.trim() === "") {
      return "Nama wajib diisi";
    }
    
    const trimmedValue = value.trim();
    
    // Cek apakah hanya berisi angka
    if (/^\d+$/.test(trimmedValue)) {
      return "Nama tidak boleh hanya berisi angka";
    }
    
    // Cek karakter yang tidak diizinkan dengan pesan yang lebih spesifik
    if (/[;:]/.test(trimmedValue)) {
      return "Nama tidak boleh mengandung tanda titik koma (;) atau titik dua (:)";
    }
    
    if (/[!@#$%^&*()+=\[\]{}|\\<>?/~`]/.test(trimmedValue)) {
      return "Nama tidak boleh mengandung karakter khusus seperti ! @ # $ % ^ & * ( ) + = [ ] { } | \\ < > ? / ~ `";
    }
    
    // Cek format nama yang valid - hanya huruf, spasi, apostrof, tanda hubung, underscore, dan angka di akhir
    if (!/^[a-zA-Z][a-zA-Z\s'_-]*[a-zA-Z0-9]?$/.test(trimmedValue)) {
      return "Nama harus diawali huruf, boleh mengandung spasi, apostrof ('), tanda hubung (-), underscore (_), dan angka di akhir";
    }
    
    // Cek panjang minimum
    if (trimmedValue.length < 2) {
      return "Nama minimal 2 karakter";
    }
    
    // Cek panjang maksimum
    if (trimmedValue.length > 50) {
      return "Nama maksimal 50 karakter";
    }
    
    // Cek apakah ada karakter berulang yang tidak wajar
    const nameWithoutEndNumbers = trimmedValue.replace(/\d+$/, '');
    if (/(.)\1{2,}/.test(nameWithoutEndNumbers.replace(/[\s'_-]/g, ""))) {
      return "Nama tidak boleh memiliki karakter yang berulang lebih dari 2 kali secara berturut-turut";
    }
    
    // Pastikan nama mengandung minimal satu huruf
    if (!/[a-zA-Z]/.test(trimmedValue)) {
      return "Nama harus mengandung minimal satu huruf";
    }
    
    // Cek apakah ada spasi berlebihan
    if (/\s{2,}/.test(trimmedValue)) {
      return "Nama tidak boleh memiliki spasi berlebihan";
    }
    
    // // Cek apakah nama diawali atau diakhiri dengan karakter khusus
    // if (/^[\s'_-]|[\s'_-]$/.test(trimmedValue)) {
    //   return "Nama tidak boleh diawali atau diakhiri dengan spasi, apostrof, underscore, atau tanda hubung";
    // }
    
    // Validasi Title Case - setiap kata harus diawali huruf kapital
    // const words = trimmedValue.split(/[\s'_-]+/);
    // for (let word of words) {
    //   if (word.length > 0) {
    //     const letterPart = word.replace(/\d+$/, '');
    //     if (letterPart.length > 0 && !/^[A-Z]/.test(letterPart)) {
    //       return "Setiap kata dalam nama harus diawali huruf kapital (contoh: Jali-Firman2, Jali_Firman, Jali'Firman)";
    //     }
    //   }
    // }
    
    // Cek pola karakter khusus yang berurutan
    if (/['_-]{2,}/.test(trimmedValue)) {
      return "Karakter khusus (apostrof, underscore, tanda hubung) tidak boleh berurutan";
    }
    
    return true;
  };

  // Function untuk auto-format nama ke Title Case yang ditingkatkan
  const formatToTitleCase = (name) => {
    if (!name) return name;
    
    return name.trim()
      .split(/(\s+|'+|_+|-+)/)
      .map(part => {
        // Jika bagian ini adalah separator (spasi, apostrof, dll), return as-is
        if (/^[\s'_-]+$/.test(part)) return part;
        
        // Jika bagian ini adalah kata
        if (part.length > 0) {
          // Handle angka di akhir
          const match = part.match(/^([a-zA-Z]+)(\d*)$/);
          if (match) {
            const letters = match[1];
            const numbers = match[2];
            return letters.charAt(0).toUpperCase() + letters.slice(1).toLowerCase() + numbers;
          }
          // Jika tidak ada angka, format biasa
          return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        }
        return part;
      })
      .join('');
  };

  // Handle auto-format saat user selesai mengetik
  const handleNameBlur = (fieldName, value) => {
    if (value && value.trim()) {
      const formatted = formatToTitleCase(value.trim());
      setValue(fieldName, formatted);
      trigger(fieldName); // Re-validate after formatting
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setRegisterError("");

    try {
      console.log("=== FRONTEND REGISTRATION ===");
      console.log("Form data before processing:", data);

      // Pastikan nama sudah dalam format yang benar
      const formattedFirstName = formatToTitleCase(data.firstName.trim());
      const formattedLastName = data.lastName ? formatToTitleCase(data.lastName.trim()) : "";

      console.log("Formatted names:", { formattedFirstName, formattedLastName });

      // Prepare user data for registration
      const userData = {
        firstName: formattedFirstName,
        lastName: formattedLastName,
        email: data.email.trim().toLowerCase(),
        phone: data.phone ? data.phone.trim() : "",
        address: data.address.trim(),
        password: data.password,
      };

      console.log("Sending to backend:", { ...userData, password: "[HIDDEN]" });

      // Use AuthService for registration
      await AuthService.register(userData);
      
      toast.success("Pendaftaran berhasil! Silahkan login");
      setTimeout(() => {
        navigate("/login", {
          state: {
            message: "Pendaftaran berhasil! Silakan login dengan akun Anda.",
          },
        });
      }, 2000);

    } catch (error) {
      console.error("Registration error:", error);

      // Handle specific API error messages
      if (error.response && error.response.data && error.response.data.message) {
        setRegisterError(error.response.data.message);
      } else if (error.message) {
        setRegisterError(error.message);
      } else {
        setRegisterError("Terjadi kesalahan saat pendaftaran. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Daftar Akun Baru">
      {registerError && (
        <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-md border border-red-300">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {registerError}
          </div>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Nama Depan */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            Nama Depan <span className="text-red-500">*</span>
          </label>
          <input
            id="firstName"
            type="text"
            autoComplete="given-name"
            // placeholder="Contoh: Rizal, Rizal-Firman, Rizal_Firman2"
            onBlur={(e) => handleNameBlur("firstName", e.target.value)}
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm p-3 border ${
              errors.firstName ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
            {...register("firstName", {
              validate: validateName
            })}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.firstName.message}
            </p>
          )}
        </div>

        {/* Nama Belakang */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Nama Belakang (Opsional)
          </label>
          <input
            id="lastName"
            type="text"
            autoComplete="family-name"
            // placeholder="Contoh: Firman, Mary-Jane, O'Brien2"
            onBlur={(e) => handleNameBlur("lastName", e.target.value)}
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm p-3 border ${
              errors.lastName ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
            {...register("lastName", {
              validate: (value) => {
                if (!value || value.trim() === "") return true;
                return validateName(value);
              }
            })}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.lastName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="rizal@gmail.com"
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm p-3 border ${
              errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
            {...register("email", {
              required: "Email wajib diisi",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Format email tidak valid",
              },
            })}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Alamat */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Alamat <span className="text-red-500">*</span>
          </label>
          <textarea
            id="address"
            rows="3"
            autoComplete="address"
            placeholder="Jl. Contoh No. 123, Kelurahan, Kecamatan, Kota"
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm p-3 border resize-none ${
              errors.address ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
            {...register("address", {
              required: "Alamat wajib diisi",
              minLength: {
                value: 10,
                message: "Alamat minimal 10 karakter"
              },
              maxLength: {
                value: 255,
                message: "Alamat maksimal 255 karakter"
              }
            })}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.address.message}
            </p>
          )}
        </div>

        {/* Nomor Telepon */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Nomor Telepon
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            // placeholder="08123456789 atau +62812345678"
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm p-3 border ${
              errors.phone ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
            {...register("phone", {
              validate: {
                format: (value) => {
                  if (!value || value.trim() === "") return true;
                  
                  if (!/^[0-9+\-\s()]*$/.test(value)) {
                    return "Format nomor telepon tidak valid";
                  }
                  
                  const digitsOnly = value.replace(/[^0-9]/g, "");
                  if (digitsOnly.length < 10 || digitsOnly.length > 13) {
                    return "Nomor telepon harus antara 10-13 digit";
                  }
                  
                  if (!/^(\+62|0)/.test(value.trim())) {
                    return "Nomor harus diawali dengan +62 atau 0";
                  }
                  
                  return true;
                }
              },
            })}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            // placeholder="Minimal 6 karakter dengan huruf dan angka"
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm p-3 border ${
              errors.password ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
            {...register("password", {
              required: "Password wajib diisi",
              minLength: {
                value: 6,
                message: "Password minimal 6 karakter",
              },
              pattern: {
                value: /^(?=.*[a-zA-Z])(?=.*\d)/,
                message: "Password harus mengandung minimal 1 huruf dan 1 angka"
              }
            })}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Konfirmasi Password */}
        <div>
          <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700">
            Konfirmasi Password <span className="text-red-500">*</span>
          </label>
          <input
            id="passwordConfirm"
            type="password"
            autoComplete="new-password"
            // placeholder="Ulangi password Anda"
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm p-3 border ${
              errors.passwordConfirm ? "border-red-300 bg-red-50" : "border-gray-300"
            }`}
            {...register("passwordConfirm", {
              required: "Konfirmasi password wajib diisi",
              validate: (value) => value === password || "Password tidak cocok",
            })}
          />
          {errors.passwordConfirm && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.passwordConfirm.message}
            </p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start">
          <input
            id="terms"
            type="checkbox"
            className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded mt-1"
            {...register("terms", {
              required: "Anda harus menyetujui syarat dan ketentuan",
            })}
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
            Saya menyetujui{" "}
            <span className="text-yellow-600 hover:text-yellow-500 cursor-pointer">
              syarat dan ketentuan
            </span>
          </label>
        </div>
        {errors.terms && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.terms.message}
          </p>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition duration-200 ${
              isLoading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Memproses...
              </>
            ) : (
              "Daftar"
            )}
          </button>
        </div>
      </form>

      {/* Login Link */}
      <div className="mt-6">
        <p className="text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="font-medium text-yellow-600 hover:text-yellow-500 transition duration-200"
          >
            Masuk
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;