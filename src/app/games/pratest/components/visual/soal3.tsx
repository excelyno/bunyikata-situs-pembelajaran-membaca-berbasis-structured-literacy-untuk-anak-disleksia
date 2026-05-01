"use client";
import { useEffect, useState } from "react";

interface Props {
  onAnswer: (target: string, answered: string, isCorrect: boolean, timeMs: number, category: string, autoAdvance?: boolean) => void;
}

export default function VisualSoal3({ onAnswer }: Props) {
  const [startTime, setStartTime] = useState<number>(0);
  // Grid 9 huruf. Kita taruh 2 huruf 'b', sisanya pengganggu
  const [grid, setGrid] = useState([
    { id: 0, letter: 'd', visible: true }, { id: 1, letter: 'b', visible: true }, { id: 2, letter: 'q', visible: true },
    { id: 3, letter: 'p', visible: true }, { id: 4, letter: 'd', visible: true }, { id: 5, letter: 'b', visible: true },
    { id: 6, letter: 'q', visible: true }, { id: 7, letter: 'd', visible: true }, { id: 8, letter: 'p', visible: true },
  ]);

  useEffect(() => {
    setStartTime(performance.now());
  }, []);

  const handleBoxClick = (id: number, letter: string) => {
    const timeMs = Math.round(performance.now() - startTime);
    
    // Kalau anak nekan 'b', berarti SALAH karena 'b' harus disisakan
    const isCorrect = letter !== 'b'; 

    // Kirim data ke DB tanpa memindah ke soal selanjutnya (autoAdvance = false)
    onAnswer(
      "Grid_Eliminate_Not_b", 
      `clicked_${letter}`, 
      isCorrect, 
      timeMs, 
      "VISUAL_SCANNING", 
      false 
    );

    // Kalau benar (bukan 'b'), hilangkan hurufnya dari layar
    if (isCorrect) {
      setGrid(prev => prev.map(item => item.id === id ? { ...item, visible: false } : item));
    }
  };

  // Cek apakah semua huruf selain 'b' sudah hilang?
  const isFinished = grid.filter(item => item.letter !== 'b' && item.visible).length === 0;

  // Tombol untuk lanjut (Secara manual kita tembak onAnswer dengan autoAdvance true)
  const handleLanjut = () => {
    onAnswer("Grid_Eliminate_Finished", "finished", true, 0, "VISUAL_SCANNING", true);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right duration-500">
      <h2 className="text-4xl font-black text-gray-800 mb-2">B</h2>
      <p className="text-gray-500 font-medium mb-6 text-lg">Buang semua huruf KECUALI huruf <b>b</b> !</p>
      
      <div className="grid grid-cols-3 gap-3 w-64 mx-auto mb-6">
        {grid.map((item) => (
          <button 
            key={item.id}
            onClick={() => handleBoxClick(item.id, item.letter)}
            disabled={!item.visible}
            className={`h-20 text-4xl font-black rounded-2xl transition-all duration-300 flex items-center justify-center
              ${item.visible 
                ? "bg-blue-50 text-blue-600 border-b-4 border-blue-200 hover:bg-blue-100 active:border-b-0 active:translate-y-1" 
                : "bg-transparent text-transparent opacity-0 cursor-default" // Menghilang
              }`}
          >
            {item.letter}
          </button>
        ))}
      </div>

      {isFinished ? (
        <button 
          onClick={handleLanjut}
          className="bg-green-500 text-white px-8 py-3 rounded-2xl font-bold text-xl animate-bounce shadow-[0_6px_0_#166534]"
        >
          Selesai! Lanjut
        </button>
      ) : (
        <p className="text-sm text-gray-400">Klik kotak untuk menghapusnya...</p>
      )}
    </div>
  );
}