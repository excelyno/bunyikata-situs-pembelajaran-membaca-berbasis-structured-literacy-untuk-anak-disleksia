"use client";
import { useEffect, useState } from "react";

interface Props {
  onAnswer: (target: string, answered: string, isCorrect: boolean, timeMs: number, category: string, autoAdvance?: boolean) => void;
}

export default function VisualSoal2({ onAnswer }: Props) {
  const [showWord, setShowWord] = useState(true);
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWord(false);
      setStartTime(performance.now());
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = (pilihan: string) => {
    const timeMs = Math.round(performance.now() - startTime);
    const isCorrect = pilihan === "teman";
    onAnswer("teman", pilihan, isCorrect, timeMs, "VISUAL_VOWEL");
  };

  const pilihan = ["ramah", "teman", "timun", "taman"];

  return (
    <div className="h-72 flex flex-col justify-center animate-in fade-in duration-500 w-full">
      {showWord ? (
        <div className="animate-pulse flex flex-col items-center justify-center">
          {/* Kartu kata yang muncul sejenak */}
          <div className="bg-[#FFF4E8] px-12 py-8 rounded-[30px] border-4 border-[#FDE9D2] shadow-sm mb-4">
            <h2 className="text-6xl font-black text-[#5C4D4A] tracking-widest">teman</h2>
          </div>
          <p className="text-[#8D7B68] font-medium text-lg">Ingat kata ini...</p>
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in duration-300">
          <p className="text-[#8D7B68] font-bold mb-8 text-xl">Pilih kata yang benar!</p>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {pilihan.map((kata) => (
              <button 
                key={kata} 
                onClick={() => handleClick(kata)}
                // Gaya tombol kartu khas BunyiKata: krem dengan border membal
                className="py-6 bg-[#FFF8F0] text-[#5C4D4A] text-2xl font-black rounded-3xl border-2 border-b-[6px] border-[#FDE9D2] hover:border-[#EF9550] hover:text-[#EF9550] hover:bg-[#FFF4E8] hover:-translate-y-1 active:border-b-2 active:translate-y-1 transition-all"
              >
                {kata}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}