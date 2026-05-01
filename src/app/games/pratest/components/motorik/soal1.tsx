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
    <div className="animate-in fade-in zoom-in duration-500">
      <h2 className="text-4xl font-black text-gray-800 mb-2">B</h2>
      <p className="text-gray-500 font-medium mb-10 text-lg">Pilih huruf kecil yang bentuknya sama!</p>
      
      <div className="flex justify-center gap-8">
        <button 
          onClick={() => handleClick("d")}
          className="w-32 h-32 bg-blue-50 text-blue-600 text-6xl font-black rounded-3xl border-b-8 border-blue-200 hover:bg-blue-100 hover:translate-y-2 transition-all active:border-b-0 flex items-center justify-center"
        >
          d
        </button>

        <button 
          onClick={() => handleClick("b")}
          className="w-32 h-32 bg-blue-50 text-blue-600 text-6xl font-black rounded-3xl border-b-8 border-blue-200 hover:bg-blue-100 hover:translate-y-2 transition-all active:border-b-0 flex items-center justify-center"
        >
          b
        </button>
      </div>
    </div>
  );
}