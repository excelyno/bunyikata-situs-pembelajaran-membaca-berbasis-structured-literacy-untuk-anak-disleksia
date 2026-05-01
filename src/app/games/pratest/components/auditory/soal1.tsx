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
    <div className="animate-in fade-in slide-in-from-right duration-500 w-full flex flex-col items-center">
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-[#5C4D4A] mb-2">Dengarkan Kata Ini!</h2>
        <p className="text-[#8D7B68] font-medium text-lg">Tekan tombol suara di bawah ini 🎧</p>
      </div>
      
      {/* Tombol Target Audio - Dibuat mirip kartu besar seperti di referensi desain */}
      <button 
        onClick={() => playAudio("ayam")}
        className="w-40 h-40 mx-auto bg-[#FFF8F0] text-[#EF9550] rounded-[32px] border-2 border-b-[8px] border-[#FDE9D2] hover:border-[#EF9550] hover:bg-[#FFF4E8] hover:-translate-y-2 active:border-b-2 active:translate-y-2 transition-all flex flex-col items-center justify-center mb-10 group"
      >
        <span className="text-6xl mb-2 group-hover:scale-110 transition-transform duration-300">🔊</span>
        {/* Catatan: Untuk tes audiotory sungguhan, teks "ayam" ini idealnya disembunyikan agar anak benar-benar menebak dari suara. Tapi saya pertahankan sesuai kodemu. */}
        <span className="font-bold text-lg text-[#8D7B68] group-hover:text-[#EF9550] transition-colors">ayam</span>
      </button>

      <p className="text-[#8D7B68] font-bold mb-6 text-xl text-center">
        Pilih kata yang bunyi awalannya <span className="text-[#EF9550] font-black text-2xl mx-1">sama</span>!
      </p>
      
      {/* Area Pilihan Jawaban */}
      <div className="flex flex-wrap justify-center gap-4 w-full max-w-md mx-auto">
        {["apel", "buku", "cacing"].map((kata) => (
          <button 
            key={kata} 
            onClick={() => handleClick(kata)}
            className="flex-1 min-w-[100px] py-5 bg-[#FFF8F0] text-[#5C4D4A] text-2xl font-black rounded-[20px] border-2 border-b-[6px] border-[#FDE9D2] hover:border-[#EF9550] hover:text-[#EF9550] hover:bg-[#FFF4E8] hover:-translate-y-1 active:border-b-2 active:translate-y-1 transition-all"
          >
            {kata}
          </button>
        ))}
      </div>
    </div>
  );
}