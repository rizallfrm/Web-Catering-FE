import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import AuthService from "../services/authService";
import AuthLayout from "./AuthLayout";
import toast from "react-hot-toast";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user already authenticated
  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      const user = AuthService.getCurrentUser();
      navigate(user?.role === "admin" ? "/admin" : "/");
    }
  }, [navigate]);

  // Get success message from registration if any
  const registrationMessage = location.state?.message;

  const onSubmit = async (data) => {
    setError("");
    setIsLoading(true);
    const toastId = toast.loading("Sedang memproses...");

    try {
      console.log("Login attempt with:", {
        identifier: data.identifier,
        passwordLength: data.password?.length
      });

      const credentials = {
        identifier: data.identifier.trim(), // bisa email atau nama
        password: data.password,
      };

      const userData = await AuthService.login(credentials);
      console.log("Login successful, user data:", userData);

      toast.success("Login berhasil!", { id: toastId });

      const user = AuthService.getCurrentUser();

      // Redirect berdasarkan role
      setTimeout(() => {
        const redirectPath = user?.role === "admin" ? "/admin" : "/";
        navigate(redirectPath);
      }, 1000);

    } catch (err) {
      console.error("Login error:", err);
      
      // Set error message yang user-friendly
      let errorMessage = "Terjadi kesalahan. Silakan coba lagi.";
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 401) {
        errorMessage = "Email/nama atau password salah. Silakan coba lagi.";
      } else if (err.response?.status >= 500) {
        errorMessage = "Server sedang bermasalah. Silakan coba lagi nanti.";
      } else if (!err.response) {
        errorMessage = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
      }
      
      setError(errorMessage);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  // Debug function untuk development
  const handleDebug = () => {
    if (process.env.NODE_ENV === 'development') {
      AuthService.debugAuth();
      console.log("API Base URL:", import.meta.env.VITE_API_URL || 'Not set');
      console.log("Current URL:", window.location.href);
    }
  };

  return (
    <AuthLayout title="Masuk ke Akun Anda">
      {/* Success message from registration */}
      {registrationMessage && (
        <div className="mb-4 bg-green-100 text-green-700 p-3 rounded-md">
          {registrationMessage}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Identifier Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email atau Nama
          </label>
          <input
            type="text"
            placeholder="Masukkan email atau nama Anda"
            autoComplete="username"
            {...register("identifier", { 
              required: "Email atau Nama wajib diisi",
              minLength: {
                value: 2,
                message: "Email atau nama minimal 2 karakter"
              }
            })}
            className={`mt-1 block w-full rounded-md border ${
              errors.identifier ? "border-red-500" : "border-gray-300"
            } shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm p-2`}
          />
          {errors.identifier && (
            <p className="text-red-500 text-sm mt-1">
              {errors.identifier.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            placeholder="Masukkan password Anda"
            autoComplete="current-password"
            {...register("password", { 
              required: "Password wajib diisi",
              minLength: {
                value: 6,
                message: "Password minimal 6 karakter"
              }
            })}
            className={`mt-1 block w-full rounded-md border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm p-2`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Additional options */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
              Ingat saya
            </label>
          </div>

          <div className="text-sm">
            <Link
              to="/forgot-password"
              className="font-medium text-yellow-600 hover:text-yellow-500"
            >
              Lupa password?
            </Link>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isLoading 
              ? "bg-yellow-400 cursor-not-allowed" 
              : "bg-yellow-600 hover:bg-yellow-700"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`}
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
            "Masuk"
          )}
        </button>
      </form>

      <div className="mt-6">
        <p className="text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="font-medium text-yellow-600 hover:text-yellow-500"
          >
            Daftar Sekarang
          </Link>
        </p>
      </div>

      {/* Debug info untuk development */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="mt-4">
          <button
            type="button"
            onClick={handleDebug}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            🔍 Debug Auth Info
          </button>
          <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600">
            <p><strong>Environment:</strong> {import.meta.env.MODE}</p>
            <p><strong>API URL:</strong> {import.meta.env.VITE_API_URL || 'Default (localhost:3000)'}</p>
            <p><strong>Current Path:</strong> {window.location.pathname}</p>
          </div>
        </div>
      )} */}
    </AuthLayout>
  );
};

export default Login;