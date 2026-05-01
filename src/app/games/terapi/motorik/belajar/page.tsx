"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DrawingCanvas from "@/app/components/DrawingCanvas";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");
const NUMBERS = "0123456789".split("");

export default function MotorikBelajar() {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [exploreIndex, setExploreIndex] = useState<number | null>(null);

  // Fungsi untuk fitur "Berjelajah" (Belajar urut dari A)
  const handleBerjelajah = () => {
    setExploreIndex(0);
    setActiveItem(ALPHABET[0]);
  };

  const handleNextExplore = () => {
    if (exploreIndex !== null && exploreIndex < ALPHABET.length - 1) {
      const nextIdx = exploreIndex + 1;
      setExploreIndex(nextIdx);
      setActiveItem(ALPHABET[nextIdx]);
    } else {
      // Selesai Berjelajah
      setExploreIndex(null);
      setActiveItem(null);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 p-6 pb-20 relative">
      <button onClick={() => router.push("/games/terapi/motorik")} className="w-12 h-12 mb-6 bg-white rounded-full flex items-center justify-center font-black text-xl text-orange-500 shadow-sm hover:scale-110 transition-all">
        {"<"}
      </button>

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-black text-orange-600 mb-2">Belajar Menulis ✍️</h1>
          <p className="text-orange-800 font-medium">Pilih huruf/angka, atau mulai berjelajah dari awal!</p>
        </div>
        <button 
          onClick={handleBerjelajah}
          className="bg-orange-500 text-white px-6 py-3 rounded-2xl font-bold shadow-[0_4px_0_#c2410c] active:translate-y-1 active:shadow-none transition-all"
        >
          🚀 Berjelajah
        </button>
      </div>

      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-orange-100">
        <h2 className="text-xl font-bold text-gray-400 uppercase tracking-widest mb-4">Huruf</h2>
        <div className="flex flex-wrap gap-3 mb-10">
          {ALPHABET.map((char) => (
            <button 
              key={char} onClick={() => { setActiveItem(char); setExploreIndex(null); }}
              className="w-14 h-14 bg-orange-50 text-orange-600 text-2xl font-black rounded-2xl border-b-4 border-orange-200 hover:bg-orange-100 active:border-b-0 transition-all flex items-center justify-center uppercase"
            >
              {char}
            </button>
          ))}
        </div>

        <h2 className="text-xl font-bold text-gray-400 uppercase tracking-widest mb-4">Angka</h2>
        <div className="flex flex-wrap gap-3">
          {NUMBERS.map((num) => (
            <button 
              key={num} onClick={() => { setActiveItem(num); setExploreIndex(null); }}
              className="w-14 h-14 bg-blue-50 text-blue-600 text-2xl font-black rounded-2xl border-b-4 border-blue-200 hover:bg-blue-100 active:border-b-0 transition-all flex items-center justify-center"
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* MODAL KANVAS LATIHAN */}
      {activeItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-[40px] shadow-2xl max-w-sm w-full flex flex-col items-center relative animate-in zoom-in duration-300">
            
            <button onClick={() => { setActiveItem(null); setExploreIndex(null); }} className="absolute top-4 right-4 w-10 h-10 bg-gray-100 text-gray-500 rounded-full font-bold hover:bg-gray-200 flex items-center justify-center">
              ✕
            </button>

            <h3 className="text-2xl font-black text-gray-800 mb-6">Tulis: <span className="text-orange-500 uppercase text-4xl">{activeItem}</span></h3>
            
            <DrawingCanvas watermark={activeItem} />

            <div className="mt-8 flex gap-4 w-full">
              {exploreIndex !== null ? (
                <button onClick={handleNextExplore} className="flex-1 bg-green-500 text-white py-4 rounded-2xl font-black shadow-[0_6px_0_#166534] active:translate-y-2 active:shadow-none transition-all">
                  Lanjut ➡️
                </button>
              ) : (
                <button onClick={() => setActiveItem(null)} className="flex-1 bg-blue-500 text-white py-4 rounded-2xl font-black shadow-[0_6px_0_#1e3a8a] active:translate-y-2 active:shadow-none transition-all">
                  Selesai
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}