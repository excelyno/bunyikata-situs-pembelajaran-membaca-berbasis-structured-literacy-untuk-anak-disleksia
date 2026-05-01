"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      // Logic lempar halaman berdasarkan role
      if (data.role === "WALI") {
        router.push("/dashboard/wali");
      } else if (data.role === "SISWA") {
        router.push("/dashboard/siswa");
      }
    } else {
      setError(data.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4 font-sans relative overflow-hidden">
      
      <div className="bg-white p-8 sm:p-10 rounded-[40px] shadow-sm border border-gray-100 w-full max-w-md relative z-10 animate-in zoom-in duration-300">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-blue-600 mb-2">BunyiKata</h1>
          <p className="text-gray-500 font-medium">Masuk untuk mulai bermain dan belajar!</p>
        </div>

        {/* Notifikasi Error */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold mb-6 border border-red-100 flex items-center gap-2">
             {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Username</label>
            <input 
              required 
              type="text" 
              placeholder="Masukkan username kamu..." 
              className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:outline-none bg-gray-50 focus:bg-white transition-colors text-lg"
              onChange={e => setFormData({...formData, username: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Password</label>
            <input 
              required 
              type="password" 
              placeholder="Masukkan sandi rahasia..." 
              className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:outline-none bg-gray-50 focus:bg-white transition-colors text-lg"
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white p-4 rounded-2xl font-black text-xl hover:bg-blue-700 transition-all shadow-[0_6px_0_#1d4ed8] active:translate-y-2 active:shadow-none mt-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {loading ? "Mengecek..." : "Masuk "}
          </button>
        </form>

        <p className="mt-8 text-center text-gray-500 font-medium">
          Belum punya akun? <Link href="/register" className="text-blue-600 font-bold hover:underline">Daftar di sini</Link>
        </p>

      </div>
    </div>
  );
}