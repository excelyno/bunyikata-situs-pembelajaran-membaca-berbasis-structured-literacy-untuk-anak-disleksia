"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImgMotorik from "./assets/petualang-guribuu.png";
import ImgAuditori from "./assets/petarung-guribuu-removebg-preview.png";
import ImgVisual from "./assets/detektif-guribuu-removebg-preview.png";
import ImgRingan from "./assets/permainan-ringan-guribuu-removebg-preview.png";
import logo from "./assets/logo-bunyikata.jpeg"
import LogoutButton from "@/app/components/LogoutButton";


export default function SiswaDashboard() {
  const router = useRouter();
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [needsPratest, setNeedsPratest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/siswa/recommendation")
      .then(async (res) => {
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.recommended) setRecommendation(data.recommended);
        if (data.needsPratest) setNeedsPratest(true);
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
        <LogoutButton />

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
          <div className="flex flex-col p-6 rounded-[32px] border-b-8 border-[#FDE9D2] bg-[#FFF6ED] shadow-sm">
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
          <div className="flex flex-col p-6 rounded-[32px] border-b-8 border-[#DCE8D4] bg-[#F1F6EC] shadow-sm">
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
          <div className="flex flex-col p-6 rounded-[32px] border-b-8 border-[#E6DDF0] bg-[#F4F0F8] shadow-sm">
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

      {/* OVERLAY PRATEST (Mandatory for new users) */}
      {needsPratest && (
        <div className="fixed inset-0 z-[100] bg-[#FFFDF9] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
          <div className="max-w-md w-full">
            <div className="w-64 h-64 mx-auto mb-8 relative">
              <div className="absolute inset-0 bg-[#FDE9D2] rounded-full animate-ping opacity-20"></div>
              <img 
                src="/hero/gorogu-landing.png" 
                alt="Guribuu" 
                className="w-full h-full object-contain relative z-10"
              />
            </div>
            
            <h2 className="text-4xl font-black text-[#5C4D4A] mb-4 tracking-wide">
              Halo, Teman Baru! 👋
            </h2>
            <p className="text-[#8D7B68] font-bold text-lg mb-10 leading-relaxed">
              Sebelum kita mulai berpetualang, yuk ikuti misi awal sebentar biar Guribuu tahu cara belajar yang pas buat kamu!
            </p>
            
            <button 
              onClick={() => router.push("/games/pratest")}
              className="bg-[#EF9533] text-white px-12 py-5 rounded-[30px] font-black text-2xl shadow-[0_8px_0_#C46A14] hover:bg-[#D17A20] active:translate-y-2 active:shadow-none transition-all w-full flex items-center justify-center gap-4 group"
            >
              Mulai Misi Awal 
              <span className="group-hover:translate-x-2 transition-transform">➔</span>
            </button>
            
            <p className="mt-8 text-sm text-[#8D7B68] font-medium opacity-60">
              Hanya butuh waktu sekitar 10 menit kok!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}