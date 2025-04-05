import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import AuthService from "../services/authService";  // Import AuthService

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const navigate = useNavigate();

  // Watch password field for confirmation validation
  const password = watch("password", "");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setRegisterError("");

    try {
      // Prepare user data for registration
      const userData = {
        firstName: data.firstName,
        lastName: data.lastName || "",
        email: data.email,
        phone: data.phone,
        password: data.password,
      };

      // Use AuthService for registration
      const response = await AuthService.register(userData);
      
      // Redirect to login page with success message
      navigate("/login", {
        state: {
          message: "Pendaftaran berhasil! Silakan login dengan akun Anda.",
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      
      // Handle specific API error messages if available
      if (error.response && error.response.data && error.response.data.message) {
        setRegisterError(error.response.data.message);
      } else {
        setRegisterError("Terjadi kesalahan saat pendaftaran. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Daftar Akun Baru
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Atau{" "}
            <Link
              to="/login"
              className="font-medium text-yellow-600 hover:text-yellow-500"
            >
              masuk ke akun yang sudah ada
            </Link>
          </p>
        </div>

        {registerError && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-sm text-red-700">{registerError}</p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                Nama Depan
              </label>
              <div className="mt-1">
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.firstName ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500`}
                  {...register("firstName", {
                    required: "Nama depan wajib diisi",
                  })}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Nama Belakang
              </label>
              <div className="mt-1">
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.lastName ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500`}
                  {...register("lastName")}
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="mt-1">
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`appearance-none block w-full px-3 py-2 border ${
                  errors.email ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500`}
                {...register("email", {
                  required: "Email wajib diisi",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Format email tidak valid",
                  },
                })}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Nomor Telepon
            </label>
            <div className="mt-1">
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                className={`appearance-none block w-full px-3 py-2 border ${
                  errors.phone ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500`}
                {...register("phone", {
                  required: "Nomor telepon wajib diisi",
                  pattern: {
                    value: /^[0-9+\-\s()]*$/,
                    message: "Format nomor telepon tidak valid",
                  },
                })}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                className={`appearance-none block w-full px-3 py-2 border ${
                  errors.password ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500`}
                {...register("password", {
                  required: "Password wajib diisi",
                  minLength: {
                    value: 6,
                    message: "Password minimal 6 karakter",
                  },
                })}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="passwordConfirm"
              className="block text-sm font-medium text-gray-700"
            >
              Konfirmasi Password
            </label>
            <div className="mt-1">
              <input
                id="passwordConfirm"
                type="password"
                autoComplete="new-password"
                className={`appearance-none block w-full px-3 py-2 border ${
                  errors.passwordConfirm ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500`}
                {...register("passwordConfirm", {
                  required: "Konfirmasi password wajib diisi",
                  validate: (value) =>
                    value === password || "Password tidak cocok",
                })}
              />
              {errors.passwordConfirm && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.passwordConfirm.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
              {...register("terms", {
                required: "Anda harus menyetujui syarat dan ketentuan",
              })}
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              Saya menyetujui{" "}
              <Link
                to="/terms"
                className="text-yellow-600 hover:text-yellow-500"
              >
                syarat dan ketentuan
              </Link>
            </label>
          </div>
          {errors.terms && (
            <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${
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
      </div>
    </div>
  );
};

export default Register;