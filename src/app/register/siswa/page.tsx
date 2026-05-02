"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Image from "next/image";
import HeroImage from "../../../../public/hero/gorogu-landing.png"


export default function RegisterSiswaPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ nama: "", username: "", waliEmail: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // KUNCI ROLE SEBAGAI SISWA DI SINI
      body: JSON.stringify({ ...formData, role: "SISWA" }),
    });

    const data = await res.json();

    if (res.ok) {
      // Langsung lempar ke dashboard masing-masing tanpa alert login lagi
      if (data.role === "WALI") {
        router.push("/dashboard/wali");
      } else {
        router.push("/games/pratest");
      }
    } else {
      setError(data.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0] p-4 lg:p-10 font-sans relative overflow-hidden">
      
      {/* Dekorasi elemen organik background */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#FDE9D2] rounded-full -translate-x-20 -translate-y-20 opacity-60" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#EF953322] rounded-full translate-x-10 translate-y-10" />

      {/* Kontainer Utama (Dibagi 2 kolom pada layar besar) */}
      <div className="flex flex-col lg:flex-row bg-white rounded-[40px] shadow-xl border-b-8 border-gray-100 w-full max-w-5xl z-10 overflow-hidden">
        
        {/* KOLOM KIRI: Form Register */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          
          <div className="mb-8">
            <Link href="/register" className="inline-flex text-[#EF9533] font-bold hover:text-[#D17A20] items-center gap-2 transition-colors bg-[#FFF4E8] px-4 py-2 rounded-2xl w-fit">
              &larr; Ganti Peran
            </Link>
          </div>
          
          <h2 className="text-3xl font-black mb-2 text-[#5C4033]">Akun Siswa</h2>
          <p className="text-[#8D7B68] mb-8 font-medium">Ayo belajar sambil bermain!</p>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold mb-6 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <input required type="text" placeholder="Nama Panggilanmu" 
              className="w-full p-4 border-2 border-gray-100 rounded-xl focus:border-[#EF9533] focus:outline-none bg-gray-50 focus:bg-white transition-colors text-lg text-[#5C4033] placeholder-gray-400"
              onChange={e => setFormData({...formData, nama: e.target.value})}
            />
            <input required type="text" placeholder="Username (Untuk Login)" 
              className="w-full p-4 border-2 border-gray-100 rounded-xl focus:border-[#EF9533] focus:outline-none bg-gray-50 focus:bg-white transition-colors text-lg text-[#5C4033] placeholder-gray-400"
              onChange={e => setFormData({...formData, username: e.target.value})}
            />
            
            {/* Box Khusus Email Wali - Disesuaikan dengan tema earthy */}
            <div className="bg-[#FFF4E8] p-5 rounded-2xl border-2 border-[#FDE9D2] mt-6">
              <label className="block text-sm font-black text-[#5C4033] mb-2 uppercase tracking-wide">🔗 Email Wali / Guru</label>
              <input required type="email" placeholder="Ketik email walimu di sini..." 
                className="w-full p-3 border-2 border-white rounded-xl focus:border-[#EF9533] focus:outline-none bg-white font-medium text-[#5C4033] placeholder-gray-400"
                onChange={e => setFormData({...formData, waliEmail: e.target.value})}
              />
              <p className="text-xs text-[#8D7B68] mt-2 font-medium">
                Ini penting biar walimu bisa melihat nilaimu nanti!
              </p>
            </div>

            <input required type="password" placeholder="Kata Sandi Rahasia" 
              className="w-full p-4 border-2 border-gray-100 rounded-xl focus:border-[#EF9533] focus:outline-none bg-gray-50 focus:bg-white transition-colors text-lg mt-6 text-[#5C4033] placeholder-gray-400"
              onChange={e => setFormData({...formData, password: e.target.value})}
            />

            <button type="submit" disabled={loading}
              className="w-full bg-[#EF9533] text-white p-4 rounded-xl font-black text-xl hover:bg-[#D17A20] transition-all shadow-[0_6px_0_#C46A14] active:translate-y-2 active:shadow-none mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Tunggu ya..." : "Mulai Petualangan! "}
            </button>
          </form>

        </div>

        {/* KOLOM KANAN: Hero Section Katak (Disembunyikan di Mobile) */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-[#FFF4E8] relative items-center justify-center p-12 overflow-hidden border-l-2 border-gray-50">
          
          {/* Ornamen Bintang Khas BunyiKata */}
          <div className="absolute top-20 left-16 text-[#F9C03C] text-3xl animate-pulse">⭐</div>
          <div className="absolute bottom-24 right-16 text-[#F9C03C] text-4xl animate-bounce">⭐</div>

          {/* Konten Hero */}
          <div className="text-center z-10 flex flex-col items-center">
            {/* Ganti div emoji ini dengan tag <img src="..." /> jika sudah ada aset karakter/katak */}
            <div className="text-[120px] mb-6 drop-shadow-xl hover:scale-110 transition-transform cursor-pointer">
              <Image src={HeroImage} alt="" width={500} height={500}/>
            </div>
            
            <h3 className="text-3xl font-black text-[#5C4033] mb-3">
              Halo, Teman Baru!
            </h3>
            <p className="text-[#8D7B68] font-medium text-lg max-w-xs leading-relaxed">
              Siapkan dirimu untuk berpetualang dan belajar membaca dengan cara yang super seru.
            </p>
          </div>

          {/* Lingkaran Dekorasi di Belakang Karakter */}
          <div className="absolute w-80 h-80 bg-white rounded-full opacity-60 -z-0" />
        </div>

      </div>
    </div>
  );
}