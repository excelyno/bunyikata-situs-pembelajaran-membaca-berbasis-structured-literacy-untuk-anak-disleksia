"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import HeroImage from "../../../public/hero/gorogu-landing.png";

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
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0] p-4 lg:p-10 font-sans relative overflow-hidden">
      
      {/* Dekorasi elemen organik background */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#FDE9D2] rounded-full translate-x-20 -translate-y-20 opacity-60" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-[#EF953322] rounded-full -translate-x-10 translate-y-10" />

      {/* Kontainer Utama (Dibagi 2 kolom pada layar besar) */}
      <div className="flex flex-col lg:flex-row bg-white rounded-[40px] shadow-xl border-b-8 border-gray-100 w-full max-w-5xl z-10 animate-in zoom-in duration-300 overflow-hidden">
        
        {/* KOLOM KIRI: Form Login */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          
          <div className="text-center mb-8">
            {/* Logo Text BunyiKata */}
            <h1 className="text-4xl font-black text-[#5C4033] mb-2">
              Bunyi<span className="text-[#EF9533]">Kata</span>
            </h1>
            <p className="text-[#8D7B68] font-medium">Masuk untuk mulai bermain dan belajar!</p>
          </div>

          {/* Notifikasi Error */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold mb-6 border border-red-100 flex items-center justify-center gap-2">
               {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-[#5C4033] mb-2 ml-1">Username</label>
              <input 
                required 
                type="text" 
                placeholder="Masukkan username kamu..." 
                className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-[#EF9533] focus:outline-none bg-gray-50 focus:bg-white transition-colors text-lg text-[#5C4033] placeholder-gray-400"
                onChange={e => setFormData({...formData, username: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#5C4033] mb-2 ml-1">Password</label>
              <input 
                required 
                type="password" 
                placeholder="Masukkan sandi rahasia..." 
                className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-[#EF9533] focus:outline-none bg-gray-50 focus:bg-white transition-colors text-lg text-[#5C4033] placeholder-gray-400"
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#EF9533] text-white p-4 rounded-2xl font-black text-xl hover:bg-[#D17A20] transition-all shadow-[0_6px_0_#C46A14] active:translate-y-2 active:shadow-none mt-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {loading ? "Mengecek..." : "Masuk "}
            </button>
          </form>

          <p className="mt-8 text-center text-[#8D7B68] font-medium">
            Belum punya akun? <Link href="/register" className="text-[#EF9533] font-bold hover:underline">Daftar di sini</Link>
          </p>

        </div>

        {/* KOLOM KANAN: Hero Section (Disembunyikan di Mobile) */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-[#FFF4E8] relative items-center justify-center p-12 overflow-hidden border-l-2 border-gray-50">
          {/* Konten Hero */}
          <div className="text-center z-10 flex flex-col items-center">
            {/* Ganti div emoji ini dengan tag <img src="..." /> untuk maskot atau karakter */}
            <Image src={HeroImage} alt="" className="w-full h-full object-contain drop-shadow-md"/>
            
            <h3 className="text-3xl font-black text-[#5C4033] mb-3">
              Selamat Datang!
            </h3>
            <p className="text-[#8D7B68] font-medium text-lg max-w-sm leading-relaxed">
              Yuk, lanjutkan petualangan belajarmu hari ini. Banyak hal seru yang sudah menunggumu!
            </p>
          </div>

          {/* Lingkaran Dekorasi di Belakang Karakter */}
          <div className="absolute w-80 h-80 bg-white rounded-full opacity-60 -z-0" />
        </div>

      </div>
    </div>
  );
}