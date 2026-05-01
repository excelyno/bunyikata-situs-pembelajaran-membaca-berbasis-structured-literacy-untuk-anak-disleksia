"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// --- DATA LEVEL ---
const LEVELS = [
  { word: "BUDI", jumbled: ["D", "I", "U", "B"], category: "MOTORIC_WORD_4" },
  { word: "BOLA", jumbled: ["L", "A", "O", "B"], category: "MOTORIC_WORD_4" },
  { word: "PINTU", jumbled: ["N", "T", "I", "U", "P"], category: "MOTORIC_WORD_5" },
];

export default function MotorikBudi() {
  const router = useRouter();
  const [phase, setPhase] = useState(0); // 0: Intro, 1: Main, 2: Tamat
  const [levelIdx, setLevelIdx] = useState(0);
  
  const [targetWord, setTargetWord] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [placedLetters, setPlacedLetters] = useState<(string | null)[]>([]);
  const [draggedLetter, setDraggedLetter] = useState<string | null>(null);

  // --- VARIABEL PENILAIAN (UNIVERSAL SCORING) ---
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [startTimeMs, setStartTimeMs] = useState<number>(0);
  const [logs, setLogs] = useState<any[]>([]);
  const [mistakes, setMistakes] = useState(0);

  useEffect(() => {
    if (phase === 1) {
      if (sessionStartTime === 0) setSessionStartTime(Date.now());
      setupLevel();
    }
  }, [phase, levelIdx]);

  const setupLevel = () => {
    const lvl = LEVELS[levelIdx];
    setTargetWord(lvl.word.split(""));
    setAvailableLetters([...lvl.jumbled]);
    setPlacedLetters(Array(lvl.word.length).fill(null));
    setStartTimeMs(Date.now()); // Mulai timer untuk penempatan huruf pertama
  };

  // Fungsi untuk Drag & Drop
  const handleDragStart = (letter: string) => {
    setDraggedLetter(letter);
  };

  const handleDrop = (index: number) => {
    if (!draggedLetter) return;

    const expectedLetter = targetWord[index];
    const responseTimeMs = Date.now() - startTimeMs;
    const isCorrect = draggedLetter === expectedLetter;

    // Rekam Log Analitik
    const newLog = {
      targetItem: expectedLetter,
      answeredItem: draggedLetter,
      isCorrect: isCorrect,
      responseTimeMs: responseTimeMs,
      errorCategory: LEVELS[levelIdx].category,
    };
    setLogs((prev) => [...prev, newLog]);

    if (isCorrect) {
      // Masukkan huruf ke kotak
      const newPlaced = [...placedLetters];
      newPlaced[index] = draggedLetter;
      setPlacedLetters(newPlaced);

      // Hapus huruf dari daftar pilihan
      setAvailableLetters((prev) => {
        const idx = prev.indexOf(draggedLetter);
        if (idx !== -1) {
          const newArr = [...prev];
          newArr.splice(idx, 1);
          return newArr;
        }
        return prev;
      });

      setDraggedLetter(null);
      setStartTimeMs(Date.now()); // Reset timer untuk huruf berikutnya

      // Cek apakah level selesai (semua kotak terisi)
      if (!newPlaced.includes(null)) {
        setTimeout(() => {
          if (levelIdx < LEVELS.length - 1) {
            setLevelIdx(levelIdx + 1);
          } else {
            finishGame();
          }
        }, 1000);
      }
    } else {
      // Salah Taruh
      setMistakes((prev) => prev + 1);
      alert("Wah, sepertinya huruf itu bukan untuk kotak yang ini. Coba lagi! 🧱");
      setDraggedLetter(null);
    }
  };

  const finishGame = async () => {
    setPhase(2);
    
    const durationSec = Math.floor((Date.now() - sessionStartTime) / 1000);
    // Logika Skor: Setiap salah mengurangi 5 poin
    const score = Math.max(10, 100 - (mistakes * 5)); 
    
    const studentId = "ID_SISWA_DUMMY"; // TODO: Integrasi dengan ID User yang login

    try {
      await fetch("/api/games/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: studentId,
          sessionType: "TERAPI_MOTORIK_BUDI",
          durationSec: durationSec,
          score: score,
          logs: logs,
        }),
      });
      console.log("Data Motorik berhasil dikirim!");
    } catch (error) {
      console.error("Gagal mengirim data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 p-6 flex flex-col items-center justify-center relative">
      <button onClick={() => router.push("/games/terapi/motorik")} className="absolute top-6 left-6 w-12 h-12 bg-white text-orange-500 rounded-full flex items-center justify-center font-black text-xl shadow-md hover:scale-110 transition-all z-10">{"<"}</button>

      {phase === 0 && (
        <div className="bg-white p-10 rounded-[40px] shadow-2xl text-center max-w-lg">
          <div className="text-8xl mb-6 animate-bounce">🧱</div>
          <h1 className="text-3xl font-black text-orange-600 mb-4">Pembangun Kata</h1>
          <p className="text-gray-600 mb-8 font-medium">Bantu Budi menyusun balok-balok huruf ini menjadi sebuah kata yang benar!</p>
          <button onClick={() => setPhase(1)} className="w-full bg-orange-500 text-white py-4 rounded-3xl font-black text-xl shadow-[0_8px_0_#c2410c] active:translate-y-2 active:shadow-none transition-all">Mulai Membangun 🏗️</button>
        </div>
      )}

      {phase === 1 && (
        <div className="w-full max-w-3xl flex flex-col items-center">
          <div className="bg-orange-200 text-orange-800 px-4 py-1 rounded-full text-sm font-bold inline-block mb-8 uppercase tracking-wider">
            Level {levelIdx + 1}
          </div>

          {/* KOTAK TARGET DROP */}
          <div className="flex gap-4 mb-16">
            {placedLetters.map((letter, idx) => (
              <div 
                key={idx} 
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(idx)}
                className={`w-20 h-24 sm:w-24 sm:h-28 rounded-2xl border-4 border-dashed flex items-center justify-center text-5xl font-black transition-all ${
                  letter ? "bg-orange-500 border-orange-600 text-white scale-110 shadow-lg" : "border-orange-300 bg-orange-100 text-transparent"
                }`}
              >
                {letter || targetWord[idx]}
              </div>
            ))}
          </div>

          {/* BALOK HURUF YG BISA DI-DRAG */}
          <p className="text-orange-800 font-bold mb-4">Tarik balok di bawah ini ke kotak yang tepat:</p>
          <div className="flex flex-wrap justify-center gap-4">
            {availableLetters.map((letter, idx) => (
              <div
                key={idx}
                draggable
                onDragStart={() => handleDragStart(letter)}
                className="w-20 h-24 sm:w-24 sm:h-28 bg-white border-b-8 border-orange-200 rounded-2xl flex items-center justify-center text-5xl font-black text-orange-600 cursor-grab active:cursor-grabbing hover:-translate-y-2 transition-transform shadow-sm"
              >
                {letter}
              </div>
            ))}
          </div>
        </div>
      )}

      {phase === 2 && (
        <div className="bg-white p-10 rounded-[40px] shadow-2xl text-center max-w-lg">
          <div className="text-8xl mb-6">🏆</div>
          <h1 className="text-4xl font-black text-orange-600 mb-2">Arsitek Hebat!</h1>
          <p className="text-gray-600 mb-8 font-medium text-lg">Semua kata berhasil disusun. Data permainanmu telah disimpan dengan aman.</p>
          <button onClick={() => router.push("/dashboard/siswa")} className="w-full bg-orange-500 text-white py-4 rounded-3xl font-black text-xl shadow-[0_8px_0_#c2410c] active:translate-y-2 active:shadow-none transition-all">Selesai Berpetualang</button>
        </div>
      )}
    </div>
  );
}