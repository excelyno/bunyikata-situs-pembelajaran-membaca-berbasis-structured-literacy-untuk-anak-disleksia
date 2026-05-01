"use client";
import { useEffect, useState } from "react";

interface Props {
  onAnswer: (target: string, answered: string, isCorrect: boolean, timeMs: number, category: string, autoAdvance?: boolean) => void;
}

export default function AuditorySoal1({ onAnswer }: Props) {
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    setStartTime(performance.now());
  }, []);

  // Fungsi untuk memutar suara (Text-to-Speech)
  const playAudio = (kata: string) => {
    const speech = new SpeechSynthesisUtterance(kata);
    speech.lang = "id-ID"; // Bahasa Indonesia
    speech.rate = 0.8; // Diperlambat sedikit biar jelas
    window.speechSynthesis.speak(speech);
  };

  const handleClick = (pilihan: string) => {
    const timeMs = Math.round(performance.now() - startTime);
    const isCorrect = pilihan === "apel"; // Target awalan 'a'
    
    // Putar suara pilihan yang diklik biar anak tahu, lalu langsung pindah soal
    playAudio(pilihan);
    onAnswer("Audio_a_ayam", pilihan, isCorrect, timeMs, "AUDITORY_PHONICS", true);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right duration-500">
      <h2 className="text-3xl font-black text-gray-800 mb-4">Dengarkan Kata Ini!</h2>
      
      {/* Tombol Target Audio */}
      <button 
        onClick={() => playAudio("ayam")}
        className="w-32 h-32 mx-auto bg-purple-100 text-purple-600 rounded-full border-b-8 border-purple-300 hover:translate-y-2 active:border-b-0 transition-all flex flex-col items-center justify-center mb-8 shadow-sm"
      >
        <span className="text-5xl mb-2">🔊</span>
        <span className="font-bold text-sm">ayam</span>
      </button>

      <p className="text-gray-500 font-medium mb-6">Pilih kata yang bunyi awalannya sama!</p>
      
      <div className="flex justify-center gap-4">
        {["apel", "buku", "cacing"].map((kata) => (
          <button 
            key={kata} onClick={() => handleClick(kata)}
            className="px-6 py-4 bg-blue-50 text-blue-600 text-xl font-black rounded-3xl border-b-4 border-blue-200 hover:bg-blue-100 active:border-b-0 transition-all"
          >
            {kata}
          </button>
        ))}
      </div>
    </div>
  );
}