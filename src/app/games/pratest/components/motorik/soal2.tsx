"use client";
import { useEffect, useState } from "react";

interface Props {
  onAnswer: (target: string, answered: string, isCorrect: boolean, timeMs: number, category: string) => void;
}

export default function MotorikSoal2({ onAnswer }: Props) {
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    setStartTime(performance.now());
  }, []);

  const handleClick = (pilihanAnak: string) => {
    const timeMs = Math.round(performance.now() - startTime);
    const isCorrect = pilihanAnak === "d"; // Jawaban benarnya 'd'

    onAnswer(
      "D_to_d_4opts",
      pilihanAnak,
      isCorrect,
      timeMs,
      "MOTORIK_REVERSAL"
    );
  };

  const pilihan = ["b", "d", "p", "q"];

  return (
    <div className="animate-in fade-in duration-500 w-full flex flex-col items-center">
      <p className="text-[#5C4033] font-bold text-xl md:text-2xl mb-8">Cari teman kecilnya!</p>
      
      {/* Target Box */}
      <div className="w-40 h-40 md:w-48 md:h-48 bg-[#FFF8EF] rounded-3xl border border-[#FDE9D2] flex items-center justify-center mb-10 shadow-sm">
        <span className="text-[80px] md:text-[100px] font-black text-[#5C4033] leading-none">D</span>
      </div>
      
      {/* Options */}
      <div className="flex flex-wrap justify-center gap-4 max-w-lg mx-auto">
        {pilihan.map((huruf, index) => {
          // Memberikan warna yang berbeda-beda untuk tiap huruf agar lebih menarik
          const colors = ['#F18230', '#4CAF50', '#2196F3', '#E91E63'];
          const color = colors[index % colors.length];
          return (
            <button 
              key={huruf}
              onClick={() => handleClick(huruf)}
              style={{ color }}
              className="w-24 h-24 md:w-28 md:h-28 bg-white text-[50px] md:text-[60px] font-black rounded-3xl border-2 border-gray-100 hover:border-gray-300 hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all shadow-sm flex items-center justify-center leading-none"
            >
              {huruf}
            </button>
          );
        })}
      </div>
    </div>
  );
}