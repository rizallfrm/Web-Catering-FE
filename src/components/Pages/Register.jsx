import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import AuthService from "../services/authService";
import AuthLayout from "./AuthLayout";
import toast from "react-hot-toast";

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
      await AuthService.register(userData);
      toast.success("Pendaftaran berhasil! Silahkan login");
      setTimeout(() => {
        navigate("/login", {
          state: {
            message: "Pendaftaran berhasil! Silakan login dengan akun Anda.",
          },
        });
      }, 3000);

      // Redirect to login page with success message
    } catch (error) {
      console.error("Registration error:", error);

      // Handle specific API error messages if available
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setRegisterError(error.response.data.message);
      } else {
        setRegisterError(
          "Terjadi kesalahan saat pendaftaran. Silakan coba lagi."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Daftar Akun Baru">
      {registerError && (
        <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-md">
          {registerError}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              Nama Depan
            </label>
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              className={`mt-1 block w-full rounded-md shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm p-2 border ${
                errors.firstName ? "border-red-300" : "border-gray-300"
              }`}
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

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Nama Belakang
            </label>
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm p-2 border"
              {...register("lastName")}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm p-2 border ${
              errors.email ? "border-red-300" : "border-gray-300"
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
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Nomor Telepon
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm p-2 border ${
              errors.phone ? "border-red-300" : "border-gray-300"
            }`}
            {...register("phone", {
              required: "Nomor telepon wajib diisi",
              pattern: {
                value: /^[0-9+\-\s()]*$/,
                message: "Format nomor telepon tidak valid",
              },
            })}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm p-2 border ${
              errors.password ? "border-red-300" : "border-gray-300"
            }`}
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

        <div>
          <label
            htmlFor="passwordConfirm"
            className="block text-sm font-medium text-gray-700"
          >
            Konfirmasi Password
          </label>
          <input
            id="passwordConfirm"
            type="password"
            autoComplete="new-password"
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm p-2 border ${
              errors.passwordConfirm ? "border-red-300" : "border-gray-300"
            }`}
            {...register("passwordConfirm", {
              required: "Konfirmasi password wajib diisi",
              validate: (value) => value === password || "Password tidak cocok",
            })}
          />
          {errors.passwordConfirm && (
            <p className="mt-1 text-sm text-red-600">
              {errors.passwordConfirm.message}
            </p>
          )}
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
            Saya menyetujui syarat dan ketentuan
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

      <div className="mt-6">
        <p className="text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="font-medium text-yellow-600 hover:text-yellow-500"
          >
            Masuk
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
