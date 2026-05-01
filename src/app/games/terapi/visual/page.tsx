"use client";
import { useRouter } from "next/navigation";

export default function VisualMenu() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 p-6 flex flex-col items-center justify-center relative">
      
      {/* Tombol Back ke Dashboard */}
      <button 
        onClick={() => router.push("/dashboard/siswa")}
        className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center font-black text-xl text-purple-600 shadow-md hover:scale-110 active:scale-95 transition-all"
      >
        {"<"}
      </button>

      {/* Header Visual */}
      <div className="text-center mb-12">
        <div className="text-8xl mb-4 animate-bounce">🦉</div>
        <h1 className="text-4xl font-black text-purple-700 mb-2">Terapi Visual (Dyseidesia)</h1>
        <p className="text-purple-800 font-medium max-w-md mx-auto">
          Pilih kegiatan yang ingin kamu lakukan. Mata yang tajam! 
        </p>
      </div>

      {/* Menu Pilihan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        
        {/* 1. Mode Belajar / Latihan Mata */}
        <div 
          onClick={() => router.push("/games/terapi/visual/belajar")}
          className="bg-white p-8 rounded-[40px] border-b-8 border-purple-200 cursor-pointer hover:-translate-y-2 hover:border-purple-300 transition-all flex flex-col items-center text-center group shadow-lg"
        >
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center text-5xl mb-6 group-hover:scale-110 transition-transform shadow-inner">
            📖
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Belajar</h2>
          <p className="text-sm text-gray-600 mb-1 font-semibold">(Kartu Kata)</p>
          <p className="text-gray-500 font-medium text-sm">
            Belajar mengenal bentuk kata dengan kartu bergambar!
          </p>
          <button className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-full font-black text-sm hover:bg-purple-700 active:scale-95 transition-all">
            Ayo Belajar!
          </button>
        </div>

        {/* 2. Mode Petualangan (Detektif Kiki) */}
        <div 
          onClick={() => router.push("/games/terapi/visual/petualangan")}
          className="bg-white p-8 rounded-[40px] border-b-8 border-purple-200 cursor-pointer hover:-translate-y-2 hover:border-purple-300 transition-all flex flex-col items-center text-center group shadow-lg"
        >
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center text-5xl mb-6 group-hover:scale-110 transition-transform shadow-inner">
            🕵️
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Berdetektif</h2>
          <p className="text-sm text-gray-600 mb-1 font-semibold">(Game Test)</p>
          <p className="text-gray-500 font-medium text-sm">
            Bantu Kiki si Burung Hantu menemukan barang-barang yang hilang!
          </p>
          <button className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-full font-black text-sm hover:bg-purple-700 active:scale-95 transition-all">
            Ayo Berdetektif!
          </button>
        </div>

      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center max-w-2xl">
        <p className="text-sm text-purple-700 font-medium flex items-center justify-center gap-2">
          👁️ <span>Mata yang teliti akan membantumu mengenali kata dan huruf lebih mudah!</span>
        </p>
      </div>
    </div>
  );
}