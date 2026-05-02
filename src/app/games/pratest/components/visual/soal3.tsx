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
      "Grid_Eliminate_Action", 
      `clicked_${letter}`, 
      isCorrect, 
      timeMs, 
      "VISUAL_SCANNING", 
      false 
    );

    // Sekarang b maupun non-b semuanya menghilang jika diklik
    setGrid(prev => prev.map(item => item.id === id ? { ...item, visible: false } : item));
  };

  // Cek apakah semua huruf selain 'b' sudah hilang?
  const isFinished = grid.filter(item => item.letter !== 'b' && item.visible).length === 0;

  // Tombol untuk lanjut (Secara manual kita tembak onAnswer dengan autoAdvance true)
  const handleLanjut = () => {
    // 1. Ambil semua huruf yang masih tersisa di layar (visible)
    const remainingItems = grid.filter(item => item.visible);
    
    // 2. Kirim status akhir untuk setiap huruf yang tersisa
    remainingItems.forEach((item, idx) => {
      // Jika yang tersisa adalah 'b', maka itu BENAR (berhasil disisakan)
      // Jika yang tersisa adalah huruf lain, maka itu SALAH (gagal dibuang/terlewati)
      const isCorrectAction = item.letter === 'b';
      
      onAnswer(
        `Final_Check_${item.letter}_${idx}`, 
        item.letter, 
        isCorrectAction, 
        0, 
        "VISUAL_SCANNING", 
        false // Jangan pindah soal dulu
      );
    });

    // 3. Beri jeda sangat singkat agar fetch terkirim, lalu pindah soal
    setTimeout(() => {
      onAnswer("Grid_Eliminate_Done", "next", true, 0, "VISUAL_SCANNING", true);
    }, 100);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right duration-500 w-full flex flex-col items-center">
      
      {/* Target huruf yang harus disisakan, dibuat seperti kartu */}
      <div className="bg-[#FFF4E8] px-8 py-4 rounded-[20px] border-4 border-[#FDE9D2] shadow-sm mb-4">
        <h2 className="text-5xl font-black text-[#5C4D4A]">b</h2>
      </div>
      
      <p className="text-[#8D7B68] font-bold mb-8 text-xl text-center">
        Buang semua huruf KECUALI huruf <span className="text-[#EF9550] font-black text-2xl mx-1">b</span> !
      </p>
      
      <div className="grid grid-cols-3 gap-4 w-72 mx-auto mb-8">
        {grid.map((item) => (
          <button 
            key={item.id}
            onClick={() => handleBoxClick(item.id, item.letter)}
            disabled={!item.visible}
            className={`h-20 text-4xl font-black rounded-[20px] transition-all duration-300 flex items-center justify-center
              ${item.visible 
                ? "bg-[#FFF8F0] text-[#5C4D4A] border-2 border-b-[6px] border-[#FDE9D2] hover:border-[#EF9550] hover:text-[#EF9550] hover:bg-[#FFF4E8] hover:-translate-y-1 active:border-b-2 active:translate-y-1" 
                : "bg-transparent text-transparent opacity-0 cursor-default scale-50" // Efek mengecil lalu menghilang
              }`}
          >
            {item.letter}
          </button>
        ))}
      </div>

      {/* Tombol Lanjut Selalu Ada */}
      <div className="flex flex-col items-center justify-center gap-4">
        <button 
          onClick={handleLanjut}
          className="bg-[#EF9550] text-white px-10 py-4 rounded-[20px] font-black text-xl hover:bg-[#D17A20] transition-all shadow-[0_6px_0_#CB7A3E] active:translate-y-2 active:shadow-none"
        >
          Selesai! Lanjut 🚀
        </button>
        
        {!isFinished && (
          <p className="text-sm font-medium text-[#8D7B68] animate-pulse">
            👆 Klik kotak untuk membuang huruf yang salah
          </p>
        )}
      </div>
    </div>
  );
}