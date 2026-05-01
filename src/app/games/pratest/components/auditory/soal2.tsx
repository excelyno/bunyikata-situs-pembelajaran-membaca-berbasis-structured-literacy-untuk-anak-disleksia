"use client";
import { useEffect, useState } from "react";

interface Props {
  onAnswer: (target: string, answered: string, isCorrect: boolean, timeMs: number, category: string, autoAdvance?: boolean) => void;
}

export default function AuditorySoal2({ onAnswer }: Props) {
  const [startTime, setStartTime] = useState<number>(0);
  const [clickedItems, setClickedItems] = useState<string[]>([]);

  useEffect(() => {
    setStartTime(performance.now());
  }, []);

  const playAudio = (kata: string) => {
    const speech = new SpeechSynthesisUtterance(kata);
    speech.lang = "id-ID";
    speech.rate = 0.8;
    window.speechSynthesis.speak(speech);
  };

  const handleBoxClick = (kata: string) => {
    if (clickedItems.includes(kata)) return; // Jangan catat 2x kalau diklik lagi
    
    playAudio(kata);
    const timeMs = Math.round(performance.now() - startTime);
    const isCorrect = kata === "kunci" || kata === "kursi"; 

    setClickedItems((prev) => [...prev, kata]);
    onAnswer("Audio_k_kacang", kata, isCorrect, timeMs, "AUDITORY_PHONICS", false);
  };

  // Cek apakah 2 jawaban benar sudah ditebak
  const isFinished = clickedItems.includes("kunci") && clickedItems.includes("kursi");

  const handleLanjut = () => {
    onAnswer("Audio_k_Finished", "finished", true, 0, "AUDITORY_PHONICS", true);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right duration-500">
      <button onClick={() => playAudio("kacang")} className="w-24 h-24 mx-auto bg-purple-100 text-purple-600 rounded-full border-b-6 border-purple-300 active:border-b-0 transition-all flex items-center justify-center mb-6">
        <span className="text-4xl">🔊</span>
      </button>

      <p className="text-gray-600 font-medium mb-6 text-lg">Pilih <b>2 kata</b> yang awalan bunyinya sama dengan <b>Kacang</b>!</p>
      
      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-6">
        {["kunci", "bisa", "lele", "kursi"].map((kata) => (
          <button 
            key={kata} onClick={() => handleBoxClick(kata)}
            disabled={clickedItems.includes(kata)}
            className={`py-4 text-xl font-black rounded-2xl transition-all flex flex-col items-center
              ${clickedItems.includes(kata) 
                ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50" // Meredup kalau sudah diklik
                : "bg-blue-50 text-blue-600 border-b-4 border-blue-200 hover:bg-blue-100 active:border-b-0"
              }`}
          >
            {kata}
          </button>
        ))}
      </div>

      {isFinished && (
        <button onClick={handleLanjut} className="bg-green-500 text-white px-8 py-3 rounded-2xl font-bold animate-bounce shadow-[0_6px_0_#166534]">
          Hebat! Lanjut
        </button>
      )}
    </div>
  );
}