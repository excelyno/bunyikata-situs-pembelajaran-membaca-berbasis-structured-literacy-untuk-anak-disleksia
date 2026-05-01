"use client";
import { useRouter } from "next/navigation";

export default function MotorikMenu() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-orange-50 p-6 flex flex-col items-center justify-center relative">
      
      {/* Tombol Kembali */}
      <button 
        onClick={() => router.push("/dashboard/siswa")}
        className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center font-black text-xl text-orange-500 shadow-sm hover:scale-110 active:scale-95 transition-all"
      >
        {"<"}
      </button>

      <div className="text-center mb-12">
        <div className="text-8xl mb-4 animate-bounce">👦🏽</div>
        <h1 className="text-4xl font-black text-orange-600 mb-2">Zona Motorik</h1>
        <p className="text-orange-800 font-medium max-w-md mx-auto">
          Latih otot tanganmu! Pilih mode bermainmu hari ini.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        
        {/* Mode Belajar */}
        <div 
          onClick={() => router.push("/games/terapi/motorik/belajar")}
          className="bg-white p-8 rounded-[40px] border-b-8 border-orange-200 cursor-pointer hover:-translate-y-2 hover:border-orange-300 transition-all flex flex-col items-center text-center group"
        >
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-5xl mb-6 group-hover:scale-110 transition-transform">
            ✍️
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Belajar Menulis</h2>
          <p className="text-gray-500 font-medium text-sm">
            Latihan bebas menulis 26 huruf alfabet dan 10 angka dari awal.
          </p>
        </div>

        {/* Mode Petualangan (Budi) */}
        <div 
          onClick={() => router.push("/games/terapi/motorik/petualangan")}
          className="bg-white p-8 rounded-[40px] border-b-8 border-orange-200 cursor-pointer hover:-translate-y-2 hover:border-orange-300 transition-all flex flex-col items-center text-center group"
        >
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-5xl mb-6 group-hover:scale-110 transition-transform">
            🏕️
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Petualangan Budi</h2>
          <p className="text-gray-500 font-medium text-sm">
            Bantu Budi melewati rintangan untuk sampai ke taman bermain!
          </p>
        </div>

      </div>
    </div>
  );
}