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
    <div className="h-72 flex flex-col justify-center animate-in fade-in duration-500">
      {showWord ? (
        <div className="animate-pulse">
          <h2 className="text-6xl font-black text-gray-800 tracking-widest">teman</h2>
          <p className="text-gray-400 mt-4 font-medium">Ingat kata ini...</p>
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in duration-300">
          <p className="text-gray-500 font-medium mb-8 text-xl">Pilih kata yang benar!</p>
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            {pilihan.map((kata) => (
              <button 
                key={kata} onClick={() => handleClick(kata)}
                className="py-6 bg-blue-50 text-blue-600 text-2xl font-black rounded-3xl border-b-6 border-blue-200 hover:bg-blue-100 hover:translate-y-1 active:border-b-0 transition-all"
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