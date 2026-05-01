"use client";
import { useEffect, useState } from "react";

interface Props {
  onAnswer: (target: string, answered: string, isCorrect: boolean, timeMs: number, category: string, autoAdvance?: boolean) => void;
}

export default function VisualSoal1({ onAnswer }: Props) {
  const [showWord, setShowWord] = useState(true);
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    // Hilangkan kata setelah 2 detik (2000ms)
    const timer = setTimeout(() => {
      setShowWord(false);
      setStartTime(performance.now()); // Mulai stopwatch hitung waktu respon SETELAH kata hilang
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = (pilihan: string) => {
    const timeMs = Math.round(performance.now() - startTime);
    const isCorrect = pilihan === "rumah";
    onAnswer("rumah", pilihan, isCorrect, timeMs, "VISUAL_TRANSPOSITION");
  };

  return (
    <div className="flex flex-col justify-center items-center animate-in fade-in duration-500 w-full min-h-[300px]">
      {showWord ? (
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-64 h-32 md:w-80 md:h-40 bg-[#FFF8EF] rounded-3xl border border-[#FDE9D2] flex items-center justify-center mb-6 shadow-sm">
            <h2 className="text-5xl md:text-6xl font-black text-[#5C4033] tracking-widest">rumah</h2>
          </div>
          <p className="text-[#8D7B68] font-bold text-xl">Ingat kata ini...</p>
        </div>
      ) : (
        <div className="animate-in zoom-in duration-300 flex flex-col items-center w-full">
          <p className="text-[#5C4033] font-bold text-xl md:text-2xl mb-10">Kata apa yang tadi muncul?</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 w-full max-w-md">
            {["rumha", "rumah"].map((kata, index) => {
              const color = index === 0 ? '#F18230' : '#4CAF50';
              return (
                <button 
                  key={kata} onClick={() => handleClick(kata)}
                  className="flex-1 py-6 bg-white text-3xl font-black rounded-3xl border-2 border-gray-100 hover:border-gray-300 hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all shadow-sm flex items-center justify-center"
                  style={{ color }}
                >
                  {kata}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}