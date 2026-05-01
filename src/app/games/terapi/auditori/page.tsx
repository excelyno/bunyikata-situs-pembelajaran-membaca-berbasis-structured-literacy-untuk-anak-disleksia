"use client";
import { useRouter } from "next/navigation";

export default function AuditoriMenu() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#FFFDF9] p-6 flex flex-col items-center justify-center relative font-sans pb-20">
      
      {/* Tombol Kembali */}
      <button 
        onClick={() => router.push("/dashboard/siswa")}
        className="absolute top-6 left-6 w-14 h-14 bg-white rounded-full flex items-center justify-center font-black text-2xl text-[#8D7B68] shadow-sm border-2 border-[#E2E8F0] hover:bg-gray-50 hover:-translate-x-1 active:scale-95 transition-all z-10"
      >
        {"<"}
      </button>

      {/* Header */}
      <div className="text-center mb-12 mt-10">
        <div className="w-52 h-52 mx-auto mb-6 flex items-center justify-center hover:scale-105 transition-transform duration-300">
          <img src="/hero/gorogu-landing.png" alt="Gorogu" className="w-full h-full object-contain drop-shadow-xl" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-[#5C4D4A] mb-4 tracking-wide">
          Petarung Gorogu
        </h1>
        <p className="text-[#8D7B68] font-bold max-w-lg mx-auto text-lg md:text-xl leading-relaxed tracking-wide px-4">
          Persiapkan telingamu dan ikut bertarung bersama Goroguu!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
        
        {/* Mode Belajar */}
        <div 
          onClick={() => router.push("/games/terapi/auditori/belajar")}
          className="bg-[#FFF6ED] p-8 rounded-[40px] border-b-8 border-[#FDE9D2] cursor-pointer hover:-translate-y-2 hover:border-[#D97736] transition-all flex flex-col items-center text-center group shadow-sm hover:shadow-xl"
        >
          <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center text-6xl mb-6 group-hover:scale-110 group-hover:-rotate-12 transition-transform shadow-sm">
            ▶️
          </div>
          <h2 className="text-3xl font-black text-[#D97736] mb-3 tracking-wide">Dengar & Kenali</h2>
          <p className="text-[#8D7B68] font-bold text-lg leading-relaxed tracking-wide mb-8">
            Mari berlatih mendengarkan suara huruf dan kata dengan teliti!
          </p>
          <button className="mt-auto bg-[#D97736] text-white px-8 py-4 rounded-full font-black text-xl hover:bg-[#C2652A] shadow-[0_6px_0_#A85522] active:translate-y-2 active:shadow-none transition-all flex items-center gap-3">
            Mulai Belajar <span>→</span>
          </button>
        </div>

        {/* Mode Petualangan */}
        <div 
          onClick={() => router.push("/games/terapi/auditori/petualangan")}
          className="bg-[#F1F6EC] p-8 rounded-[40px] border-b-8 border-[#DCE8D4] cursor-pointer hover:-translate-y-2 hover:border-[#4A7C59] transition-all flex flex-col items-center text-center group shadow-sm hover:shadow-xl"
        >
          <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center text-6xl mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform shadow-sm">
            ⚔️
          </div>
          <h2 className="text-3xl font-black text-[#4A7C59] mb-3 tracking-wide">Bertarung</h2>
          <p className="text-[#8D7B68] font-bold text-lg leading-relaxed tracking-wide mb-8">
            Dengarkan tantangan monster dan serang dengan kata yang tepat!
          </p>
          <button className="mt-auto bg-[#4A7C59] text-white px-8 py-4 rounded-full font-black text-xl hover:bg-[#3B6648] shadow-[0_6px_0_#2E523A] active:translate-y-2 active:shadow-none transition-all flex items-center gap-3">
            Mulai Petualangan <span>→</span>
          </button>
        </div>

      </div>

      {/* Footer Info */}
      <div className="mt-16 text-center w-full max-w-2xl bg-[#FFF6ED] px-8 py-5 rounded-3xl border-2 border-[#D97736]/30 shadow-sm">
        <p className="text-lg text-[#D97736] font-bold flex items-center justify-center gap-4 tracking-wide leading-relaxed">
          <span className="text-3xl animate-pulse">💡</span> Telinga yang peka akan membantumu mengalahkan monster!
        </p>
      </div>
    </div>
  );
}