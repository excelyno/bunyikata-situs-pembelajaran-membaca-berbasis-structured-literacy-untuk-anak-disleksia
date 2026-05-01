"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const LEVELS = [
  { target: "d", noise: "b", count: 12, title: "Mencari Si 'd'", category: "REVERSAL_BD" },
  { target: "m", noise: "n", count: 15, title: "Pesta Huruf 'n'", category: "VISUAL_SIMILARITY" },
  { target: "6", noise: "9", count: 20, title: "Angka Terbalik", category: "REVERSAL_NUMBER" },
  { target: "p", noise: "q", count: 24, title: "Hutan Huruf 'q'", category: "REVERSAL_PQ" }
];

export default function DetektifKiki() {
  const router = useRouter();
  const [levelIdx, setLevelIdx] = useState(0);
  const [gridItems, setGridItems] = useState<string[]>([]);
  const [phase, setPhase] = useState(0); 

  // --- VARIABEL PENILAIAN ---
  const [startTimeMs, setStartTimeMs] = useState<number>(0);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [logs, setLogs] = useState<any[]>([]);
  const [mistakes, setMistakes] = useState(0);

  useEffect(() => {
    if (phase === 1) {
      generateGrid();
      if (sessionStartTime === 0) setSessionStartTime(Date.now()); // Mulai timer global
    }
  }, [levelIdx, phase]);

  const generateGrid = () => {
    const level = LEVELS[levelIdx];
    const items = Array(level.count).fill(level.noise);
    const randomIndex = Math.floor(Math.random() * level.count);
    items[randomIndex] = level.target; 
    setGridItems(items);
    
    // Mulai timer (ms) untuk level ini
    setStartTimeMs(Date.now());
  };

  const handlePick = (item: string) => {
    const level = LEVELS[levelIdx];
    const responseTimeMs = Date.now() - startTimeMs; // Hitung kecepatan klik dalam ms
    const isCorrect = item === level.target;

    // Rekam log jawaban anak
    const newLog = {
      targetItem: level.target,
      answeredItem: item,
      isCorrect: isCorrect,
      responseTimeMs: responseTimeMs,
      errorCategory: level.category,
    };
    setLogs((prev) => [...prev, newLog]);

    if (isCorrect) {
      if (levelIdx < LEVELS.length - 1) {
        setLevelIdx(levelIdx + 1);
      } else {
        finishGame();
      }
    } else {
      setMistakes((prev) => prev + 1);
      alert("Wah, hampir tepat! Coba lihat lebih teliti lagi 🧐");
    }
  };

  const finishGame = async () => {
    setPhase(2); // Tampilkan layar menang
    
    const durationSec = Math.floor((Date.now() - sessionStartTime) / 1000);
    // Logika Skor: Max 100, dikurangi 5 untuk setiap kesalahan
    const score = Math.max(10, 100 - (mistakes * 5)); 

    // Ambil studentId dari localStorage atau Session (Misal kita simpan di localStorage saat login)
    // Untuk contoh ini, pastikan abang punya sistem untuk mengambil ID user aktif.
    const studentId = "ID_SISWA_DUMMY"; // Ganti dengan ID user yang login (bisa dari Context/Zustand)

    try {
      await fetch("/api/games/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: studentId,
          sessionType: "TERAPI_VISUAL_KIKI",
          durationSec: durationSec,
          score: score,
          logs: logs,
        }),
      });
      console.log("Data berhasil dikirim ke database!");
    } catch (error) {
      console.error("Gagal mengirim data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-900 p-6 flex flex-col items-center justify-center relative">
      <button onClick={() => router.push("/games/terapi/visual")} className="absolute top-6 left-6 w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center font-black text-xl backdrop-blur-md z-10">{"<"}</button>

      {phase === 0 && (
        <div className="bg-white p-10 rounded-[40px] shadow-2xl text-center max-w-lg">
          <div className="text-8xl mb-6">🦉🔍</div>
          <h1 className="text-3xl font-black text-emerald-600 mb-4">Detektif Kiki</h1>
          <button onClick={() => setPhase(1)} className="w-full bg-emerald-600 text-white py-4 rounded-3xl font-black text-xl">Mulai Mencari!</button>
        </div>
      )}

      {phase === 1 && (
        <div className="w-full max-w-2xl flex flex-col items-center">
          <div className="text-center mb-8">
            <h2 className="text-white text-3xl font-black mb-2">{LEVELS[levelIdx].title}</h2>
          </div>
          <div className="bg-white p-6 rounded-[40px] grid grid-cols-4 sm:grid-cols-6 gap-4 w-full">
            {gridItems.map((item, idx) => (
              <button key={idx} onClick={() => handlePick(item)} className="aspect-square bg-emerald-50 rounded-2xl flex items-center justify-center text-4xl font-black text-emerald-700 hover:bg-emerald-200">
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === 2 && (
        <div className="bg-white p-10 rounded-[40px] shadow-2xl text-center max-w-lg">
          <div className="text-8xl mb-6">🦉💎</div>
          <h1 className="text-4xl font-black text-emerald-600 mb-2">Hebat!</h1>
          <p className="text-gray-600 mb-4">Data permainanmu sedang diproses...</p>
          <button onClick={() => router.push("/dashboard/siswa")} className="w-full bg-emerald-600 text-white py-4 rounded-3xl font-black text-xl">Selesai Berpetualang</button>
        </div>
      )}
    </div>
  );
}