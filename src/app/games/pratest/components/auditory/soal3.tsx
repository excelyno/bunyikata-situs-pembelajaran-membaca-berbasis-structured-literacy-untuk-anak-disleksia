"use client";
import { useEffect, useState } from "react";

interface Props {
  onAnswer: (target: string, answered: string, isCorrect: boolean, timeMs: number, category: string, autoAdvance?: boolean) => void;
}

export default function AuditorySoal3({ onAnswer }: Props) {
  const [startTime, setStartTime] = useState<number>(0);
  const [eliminated, setEliminated] = useState<string[]>([]);

  useEffect(() => {
    setStartTime(performance.now());
  }, []);

  const playAudio = (kata: string) => {
    const speech = new SpeechSynthesisUtterance(kata);
    speech.lang = "id-ID";
    window.speechSynthesis.speak(speech);
  };

  const handleEliminate = (kata: string) => {
    playAudio(kata);
    const timeMs = Math.round(performance.now() - startTime);
    
    // Jawaban benar jika dia mengeliminasi 'ular' (bukan awalan 'i')
    const isCorrect = kata === "ular"; 

    setEliminated((prev) => [...prev, kata]);
    onAnswer("Audio_i_eliminate", `eliminated_${kata}`, isCorrect, timeMs, "AUDITORY_PHONICS", false);
  };

  const isFinished = eliminated.includes("ular");

  const handleLanjut = () => {
    onAnswer("Audio_i_Finished", "finished", true, 0, "AUDITORY_PHONICS", true);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right duration-500 w-full flex flex-col items-center">
      
      {/* Tombol Audio Target */}
      <button 
        onClick={() => playAudio("ikan")} 
        className="w-32 h-32 mx-auto bg-[#FFF8F0] text-[#EF9550] rounded-[24px] border-2 border-b-[6px] border-[#FDE9D2] hover:border-[#EF9550] hover:bg-[#FFF4E8] hover:-translate-y-1 active:border-b-2 active:translate-y-1 transition-all flex flex-col items-center justify-center mb-6 group"
      >
        <span className="text-5xl group-hover:scale-110 transition-transform duration-300">🔊</span>
        <span className="font-bold text-sm text-[#8D7B68] mt-2 group-hover:text-[#EF9550] transition-colors">ikan</span>
      </button>

      <p className="text-[#8D7B68] font-bold mb-8 text-xl text-center">
        Buang 1 kata yang bunyinya <span className="text-white bg-[#EF9550] px-3 py-1 rounded-xl font-black text-xl mx-1 shadow-sm transform -rotate-2 inline-block">TIDAK SAMA</span> dengan awalan <span className="text-[#5C4D4A] font-black">ikan</span>!
      </p>
      
      {/* Area Pilihan Jawaban */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-sm mx-auto mb-8">
        {["itik", "ular", "ibu", "iguana"].map((kata) => (
          <button 
            key={kata} 
            onClick={() => handleEliminate(kata)}
            disabled={eliminated.includes(kata)}
            className={`py-6 text-2xl font-black rounded-[20px] transition-all duration-300 flex flex-col items-center border-2
              ${eliminated.includes(kata) 
                ? "bg-transparent text-transparent border-transparent opacity-0 scale-50 pointer-events-none cursor-default" // Mengecil lalu menghilang tanpa jejak
                : "bg-[#FFF8F0] text-[#5C4D4A] border-b-[6px] border-[#FDE9D2] hover:border-[#EF9550] hover:text-[#EF9550] hover:bg-[#FFF4E8] hover:-translate-y-1 active:border-b-2 active:translate-y-1"
              }`}
          >
            {kata}
          </button>
        ))}
      </div>

      {/* Area Tombol Lanjut agar layout tidak lompat */}
      <div className="h-16 flex items-center justify-center">
        {isFinished ? (
          <button 
            onClick={handleLanjut} 
            className="bg-[#EF9550] text-white px-10 py-4 rounded-[20px] font-black text-xl hover:bg-[#D17A20] transition-all shadow-[0_6px_0_#CB7A3E] active:translate-y-2 active:shadow-none animate-bounce"
          >
            Selesai! Lanjut 🚀
          </button>
        ) : (
          <p className="text-sm font-medium text-[#8D7B68] bg-[#FDE9D2]/50 px-4 py-2 rounded-full">
            👆 Klik kata yang salah untuk membuangnya
          </p>
        )}
      </div>
    </div>
  );
}