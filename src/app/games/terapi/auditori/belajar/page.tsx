"use client";
import { useRouter } from "next/navigation";
import { say } from "@/lib/speak";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

export default function AuditoriBelajar() {
  const router = useRouter();

  const handlePlaySound = (char: string) => {
    say(`Ini huruf ${char}`);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] p-6 font-sans relative overflow-hidden">
      
      {/* Dekorasi elemen organik background */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#FDE9D2] rounded-full translate-x-20 -translate-y-20 opacity-60" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-[#EF953322] rounded-full -translate-x-10 translate-y-10" />

      <button 
        onClick={() => router.push("/games/terapi/auditori")} 
        className="w-14 h-14 mb-6 bg-[#FFF9F2] rounded-full flex items-center justify-center font-black text-2xl text-[#8D7B68] shadow-sm border-2 border-orange-100 hover:bg-orange-50 hover:-translate-x-1 transition-all relative z-10"
      >
        {"<"}
      </button>

      <div className="mb-12 text-center relative z-10">
        <h1 className="text-4xl font-black text-[#5C4D4A] mb-3 tracking-wide">Dengar & Kenali 📢</h1>
        <p className="text-[#8D7B68] font-bold text-lg">Klik kotak untuk mendengar suaranya!</p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 max-w-4xl mx-auto relative z-10 px-4">
        {ALPHABET.map((char) => (
          <button
            key={char}
            onClick={() => handlePlaySound(char)}
            className="aspect-square bg-[#FFF9F2] rounded-[32px] border-b-8 border-orange-100 flex items-center justify-center text-4xl font-black text-[#EF9533] hover:scale-105 active:border-b-0 active:translate-y-2 transition-all shadow-sm hover:border-[#EF9533]"
          >
            {char.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}