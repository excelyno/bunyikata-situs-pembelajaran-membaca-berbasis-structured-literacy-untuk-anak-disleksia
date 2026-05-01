"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImgMotorik from "./assets/petualang-guribuu.png";
import ImgAuditori from "./assets/petarung-guribuu-removebg-preview.png";
import ImgVisual from "./assets/detektif-guribuu-removebg-preview.png";
import ImgRingan from "./assets/permainan-ringan-guribuu-removebg-preview.png";
import logo from "./assets/logo-bunyikata.jpeg"

export default function SiswaDashboard() {
  const router = useRouter();
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/siswa/recommendation")
      .then(async (res) => {
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.recommended) setRecommendation(data.recommended);
      })
      .catch(e => console.error("Gagal memuat rekomendasi:", e))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] flex flex-col items-center justify-center">
        <div className="text-8xl mb-4 animate-bounce">🐙</div>
        <h2 className="text-2xl font-black text-[#5C4D4A] tracking-wide">Memanggil Guribuu...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] font-sans pb-32">
      
      {/* HEADER */}
      <header className="p-6 flex justify-between items-center max-w-5xl mx-auto relative h-24">
        {/* Tombol Back */}
        <button 
          onClick={() => router.push("/")}
          className="w-14 h-14 bg-white rounded-full shadow-sm border-2 border-[#E2E8F0] flex items-center justify-center text-[#8D7B68] text-2xl font-black hover:bg-gray-50 hover:-translate-x-1 transition-all z-10"
        >
          ←
        </button>

        {/* Teks Tengah */}
        <h1 className="text-3xl md:text-4xl font-black text-[#5C4D4A] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none">
          Menu Utama
        </h1>

        {/* Logo BK */}
        <div className="w-14 h-14 bg-[#D97736] rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md z-10">
          <img 
                  src={logo.src} 
                  alt="Ikon Auditori" 
                  className="w-full h-full object-contain drop-shadow-md"
                />
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-4xl mx-auto px-6 mt-8">

        {/* Grid Card 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* 1. PETUALANG GURIBUU (MOTORIK) */}
          <div className={`flex flex-col p-6 rounded-[32px] border-b-8 border-[#FDE9D2] bg-[#FFF6ED] shadow-sm 
            ${recommendation === 'motorik' ? 'ring-4 ring-[#D97736] ring-offset-4 ring-offset-[#FFFDF9]' : ''}`}
          >
            {/* Header Card */}
            <div className="mb-4 text-center">
              <h3 className="text-2xl font-black text-[#D97736] leading-tight">Petualang Guribuu</h3>
            </div>

            {/* AREA GAMBAR (KLIK DI SINI UNTUK MASUK) */}
            <button 
              onClick={() => router.push("/games/terapi/motorik")}
              className="group w-full py-8 flex flex-col items-center justify-center focus:outline-none"
            >
              <div className="w-24 h-24 sm:w-48 sm:h-48 relative flex items-center justify-center">
                <img 
                  src={ImgMotorik.src} 
                  alt="Ikon Motorik" 
                  className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 group-hover:rotate-6 group-active:scale-95 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<span class="text-7xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">🐙🎒</span>';
                  }}
                />
              </div>
            </button>

            {/* Deskripsi */}
            <p className="text-[#8D7B68] text-sm font-medium mt-5 text-center px-2">
              Bantu Guribuu melewati rintangan dengan menulis dan menyusun balok!
            </p>
          </div>

          {/* 2. PETARUNG GURIBUU (AUDITORI) */}
          <div className={`flex flex-col p-6 rounded-[32px] border-b-8 border-[#DCE8D4] bg-[#F1F6EC] shadow-sm 
            ${recommendation === 'auditori' ? 'ring-4 ring-[#4A7C59] ring-offset-4 ring-offset-[#FFFDF9]' : ''}`}
          >
            <div className="mb-4 text-center">
              <h3 className="text-2xl font-black text-[#4A7C59] leading-tight">Petarung Guribuu</h3>
            </div>

            <button 
              onClick={() => router.push("/games/terapi/auditori")}
              className="group w-full py-8 flex flex-col items-center justify-center focus:outline-none"
            >
              <div className="w-24 h-24 sm:w-48 sm:h-48 relative flex items-center justify-center">
                <img 
                  src={ImgAuditori.src} 
                  alt="Ikon Auditori" 
                  className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 group-hover:rotate-6 group-active:scale-95 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<span class="text-7xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">🐙🥊</span>';
                  }}
                />
              </div>
            </button>

            <p className="text-[#8D7B68] text-sm font-medium mt-5 text-center px-2">
              Dengarkan suara monster dengan teliti dan serang dengan kata yang tepat!
            </p>
          </div>

          {/* 3. DETEKTIF GURIBUU (VISUAL) */}
          <div className={`flex flex-col p-6 rounded-[32px] border-b-8 border-[#E6DDF0] bg-[#F4F0F8] shadow-sm 
            ${recommendation === 'visual' ? 'ring-4 ring-[#715B8E] ring-offset-4 ring-offset-[#FFFDF9]' : ''}`}
          >
            <div className="mb-4 text-center">
              <h3 className="text-2xl font-black text-[#715B8E] leading-tight">Detektif Guribuu</h3>
            </div>

            <button 
              onClick={() => router.push("/games/terapi/visual")}
              className="group w-full py-8 flex flex-col items-center justify-center focus:outline-none"
            >
              <div className="w-24 h-24 sm:w-48 sm:h-48 relative flex items-center justify-center">
                <img 
                  src={ImgVisual.src} 
                  alt="Ikon Visual" 
                  className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 group-hover:rotate-6 group-active:scale-95 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<span class="text-7xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">🐙🕵️‍♂️</span>';
                  }}
                />
              </div>
            </button>

            <p className="text-[#8D7B68] text-sm font-medium mt-5 text-center px-2">
              Cari jejak huruf yang hilang dan temukan kata yang bersembunyi!
            </p>
          </div>

          {/* 4. PERMAINAN RINGAN GURIBUU */}
          <div className="flex flex-col p-6 rounded-[32px] border-b-8 border-[#D1E5FF] bg-[#EBF4FF] shadow-sm">
            <div className="mb-4 text-center">
              <h3 className="text-2xl font-black text-[#3B82F6] leading-tight">Bermain dengan Guribuu</h3>
            </div>

            <button 
              onClick={() => router.push("/games/ringan")}
              className="group w-full py-8 flex flex-col items-center justify-center focus:outline-none"
            >
              <div className="w-24 h-24 sm:w-48 sm:h-48 relative flex items-center justify-center">
                <img 
                  src={ImgRingan.src} 
                  alt="Ikon Ringan" 
                  className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 group-hover:rotate-6 group-active:scale-95 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<span class="text-7xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">🐙🎮</span>';
                  }}
                />
              </div>
            </button>

            <p className="text-[#8D7B68] text-sm font-medium mt-5 text-center px-2">
              Istirahat sejenak! Ayo main mini-games seru bersama Guribuu dan teman-teman.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}