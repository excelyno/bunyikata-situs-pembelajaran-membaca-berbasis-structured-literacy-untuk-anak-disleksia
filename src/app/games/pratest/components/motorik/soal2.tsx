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
    <div className="animate-in fade-in slide-in-from-right duration-500">
      <h2 className="text-5xl font-black text-gray-800 mb-2">D</h2>
      <p className="text-gray-500 font-medium mb-10 text-lg">Cari teman kecilnya!</p>
      
      <div className="grid grid-cols-2 gap-6 max-w-xs mx-auto">
        {pilihan.map((huruf) => (
          <button 
            key={huruf}
            onClick={() => handleClick(huruf)}
            className="h-24 bg-blue-50 text-blue-600 text-5xl font-black rounded-3xl border-b-8 border-blue-200 hover:bg-blue-100 hover:translate-y-1 active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center"
          >
            {huruf}
          </button>
        ))}
      </div>
    </div>
  );
}