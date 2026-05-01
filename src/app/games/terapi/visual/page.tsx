"use client";
import { useRouter } from "next/navigation";

export default function VisualMenu() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-emerald-50 p-6 flex flex-col items-center justify-center relative">
      {/* Tombol Back ke Dashboard */}
      <button 
        onClick={() => router.push("/dashboard/siswa")}
        className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center font-black text-xl text-emerald-500 shadow-sm hover:scale-110 transition-all"
      >
        {"<"}
      </button>

      {/* Header Visual */}
      <div className="text-center mb-12">
        <div className="text-8xl mb-4 animate-bounce">🦉</div>
        <h1 className="text-4xl font-black text-emerald-600 mb-2">Zona Visual</h1>
        <p className="text-emerald-800 font-medium max-w-md mx-auto">
          Gunakan mata tajammu seperti Burung Hantu Kiki! 
        </p>
      </div>

      {/* Menu Pilihan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        
        {/* 1. Mode Belajar / Latihan Mata */}
        <div 
          onClick={() => router.push("/games/terapi/visual/belajar")}
          className="bg-white p-8 rounded-[40px] border-b-8 border-emerald-200 cursor-pointer hover:-translate-y-2 transition-all flex flex-col items-center text-center"
        >
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-5xl mb-6 shadow-inner">👁️</div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Latihan Mata</h2>
          <p className="text-gray-500 font-medium text-sm">Lihat perbedaan huruf-huruf yang sering mengecoh matamu.</p>
        </div>

        {/* 2. Mode Petualangan (Detektif Kiki) */}
        <div 
          onClick={() => router.push("/games/terapi/visual/petualangan")}
          className="bg-white p-8 rounded-[40px] border-b-8 border-emerald-200 cursor-pointer hover:-translate-y-2 transition-all flex flex-col items-center text-center"
        >
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-5xl mb-6 shadow-inner">🔍</div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Detektif Kiki</h2>
          <p className="text-gray-500 font-medium text-sm">Bantu Kiki menemukan satu huruf yang berbeda dari teman-temannya!</p>
        </div>

      </div>
    </div>
  );
}