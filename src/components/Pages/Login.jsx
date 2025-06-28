import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

 const onSubmit = async (data) => {
  setError('');
  setIsLoading(true);

  // ⏳ Tampilkan loading toast dengan progress
  const toastId = toast.loading('Sedang memproses...');

  try {
    await AuthService.login(data);

    // ✅ Ganti toast jadi sukses
    toast.success('Login berhasil!', { id: toastId });

    const user = AuthService.getCurrentUser();

    // ⏱️ Tunggu sedikit agar user lihat toast, baru redirect
    setTimeout(() => {
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }, 1000); // 1 detik

  } catch (err) {
    console.error('Login error:', err);
    setError('Email atau password salah. Silakan coba lagi.');

    // ❌ Ganti toast jadi error
    toast.error('Login gagal. Silakan coba lagi.', { id: toastId });

  } finally {
    setIsLoading(false);
  }
};
  return (
    <AuthLayout title="Masuk ke Akun Anda">
      {error && (
        <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email", { required: "Email wajib diisi." })}
            className={`mt-1 block w-full rounded-md border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm p-2`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            {...register("password", { required: "Password wajib diisi." })}
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

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isLoading ? "bg-yellow-400" : "bg-yellow-600 hover:bg-yellow-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`}
          >
            {isLoading ? "Memproses..." : "Masuk"}
          </button>
        </div>
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
    </AuthLayout>
  );
};

export default Login;
