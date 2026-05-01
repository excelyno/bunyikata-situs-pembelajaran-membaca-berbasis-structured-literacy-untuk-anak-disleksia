"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import HeroImage from "../../public/hero/gorogu-landing.png"

export default function MotorikMenu() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 p-6 flex flex-col items-center justify-center relative">
      
      {/* Tombol Kembali */}
      <button 
        onClick={() => router.push("/dashboard/siswa")}
        className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center font-black text-xl text-orange-600 shadow-md hover:scale-110 active:scale-95 transition-all"
      >
        {"<"}
      </button>

      {/* Header */}
      <div className="text-center mb-12">
        <div className="text-8xl mb-4 animate-bounce">✍️</div>
        <h1 className="text-4xl font-black text-orange-700 mb-2">Terapi Motorik</h1>
        <p className="text-orange-800 font-medium max-w-md mx-auto">
          Pilih kegiatan yang ingin kamu lakukan. Latih kemampuan menulis huruf dan angka dengan seru!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        
        {/* Mode Belajar */}
        <div 
          onClick={() => router.push("/games/terapi/motorik/belajar")}
          className="bg-white p-8 rounded-[40px] border-b-8 border-orange-200 cursor-pointer hover:-translate-y-2 hover:border-orange-300 transition-all flex flex-col items-center text-center group shadow-lg"
        >
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-5xl mb-6 group-hover:scale-110 transition-transform shadow-inner">
            ✏️
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Belajar</h2>
          <p className="text-sm text-gray-600 mb-1 font-semibold">(Menulis)</p>
          <p className="text-gray-500 font-medium text-sm">
            Latih kemampuan menulis huruf dan angka dengan seru!
          </p>
          <button className="mt-6 bg-orange-600 text-white px-6 py-3 rounded-full font-black text-sm hover:bg-orange-700 active:scale-95 transition-all">
            Ayo Belajar!
          </button>
        </div>

        {/* Mode Petualangan (Budi) */}
        <div 
          onClick={() => router.push("/games/terapi/motorik/petualangan")}
          className="bg-white p-8 rounded-[40px] border-b-8 border-orange-200 cursor-pointer hover:-translate-y-2 hover:border-orange-300 transition-all flex flex-col items-center text-center group shadow-lg"
        >
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-5xl mb-6 group-hover:scale-110 transition-transform shadow-inner">
            🧒
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Berpetualang</h2>
          <p className="text-sm text-gray-600 mb-1 font-semibold">(Game Test)</p>
          <p className="text-gray-500 font-medium text-sm">
            Selesaikan misi menulis dan bantu Budi sampai ke taman!
          </p>
          <button className="mt-6 bg-orange-600 text-white px-6 py-3 rounded-full font-black text-sm hover:bg-orange-700 active:scale-95 transition-all">
            Ayo Petualang!
          </button>
        </div>

      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center max-w-2xl">
        <p className="text-sm text-orange-700 font-medium flex items-center justify-center gap-2">
          💡 <span>Latihan otot akan membuatmu semakin kuat dan bisa menulis lebih baik!</span>
        </p>
      </div>
    </div>
  );
}