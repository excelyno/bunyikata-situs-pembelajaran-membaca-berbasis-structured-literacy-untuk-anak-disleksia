"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Pasangan huruf yang sering tertukar (disleksia)
const CONFUSING_PAIRS = [
  { id: 1, letters: ["b", "d"], tip: "'b' perutnya menghadap kanan, 'd' perutnya menghadap kiri." },
  { id: 2, letters: ["p", "q"], tip: "'p' kepalanya menghadap kanan, 'q' kepalanya menghadap kiri." },
  { id: 3, letters: ["m", "n"], tip: "'m' punya dua lengkungan, 'n' hanya punya satu lengkungan." },
  { id: 4, letters: ["6", "9"], tip: "'6' perutnya di bawah, '9' kepalanya di atas." },
];

export default function LatihanMataVisual() {
  const router = useRouter();
  const [activePair, setActivePair] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-emerald-50 p-6 flex flex-col items-center">
      
      {/* Tombol Kembali */}
      <button 
        onClick={() => router.push("/games/terapi/visual")}
        className="self-start mb-6 w-12 h-12 bg-white rounded-full flex items-center justify-center font-black text-xl text-emerald-500 shadow-sm hover:scale-110 active:scale-95 transition-all"
      >
        {"<"}
      </button>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-emerald-600 mb-2">Latihan Mata 👁️</h1>
        <p className="text-emerald-800 font-medium max-w-md mx-auto">
          Mari perhatikan baik-baik! Beberapa huruf dan angka ini terlihat mirip, tapi sebenarnya berbeda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {CONFUSING_PAIRS.map((item) => (
          <div 
            key={item.id}
            onClick={() => setActivePair(activePair === item.id ? null : item.id)}
            className={`bg-white p-8 rounded-[40px] border-b-8 cursor-pointer transition-all flex flex-col items-center text-center
              ${activePair === item.id ? "border-emerald-400 bg-emerald-50 scale-105" : "border-emerald-200 hover:-translate-y-2"}`}
          >
            <div className="flex gap-8 mb-6">
              {/* Huruf Kiri */}
              <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center text-7xl font-black shadow-inner">
                {item.letters[0]}
              </div>
              {/* Huruf Kanan */}
              <div className="w-24 h-24 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center text-7xl font-black shadow-inner">
                {item.letters[1]}
              </div>
            </div>

            <h2 className="text-2xl font-black text-gray-800 mb-2">
              Beda <span className="text-blue-500 uppercase">{item.letters[0]}</span> dan <span className="text-rose-500 uppercase">{item.letters[1]}</span>
            </h2>
            
            {/* Munculkan tips jika kartu diklik */}
            <div className={`overflow-hidden transition-all duration-300 ${activePair === item.id ? "max-h-24 opacity-100" : "max-h-0 opacity-0"}`}>
              <p className="text-emerald-700 font-bold mt-4 bg-emerald-100 p-3 rounded-xl">
                💡 {item.tip}
              </p>
            </div>
            
            {activePair !== item.id && (
              <p className="text-gray-400 font-medium text-sm mt-4 animate-pulse">Klik untuk melihat tips</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}