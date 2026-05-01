"use client";
import { useEffect, useState } from "react";

interface Props {
  onAnswer: (target: string, answered: string, isCorrect: boolean, timeMs: number, category: string) => void;
}

export default function MotorikSoal1({ onAnswer }: Props) {
  const [startTime, setStartTime] = useState<number>(0);

  // Jalankan stopwatch begitu komponen di-render di layar
  useEffect(() => {
    setStartTime(performance.now());
  }, []);

  const handleClick = (pilihanAnak: string) => {
    const endTime = performance.now();
    const timeMs = Math.round(endTime - startTime);
    
    const targetItem = "b"; // Jawaban benarnya adalah 'b'
    const isCorrect = pilihanAnak === targetItem;

    // Kirim data ke Wadah Utama untuk dicatat
    onAnswer(
      "B_to_b_2opts",      // ID Soal
      pilihanAnak,         // Apa yang dia klik ('b' atau 'd')
      isCorrect,           // Benar/Salah
      timeMs,              // Waktu dalam milidetik
      "MOTORIK_REVERSAL"   // Tagging Disleksia Universal kita
    );
  };

  return (
    <div className="animate-in fade-in duration-500 w-full flex flex-col items-center">
      <p className="text-[#5C4033] font-bold text-xl md:text-2xl mb-8">Pilih huruf kecil yang bentuknya sama!</p>
      
      {/* Target Box (Kotak Besar) */}
      <div className="w-48 h-48 md:w-56 md:h-56 bg-[#FFF8EF] rounded-3xl border border-[#FDE9D2] flex items-center justify-center mb-10 shadow-sm">
        <span className="text-[100px] md:text-[120px] font-black text-[#5C4033] leading-none">B</span>
      </div>
      
      {/* Options */}
      <div className="flex justify-center gap-6 w-full">
        <button 
          onClick={() => handleClick("d")}
          className="w-32 h-32 md:w-40 md:h-40 bg-white text-[#F18230] text-[70px] md:text-[90px] font-black rounded-3xl border-2 border-gray-100 hover:border-[#F18230] hover:bg-[#FFF8EF] hover:scale-105 active:scale-95 transition-all shadow-sm flex items-center justify-center leading-none"
        >
          d
        </button>

        <button 
          onClick={() => handleClick("b")}
          className="w-32 h-32 md:w-40 md:h-40 bg-white text-[#4CAF50] text-[70px] md:text-[90px] font-black rounded-3xl border-2 border-gray-100 hover:border-[#4CAF50] hover:bg-[#F2FAF3] hover:scale-105 active:scale-95 transition-all shadow-sm flex items-center justify-center leading-none"
        >
          b
        </button>
      </div>
    </div>
  );
}