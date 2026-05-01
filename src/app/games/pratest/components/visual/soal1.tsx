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
    <div className="h-64 flex flex-col justify-center animate-in fade-in duration-500">
      {showWord ? (
        <div className="animate-pulse">
          <h2 className="text-6xl font-black text-gray-800 tracking-widest">rumah</h2>
          <p className="text-gray-400 mt-4 font-medium">Ingat kata ini...</p>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <p className="text-gray-500 font-medium mb-8 text-xl">Kata apa yang tadi muncul?</p>
          <div className="flex justify-center gap-6">
            {["rumha", "rumah"].map((kata) => (
              <button 
                key={kata} onClick={() => handleClick(kata)}
                className="px-8 py-6 bg-blue-50 text-blue-600 text-3xl font-black rounded-3xl border-b-8 border-blue-200 hover:bg-blue-100 hover:translate-y-2 active:border-b-0 transition-all"
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