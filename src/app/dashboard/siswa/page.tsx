"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SiswaDashboard() {
  const router = useRouter();
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ambil data rekomendasi berdasarkan Pratest
    fetch("/api/dashboard/siswa/recommendation")
      .then(async (res) => {
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.recommended) setRecommendation(data.recommended);
      })
      .catch(e => console.error("Gagal memuat rekomendasi:", e))
      .finally(() => setIsLoading(false)); // Pastikan loading berhenti, apapun yang terjadi
  }, []);

  const handleLogout = () => {
    // Hapus token jika abang menyimpannya di localStorage/cookies, lalu arahkan ke login
    document.cookie = "bunyikata_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  // TAMPILAN LOADING
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center">
        <div className="text-6xl mb-4 animate-bounce">🚀</div>
        <h2 className="text-2xl font-black text-indigo-600 animate-pulse">Mempersiapkan Petualangan...</h2>
      </div>
    );
  }

  // TAMPILAN UTAMA
  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 pb-24">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-black text-indigo-600">Halo Pahlawan! 🦸‍♂️</h1>
          <p className="text-gray-500 font-medium">Pilih petualanganmu hari ini.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="bg-red-50 text-red-500 px-4 py-2 rounded-xl font-bold hover:bg-red-100 transition-all"
        >
          Keluar
        </button>
      </header>

      {/* Pratest Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-[40px] p-8 text-white mb-10 shadow-lg shadow-blue-200 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black mb-2">Pemanasan (Pratest)</h2>
          <p className="text-blue-100 font-medium max-w-sm">
            Cek kemampuanmu hari ini agar sistem tahu petualangan apa yang cocok untukmu!
          </p>
        </div>
        <button 
          onClick={() => router.push("/games/pratest")}
          className="bg-white text-indigo-600 px-8 py-4 rounded-3xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_6px_0_#93c5fd]"
        >
          Mulai Pratest
        </button>
      </div>

      <h2 className="text-2xl font-black text-gray-800 mb-6">Pilih Zona Latihanmu! 🚀</h2>

      {/* KARTU TERAPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 1. TERAPI MOTORIK */}
        <div 
          onClick={() => router.push("/games/terapi/motorik")}
          className={`relative p-8 rounded-[40px] cursor-pointer transition-all hover:-translate-y-2 
            ${recommendation === 'motorik' 
              ? 'bg-orange-50 border-4 border-orange-400 shadow-xl shadow-orange-100' 
              : 'bg-white border-2 border-gray-100 shadow-sm hover:shadow-lg'}`}
        >
          {recommendation === 'motorik' && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-xs font-black animate-bounce shadow-md whitespace-nowrap">
              ⭐ COCOK UNTUKMU
            </div>
          )}
          <div className="text-6xl mb-4">👦🏽</div>
          <h3 className="text-2xl font-black text-gray-800 mb-2">Bantu Budi</h3>
          <p className="text-gray-500 font-medium text-sm mb-6">Latih otot tanganmu dengan menulis dan memindahkan huruf untuk Budi!</p>
          <div className="text-orange-500 font-bold uppercase text-sm tracking-wider">Zona Motorik ✍️</div>
        </div>

        {/* 2. TERAPI AUDITORI */}
        <div 
          onClick={() => router.push("/games/terapi/auditori")}
          className={`relative p-8 rounded-[40px] cursor-pointer transition-all hover:-translate-y-2 
            ${recommendation === 'auditori' 
              ? 'bg-purple-50 border-4 border-purple-400 shadow-xl shadow-purple-100' 
              : 'bg-white border-2 border-gray-100 shadow-sm hover:shadow-lg'}`}
        >
          {recommendation === 'auditori' && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-xs font-black animate-bounce shadow-md whitespace-nowrap">
              ⭐ COCOK UNTUKMU
            </div>
          )}
          <div className="text-6xl mb-4">🦁</div>
          <h3 className="text-2xl font-black text-gray-800 mb-2">Singa Bertarung</h3>
          <p className="text-gray-500 font-medium text-sm mb-6">Dengarkan suara dengan tajam dan bantu Singa menjadi Raja Hutan!</p>
          <div className="text-purple-500 font-bold uppercase text-sm tracking-wider">Zona Auditori 🎧</div>
        </div>

        {/* 3. TERAPI VISUAL */}
        <div 
          onClick={() => router.push("/games/terapi/visual")}
          className={`relative p-8 rounded-[40px] cursor-pointer transition-all hover:-translate-y-2 
            ${recommendation === 'visual' 
              ? 'bg-emerald-50 border-4 border-emerald-400 shadow-xl shadow-emerald-100' 
              : 'bg-white border-2 border-gray-100 shadow-sm hover:shadow-lg'}`}
        >
          {recommendation === 'visual' && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-black animate-bounce shadow-md whitespace-nowrap">
              ⭐ COCOK UNTUKMU
            </div>
          )}
          <div className="text-6xl mb-4">🦉</div>
          <h3 className="text-2xl font-black text-gray-800 mb-2">Detektif Kiki</h3>
          <p className="text-gray-500 font-medium text-sm mb-6">Gunakan matamu yang tajam untuk mencari barang Kiki yang hilang!</p>
          <div className="text-emerald-500 font-bold uppercase text-sm tracking-wider">Zona Visual 👁️</div>
        </div>

      </div>
    </div>
  );
}