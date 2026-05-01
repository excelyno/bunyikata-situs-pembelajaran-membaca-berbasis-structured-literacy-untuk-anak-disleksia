"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DrawingCanvas from "@/app/components/DrawingCanvas";

// --- DATA SOAL ---
const LEVEL_1_SOAL = ["b", "d", "p", "q", "9"];
const LEVEL_2_SOAL = [
  { target: "b", options: ["d", "b"] },
  { target: "d", options: ["d", "p"] },
  { target: "m", options: ["n", "m"] },
  { target: "n", options: ["n", "u"] },
  { target: "6", options: ["9", "6"] }
];
const LEVEL_3_SOAL = [
  { type: "tulis", target: "g" },
  { type: "pindah", target: "p", options: ["b", "d", "p"] },
  { type: "pindah", target: "q", options: ["g", "p", "q"] }
];

export default function PetualanganBudi() {
  const router = useRouter();
  
  // 0: Intro | 1: Lvl 1 | 2: Transisi Lvl 2 | 3: Lvl 2 | 4: Transisi Lvl 3 | 5: Lvl 3 | 6: Tamat
  const [phase, setPhase] = useState<number>(0);
  const [soalIndex, setSoalIndex] = useState<number>(0);
  const [placedLetter, setPlacedLetter] = useState<string | null>(null);
  const [isWrong, setIsWrong] = useState<boolean>(false);

  // --- HANDLERS ---
  const handleLanjutLvl1 = () => {
    if (soalIndex < LEVEL_1_SOAL.length - 1) setSoalIndex(soalIndex + 1);
    else { setPhase(2); setSoalIndex(0); }
  };

  const handleCekJawabanLvl2 = () => {
    if (placedLetter === LEVEL_2_SOAL[soalIndex].target) {
      if (soalIndex < LEVEL_2_SOAL.length - 1) { setPlacedLetter(null); setSoalIndex(soalIndex + 1); }
      else { setPhase(4); setPlacedLetter(null); setSoalIndex(0); }
    } else { setIsWrong(true); setTimeout(() => setPlacedLetter(null), 800); }
  };

  const handleCekJawabanLvl3 = () => {
    const soal = LEVEL_3_SOAL[soalIndex];
    if (soal.type === "tulis") {
      setSoalIndex(soalIndex + 1);
    } else {
      if (placedLetter === soal.target) {
        if (soalIndex < LEVEL_3_SOAL.length - 1) { setPlacedLetter(null); setSoalIndex(soalIndex + 1); }
        else { setPhase(6); } // Tamat!
      } else { setIsWrong(true); setTimeout(() => setPlacedLetter(null), 800); }
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 p-6 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Tombol Back */}
      <button onClick={() => router.push("/games/terapi/motorik")} className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center font-black text-xl text-orange-500 shadow-sm z-50">{"<"}</button>

      {/* PHASE 0: INTRO */}
      {phase === 0 && (
        <div className="bg-white max-w-2xl p-10 rounded-[40px] shadow-xl text-center animate-in zoom-in">
          <div className="text-8xl mb-6">👦🏽🎒</div>
          <h1 className="text-3xl font-black text-orange-600 mb-6">Halo Pahlawan!</h1>
          <p className="text-xl text-gray-600 mb-10">"Budi ingin pergi ke taman. Bantu dia menyelesaikan soal agar sampai tujuan!"</p>
          <button onClick={() => setPhase(1)} className="bg-orange-500 text-white px-10 py-4 rounded-3xl font-black text-2xl shadow-[0_8px_0_#c2410c] active:translate-y-2 active:shadow-none transition-all">Mulai Petualangan!</button>
        </div>
      )}

      {/* PHASE 1: LEVEL 1 (MENULIS) */}
      {phase === 1 && (
        <div className="w-full max-w-md animate-in slide-in-from-right flex flex-col items-center">
          <div className="bg-orange-200 text-orange-800 px-6 py-2 rounded-full font-bold text-sm mb-6">Level 1: Menulis (Soal {soalIndex + 1}/5)</div>
          <div className="bg-white p-8 rounded-[40px] shadow-xl w-full text-center">
            <h2 className="text-xl font-bold text-gray-500 mb-2">Tuliskan:</h2>
            <div className="text-7xl font-black text-orange-500 mb-6">{LEVEL_1_SOAL[soalIndex]}</div>
            <DrawingCanvas />
            <button onClick={handleLanjutLvl1} className="mt-8 w-full bg-green-500 text-white py-4 rounded-2xl font-black text-xl shadow-[0_6px_0_#166534] active:translate-y-2 transition-all">Lanjut! 🏃‍♂️</button>
          </div>
        </div>
      )}

      {/* PHASE 2 & 4: TRANSISI */}
      {(phase === 2 || phase === 4) && (
        <div className="bg-white max-w-lg p-10 rounded-[40px] shadow-xl text-center animate-in zoom-in">
           <div className="text-6xl mb-4">{phase === 2 ? "🧩" : "🔥"}</div>
           <h2 className="text-3xl font-black text-orange-600 mb-4">Level {phase === 2 ? "1" : "2"} Selesai!</h2>
           <p className="text-lg text-gray-600 mb-8">{phase === 2 ? "Sekarang bantu Budi pindahkan huruf!" : "Satu rintangan lagi sebelum sampai taman!"}</p>
           <button onClick={() => setPhase(phase + 1)} className="bg-orange-500 text-white px-10 py-4 rounded-3xl font-black text-2xl shadow-[0_8px_0_#c2410c] active:translate-y-2 transition-all">Gas Terus! 🚀</button>
        </div>
      )}

      {/* PHASE 3: LEVEL 2 (PINDAH 2 OPSI) */}
      {phase === 3 && (
        <div className="w-full max-w-md animate-in slide-in-from-right flex flex-col items-center">
          <div className="bg-orange-200 text-orange-800 px-6 py-2 rounded-full font-bold text-sm mb-6">Level 2: Kotak Ajaib ({soalIndex + 1}/5)</div>
          <div className="bg-white p-8 rounded-[40px] shadow-xl w-full flex flex-col items-center text-center">
            <div className={`w-32 h-32 border-4 border-dashed rounded-3xl mb-8 flex items-center justify-center text-7xl font-black ${isWrong ? "border-red-400 bg-red-50 text-red-500 animate-bounce" : "border-orange-300 bg-orange-50 text-orange-600"}`}>
              {placedLetter || "?"}
            </div>
            <div className="flex gap-4 w-full">
              {LEVEL_2_SOAL[soalIndex].options.map((opt, i) => (
                <button key={i} onClick={() => {setPlacedLetter(opt); setIsWrong(false);}} className="flex-1 bg-white border-4 border-orange-100 h-20 rounded-2xl text-4xl font-black hover:border-orange-400 transition-all">{opt}</button>
              ))}
            </div>
            {placedLetter && <button onClick={handleCekJawabanLvl2} className="mt-8 w-full bg-blue-500 text-white py-4 rounded-2xl font-black text-xl shadow-[0_6px_0_#1e3a8a] active:translate-y-2 transition-all">Cek!</button>}
          </div>
        </div>
      )}

      {/* PHASE 5: LEVEL 3 (KOMBINASI + 3 OPSI) */}
      {phase === 5 && (
        <div className="w-full max-w-md animate-in slide-in-from-right flex flex-col items-center">
          <div className="bg-orange-200 text-orange-800 px-6 py-2 rounded-full font-bold text-sm mb-6">Level 3: Jembatan Terakhir ({soalIndex + 1}/3)</div>
          <div className="bg-white p-8 rounded-[40px] shadow-xl w-full flex flex-col items-center text-center">
            {LEVEL_3_SOAL[soalIndex].type === "tulis" ? (
              <>
                <h2 className="text-xl font-bold text-gray-500 mb-2">Tuliskan:</h2>
                <div className="text-7xl font-black text-orange-500 mb-6">{LEVEL_3_SOAL[soalIndex].target}</div>
                <DrawingCanvas />
              </>
            ) : (
              <>
                <div className={`w-32 h-32 border-4 border-dashed rounded-3xl mb-8 flex items-center justify-center text-7xl font-black ${isWrong ? "border-red-400 bg-red-50 animate-bounce" : "border-orange-300 bg-orange-50"}`}>{placedLetter || "?"}</div>
                <div className="flex gap-2 w-full">
                  {LEVEL_3_SOAL[soalIndex].options?.map((opt, i) => (
                    <button key={i} onClick={() => {setPlacedLetter(opt); setIsWrong(false);}} className="flex-1 bg-white border-2 border-orange-100 h-16 rounded-xl text-3xl font-black hover:border-orange-400 transition-all">{opt}</button>
                  ))}
                </div>
              </>
            )}
            <button onClick={handleCekJawabanLvl3} className="mt-8 w-full bg-green-500 text-white py-4 rounded-2xl font-black text-xl shadow-[0_6px_0_#166534] active:translate-y-2 transition-all">Lanjut!</button>
          </div>
        </div>
      )}

      {/* PHASE 6: TAMAT (TAMAN) */}
      {phase === 6 && (
        <div className="bg-white max-w-2xl w-full p-10 rounded-[40px] shadow-xl text-center animate-in zoom-in flex flex-col items-center">
          <div className="text-9xl mb-6">🌳🎡🌻</div>
          <h1 className="text-4xl font-black text-green-600 mb-4">Horeee! Sampai!</h1>
          <p className="text-xl text-gray-600 mb-8 font-medium">"Terima kasih sudah menemaniku! Sekarang, tuliskan satu huruf favoritmu di sini sebagai kenang-kenangan!"</p>
          <DrawingCanvas />
          <button onClick={() => router.push("/dashboard/siswa")} className="mt-10 bg-indigo-600 text-white px-10 py-4 rounded-3xl font-black text-2xl shadow-[0_8px_0_#312e81] active:translate-y-2 transition-all">Kembali ke Dashboard</button>
        </div>
      )}

    </div>
  );
}