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
    <div className="animate-in fade-in slide-in-from-right duration-500">
      <button onClick={() => playAudio("ikan")} className="w-24 h-24 mx-auto bg-purple-100 text-purple-600 rounded-full border-b-6 border-purple-300 active:border-b-0 transition-all flex flex-col items-center justify-center mb-6">
        <span className="text-3xl">🔊</span><span className="text-xs font-bold mt-1">ikan</span>
      </button>

      <p className="text-gray-600 font-medium mb-6 text-lg">Buang 1 kata yang bunyinya <b>TIDAK SAMA</b> dengan awalan Ikan!</p>
      
      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-6">
        {["itik", "ular", "ibu", "iguana"].map((kata) => (
          <button 
            key={kata} onClick={() => handleEliminate(kata)}
            disabled={eliminated.includes(kata)}
            className={`py-4 text-xl font-black rounded-2xl transition-all
              ${eliminated.includes(kata) 
                ? "bg-transparent text-transparent opacity-0 cursor-default" // Kata Menghilang jika dieleminasi
                : "bg-red-50 text-red-600 border-b-4 border-red-200 hover:bg-red-100 active:border-b-0"
              }`}
          >
            {kata}
          </button>
        ))}
      </div>

      {isFinished && (
        <button onClick={handleLanjut} className="bg-green-500 text-white px-8 py-3 rounded-2xl font-bold animate-bounce shadow-[0_6px_0_#166534]">
          Selesai! Lanjut
        </button>
      )}
    </div>
  );
}