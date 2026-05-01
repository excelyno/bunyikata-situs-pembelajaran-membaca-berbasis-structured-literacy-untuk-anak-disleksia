"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { say } from "@/lib/speak";

// --- DATA SOAL ---
// Ditambah 'category' untuk keperluan Analitik Database
const LEVELS = [
  { 
    title: "Hutan Vokal", 
    soal: [
      { target: "a", options: ["a", "o"], category: "AUDITORY_VOWEL" },
      { target: "e", options: ["i", "e"], category: "AUDITORY_VOWEL" },
      { target: "u", options: ["u", "o"], category: "AUDITORY_VOWEL" }
    ]
  },
  { 
    title: "Lembah Mirip", 
    soal: [
      { target: "b", options: ["b", "d"], category: "AUDITORY_CONSONANT" },
      { target: "q", options: ["p", "q"], category: "AUDITORY_CONSONANT" },
      { target: "m", options: ["m", "n"], category: "AUDITORY_CONSONANT" }
    ]
  },
  { 
    title: "Puncak Kata", 
    soal: [
      { target: "buku", options: ["buku", "duku"], category: "AUDITORY_WORD" },
      { target: "kaki", options: ["kaki", "koki"], category: "AUDITORY_WORD" }
    ]
  }
];

export default function SingaBertarung() {
  const router = useRouter();
  const [phase, setPhase] = useState(0); // 0: Intro, 1: Battle, 2: Win
  const [levelIdx, setLevelIdx] = useState(0);
  const [soalIdx, setSoalIdx] = useState(0);
  const [hpMonster, setHpMonster] = useState(100);
  const [isWrong, setIsWrong] = useState(false);

  // --- VARIABEL PENILAIAN ---
  const [startTimeMs, setStartTimeMs] = useState<number>(0);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [logs, setLogs] = useState<any[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [repeatCount, setRepeatCount] = useState(0); // Menghitung berapa kali anak minta ulang suara

  const currentLevel = LEVELS[levelIdx];
  const currentSoal = currentLevel.soal[soalIdx];

  const playInstruction = () => {
    say(`Pilih bunyi ${currentSoal.target}`);
  };

  const handleRepeatAudio = () => {
    setRepeatCount((prev) => prev + 1);
    playInstruction();
  };

  useEffect(() => {
    if (phase === 1) {
      if (sessionStartTime === 0) setSessionStartTime(Date.now());
      
      const timer = setTimeout(() => {
        playInstruction();
        setStartTimeMs(Date.now()); // Mulai hitung waktu setelah suara selesai
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [phase, levelIdx, soalIdx]);

  const handleAnswer = (choice: string) => {
    const responseTimeMs = Date.now() - startTimeMs;
    const isCorrect = choice === currentSoal.target;

    // Rekam Analitik
    const newLog = {
      targetItem: currentSoal.target,
      answeredItem: choice,
      isCorrect: isCorrect,
      responseTimeMs: responseTimeMs,
      errorCategory: currentSoal.category,
    };
    setLogs((prev) => [...prev, newLog]);

    if (isCorrect) {
      setHpMonster((prev) => prev - (100 / currentLevel.soal.length));
      
      if (soalIdx < currentLevel.soal.length - 1) {
        setSoalIdx(soalIdx + 1);
      } else {
        if (levelIdx < LEVELS.length - 1) {
          setLevelIdx(levelIdx + 1);
          setSoalIdx(0);
          setHpMonster(100);
        } else {
          finishGame();
        }
      }
    } else {
      setMistakes((prev) => prev + 1);
      setIsWrong(true);
      say("Ups, coba dengar lagi!");
      setTimeout(() => setIsWrong(false), 500);
    }
  };

  const finishGame = async () => {
    setPhase(2);
    
    const durationSec = Math.floor((Date.now() - sessionStartTime) / 1000);
    // Logika Skor: Kurangi skor jika banyak salah ATAU banyak mengulang suara
    const penalty = (mistakes * 5) + (repeatCount * 2);
    const score = Math.max(10, 100 - penalty); 

    const studentId = "ID_SISWA_DUMMY"; // TODO: Ganti dengan ID real dari auth

    try {
      await fetch("/api/games/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: studentId,
          sessionType: "TERAPI_AUDITORI_SINGA",
          durationSec: durationSec,
          score: score,
          logs: logs,
        }),
      });
      console.log("Data Auditori berhasil dikirim!");
    } catch (error) {
      console.error("Gagal mengirim data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-purple-900 p-6 flex flex-col items-center justify-center relative overflow-hidden">
      <button onClick={() => router.push("/games/terapi/auditori")} className="absolute top-6 left-6 w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center font-black text-xl backdrop-blur-md">{"<"}</button>

      {phase === 0 && (
        <div className="bg-white p-10 rounded-[40px] shadow-2xl text-center max-w-lg">
          <div className="text-8xl mb-6">🦁🛡️</div>
          <h1 className="text-3xl font-black text-purple-600 mb-4">Singa Bertarung!</h1>
          <button onClick={() => setPhase(1)} className="w-full bg-purple-600 text-white py-4 rounded-3xl font-black text-xl">Mulai Bertarung ⚔️</button>
        </div>
      )}

      {phase === 1 && (
        <div className="w-full max-w-2xl flex flex-col items-center">
          <div className="w-full flex justify-between items-end mb-16 relative">
             <div className="text-8xl animate-pulse relative">🦁</div>
             <div className={`text-9xl transition-all duration-300 ${isWrong ? "scale-125 translate-x-[-20px]" : "animate-bounce"}`}>
                {levelIdx === 0 ? "👾" : levelIdx === 1 ? "👹" : "🐉"}
                <div className="absolute -top-10 right-0 bg-gray-200 w-24 h-3 rounded-full overflow-hidden border-2 border-white">
                    <div className="bg-red-500 h-full transition-all duration-500" style={{ width: `${hpMonster}%` }}></div>
                </div>
             </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[40px] border border-white/20 w-full flex flex-col items-center">
             <button onClick={handleRepeatAudio} className="mb-8 bg-yellow-400 p-4 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all text-3xl">
                🔊 <span className="text-sm font-black text-yellow-900 ml-2">ULANGI SUARA</span>
             </button>

             <div className="grid grid-cols-2 gap-6 w-full">
                {currentSoal.options.map((opt) => (
                   <button key={opt} onClick={() => handleAnswer(opt)} className="bg-white py-8 rounded-3xl text-5xl font-black text-purple-900 shadow-[0_8px_0_#ddd] hover:bg-purple-50 active:translate-y-2 uppercase">
                      {opt}
                   </button>
                ))}
             </div>
          </div>
        </div>
      )}

      {phase === 2 && (
        <div className="bg-white p-10 rounded-[40px] shadow-2xl text-center max-w-lg">
          <div className="text-8xl mb-6">👑🦁</div>
          <h1 className="text-4xl font-black text-purple-600 mb-2">Raja Hutan!</h1>
          <p className="text-gray-600 mb-8 font-medium">Data pertarungan sedang disimpan...</p>
          <button onClick={() => router.push("/dashboard/siswa")} className="w-full bg-green-500 text-white py-4 rounded-3xl font-black text-xl">Kembali ke Dashboard</button>
        </div>
      )}
    </div>
  );
}