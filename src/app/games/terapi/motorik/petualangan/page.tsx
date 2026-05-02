"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import DrawingCanvas from "@/app/components/DrawingCanvas";
import HeroImage from "../../../../../../public/hero/gorogu-landing.png";

// --- DATA LEVEL ---
const LEVEL_1_TASKS = ["b", "d", "p", "q", "9"];
const LEVEL_2_TASKS = [
  { target: "b", options: ["b", "d"] },
  { target: "d", options: ["b", "d"] },
  { target: "m", options: ["m", "n"] },
  { target: "n", options: ["n", "m"] },
  { target: "6", options: ["6", "9"] },
];
const LEVEL_3_TASKS = [
  { type: "write", target: "m" },
  { type: "drag", target: "b", options: ["d", "p", "b"] },
  { type: "write", target: "8" },
];

// --- LOG ENTRY TYPE ---
interface LogEntry {
  targetItem: string;
  answeredItem: string;
  isCorrect: boolean;
  responseTimeMs: number;
  errorCategory: string;
}

export default function MotorikBudi() {
  const router = useRouter();

  // === STATE SCENE ===
  const [scene, setScene] = useState<
    "intro" | "lvl1" | "trans1" | "lvl2" | "trans2" | "lvl3" | "outro" | "freedraw" | "done"
  >("intro");
  const [taskIndex, setTaskIndex] = useState(0);
  const [draggedLetter, setDraggedLetter] = useState<string | null>(null);

  // === STATE SCORING ===
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const taskStartTime = useRef<number>(Date.now());
  const sessionStartTime = useRef<number>(Date.now());

  // Reset timer setiap soal/scene berubah
  useEffect(() => {
    taskStartTime.current = Date.now();
  }, [scene, taskIndex]);

  // === TTS ===
  const playAudio = (text: string) => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "id-ID";
    speech.rate = 0.9;
    window.speechSynthesis.speak(speech);
  };

  useEffect(() => {
    if (scene === "intro") playAudio("Halo! Budi ingin pergi ke suatu taman. Bantu Budi menyelesaikan soal-soal ini agar sampai di taman ya!");
    if (scene === "lvl1") playAudio(`Ayo tulis huruf ${LEVEL_1_TASKS[taskIndex]} di dalam kotak!`);
    if (scene === "trans1") playAudio("Hebat sekali! Jalan menuju taman mulai terbuka. Ayo lanjutkan!");
    if (scene === "lvl2") playAudio(`Budi kebingungan nih. Pindahkan huruf ${LEVEL_2_TASKS[taskIndex].target} ke dalam kotak kosong ya!`);
    if (scene === "trans2") playAudio("Wah, kamu pintar sekali! Tinggal satu bukit lagi di Misi Kombinasi.");
    if (scene === "lvl3") {
      const task = LEVEL_3_TASKS[taskIndex];
      if (task.type === "write") playAudio(`Tulis huruf ${task.target} ikuti garisnya!`);
      else playAudio(`Pilih dan pindahkan huruf ${task.target} dari tiga pilihan ini!`);
    }
    if (scene === "outro") playAudio("Yeay! Budi sudah sampai di taman! Sebagai penutup, tulis huruf favoritmu di sini ya!");
  }, [scene, taskIndex]);

  // === HELPER: Catat satu log ===
  const recordLog = (targetItem: string, answeredItem: string, isCorrect: boolean, errorCategory: string) => {
    const responseTimeMs = Date.now() - taskStartTime.current;
    setLogs(prev => [...prev, { targetItem, answeredItem, isCorrect, responseTimeMs, errorCategory }]);
    if (!isCorrect) setMistakes(prev => prev + 1);
  };

  // === LOGIC LEVEL 1: Menulis (DrawingCanvas) ===
  const handleNextTask_Lvl1 = (score: number) => {
    const target = LEVEL_1_TASKS[taskIndex];
    const isCorrect = score >= 40; // passThreshold
    recordLog(target, target, isCorrect, "MOTORIK_WRITE");

    if (taskIndex < LEVEL_1_TASKS.length - 1) setTaskIndex(p => p + 1);
    else { setTaskIndex(0); setScene("trans1"); }
  };

  // === LOGIC LEVEL 2: Drag & Drop ===
  const handleDrop_Lvl2 = (targetObj: { target: string; options: string[] }) => {
    const isCorrect = draggedLetter === targetObj.target;
    recordLog(targetObj.target, draggedLetter || "", isCorrect, "MOTORIK_DRAG");
    setDraggedLetter(null);

    if (isCorrect) {
      if (taskIndex < LEVEL_2_TASKS.length - 1) setTaskIndex(p => p + 1);
      else { setTaskIndex(0); setScene("trans2"); }
    } else {
      playAudio("O-ow, sepertinya itu huruf yang berbeda. Coba lihat lagi!");
    }
  };

  // === LOGIC LEVEL 3: Kombinasi ===
  const handleNextTask_Lvl3_Write = (score: number) => {
    const target = LEVEL_3_TASKS[taskIndex].target;
    recordLog(target, target, score >= 40, "MOTORIK_COMBO_WRITE");
    advanceLvl3();
  };

  const handleDrop_Lvl3 = () => {
    const target = LEVEL_3_TASKS[taskIndex].target;
    const isCorrect = draggedLetter === target;
    recordLog(target, draggedLetter || "", isCorrect, "MOTORIK_COMBO_DRAG");
    setDraggedLetter(null);

    if (isCorrect) advanceLvl3();
    else playAudio("Bukan yang itu, ayo cari lagi!");
  };

  const advanceLvl3 = () => {
    if (taskIndex < LEVEL_3_TASKS.length - 1) setTaskIndex(p => p + 1);
    else { setTaskIndex(0); setScene("outro"); }
  };

  // === LOGIC FREEDRAW: Kanvas bebas penutup ===
  const handleFreeDraw = (score: number) => {
    recordLog("FREE_DRAW", "FREE_DRAW", true, "MOTORIK_FREE");
    setScene("done");
  };

  // === SUBMIT KE BACKEND ===
  const finishGame = async () => {
    const durationSec = Math.floor((Date.now() - sessionStartTime.current) / 1000);
    const score = Math.max(10, 100 - mistakes * 5);

    try {
      await fetch("/api/games/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionType: "TERAPI_MOTORIK_BUDI",
          durationSec,
          score,
          logs,
        }),
      });
      console.log("✅ Skor Motorik Budi berhasil dikirim:", { score, durationSec, mistakes, logs });
    } catch (err) {
      console.error("❌ Gagal submit skor:", err);
    }

    router.push("/dashboard/siswa");
  };

  // === KOMPONEN VISUAL NOVEL ===
  const VNStoryScreen = ({ text, onNext }: { text: string; onNext: () => void }) => (
    <div
      className="w-full h-screen bg-cover bg-center flex flex-col justify-end relative overflow-hidden"
      style={{ backgroundImage: "url(/bg/pemandangan-background.png)" }}
    >
      <img src={HeroImage.src} alt="Budi" className="absolute bottom-20 left-10 w-64 md:w-80" />
      <div className="bg-white/75 backdrop-blur-md border-t-8 border-orange-500 p-6 md:p-8 w-full min-h-[20vh] shadow-[0_-10px_30px_rgba(0,0,0,0.1)] z-10 flex flex-col justify-between">
        <p className="text-xl md:text-2xl text-gray-900 font-bold leading-relaxed max-w-4xl">{text}</p>
        <div className="flex justify-end mt-4">
          <button onClick={onNext} className="bg-green-600 text-white px-8 py-3 rounded-full font-black text-lg shadow-[0_6px_0_#166534] active:translate-y-2 active:shadow-none hover:bg-green-700 transition-all flex items-center gap-2">
            Lanjut Petualangan <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-orange-50 font-sans flex flex-col items-center justify-center relative">
      {/* Tombol Keluar */}
      <button onClick={() => router.push("/games/terapi/motorik")} className="absolute top-6 left-6 w-12 h-12 bg-white text-orange-500 rounded-full flex items-center justify-center font-black text-xl shadow-md hover:scale-110 z-50">{"<"}</button>

      {/* Indikator Progres & Skor Live */}
      {(scene === "lvl1" || scene === "lvl2" || scene === "lvl3") && (
        <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
          <div className="bg-white rounded-2xl px-4 py-2 shadow-sm border border-orange-100 text-sm font-black text-orange-600">
            ✏️ {logs.filter(l => l.isCorrect).length} Benar
          </div>
          <div className="bg-white rounded-2xl px-4 py-2 shadow-sm border border-red-100 text-sm font-black text-red-400">
            ❌ {mistakes} Salah
          </div>
        </div>
      )}

      {/* SCENE 1: INTRO */}
      {scene === "intro" && (
        <VNStoryScreen
          text="Budi ingin pergi ke suatu taman. Tetapi dia kesepian dan ingin kamu menemani dia berpetualang. Bantu Budi menyelesaikan soal-soal ini agar Budi dan kamu sampai di taman!"
          onNext={() => setScene("lvl1")}
        />
      )}

      {/* SCENE 2: LEVEL 1 - MENULIS */}
      {scene === "lvl1" && (
        <div className="w-full max-w-2xl text-center px-4 animate-in slide-in-from-right duration-500">
          <div className="bg-orange-200 text-orange-800 px-6 py-2 rounded-full font-bold inline-block mb-6 uppercase tracking-wider">
            Level 1: Menulis (Soal {taskIndex + 1} dari {LEVEL_1_TASKS.length})
          </div>
          <DrawingCanvas watermark={LEVEL_1_TASKS[taskIndex]} onComplete={handleNextTask_Lvl1} />
        </div>
      )}

      {/* SCENE 3: TRANSISI 1 */}
      {scene === "trans1" && (
        <VNStoryScreen
          text="Budi bilang: 'Wah, tulisanmu rapi sekali! Peta ini mulai menunjukkan jalan, ayo lanjut masuk ke hutan!'"
          onNext={() => setScene("lvl2")}
        />
      )}

      {/* SCENE 4: LEVEL 2 - DRAG & DROP */}
      {scene === "lvl2" && (
        <div className="w-full max-w-2xl text-center px-4 animate-in slide-in-from-right duration-500">
          <div className="bg-green-200 text-green-800 px-6 py-2 rounded-full font-bold inline-block mb-6 uppercase tracking-wider">
            Level 2: Pindahkan Huruf (Soal {taskIndex + 1} dari {LEVEL_2_TASKS.length})
          </div>
          <p className="text-2xl font-black text-gray-700 mb-8">Pindahkan huruf yang benar ke kotak di atas!</p>
          <div className="flex justify-center mb-12">
            <div
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop_Lvl2(LEVEL_2_TASKS[taskIndex])}
              className="w-40 h-48 border-8 border-dashed border-gray-300 rounded-3xl flex items-center justify-center text-9xl font-black text-gray-200"
            >
              {LEVEL_2_TASKS[taskIndex].target}
            </div>
          </div>
          <div className="flex justify-center gap-8">
            {LEVEL_2_TASKS[taskIndex].options.map((opt, idx) => (
              <div
                key={idx}
                draggable
                onDragStart={() => setDraggedLetter(opt)}
                className="w-32 h-40 bg-white border-b-8 border-green-600 rounded-3xl flex items-center justify-center text-7xl font-black text-gray-700 cursor-grab active:cursor-grabbing hover:-translate-y-2 transition-transform shadow-lg"
              >
                {opt}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SCENE 5: TRANSISI 2 */}
      {scene === "trans2" && (
        <VNStoryScreen
          text="Budi berseru, 'Jalannya hampir sampai! Kita hanya perlu melewati rintangan kombinasi di bukit ini!'"
          onNext={() => setScene("lvl3")}
        />
      )}

      {/* SCENE 6: LEVEL 3 - KOMBINASI */}
      {scene === "lvl3" && (
        <div className="w-full max-w-2xl text-center px-4 animate-in slide-in-from-right duration-500">
          <div className="bg-purple-200 text-purple-800 px-6 py-2 rounded-full font-bold inline-block mb-6 uppercase tracking-wider">
            Level 3: Kombinasi (Soal {taskIndex + 1} dari {LEVEL_3_TASKS.length})
          </div>
          {LEVEL_3_TASKS[taskIndex].type === "write" ? (
            <DrawingCanvas watermark={LEVEL_3_TASKS[taskIndex].target} onComplete={handleNextTask_Lvl3_Write} />
          ) : (
            <>
              <p className="text-2xl font-black text-gray-700 mb-8">Pindahkan huruf yang benar ke kotak di atas!</p>
              <div className="flex justify-center mb-12">
                <div
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleDrop_Lvl3}
                  className="w-40 h-48 border-8 border-dashed border-gray-300 rounded-3xl flex items-center justify-center text-9xl font-black text-gray-200"
                >
                  {LEVEL_3_TASKS[taskIndex].target}
                </div>
              </div>
              <div className="flex justify-center gap-6">
                {LEVEL_3_TASKS[taskIndex].options?.map((opt, idx) => (
                  <div key={idx} draggable onDragStart={() => setDraggedLetter(opt)} className="w-24 h-32 bg-white border-b-8 border-purple-600 rounded-2xl flex items-center justify-center text-6xl font-black text-gray-700 cursor-grab hover:-translate-y-2 shadow-md">
                    {opt}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* SCENE 7: OUTRO */}
      {scene === "outro" && (
        <VNStoryScreen
          text="Yeay! Budi sudah sampai di taman! Budi dan kelinci sangat senang. Terima kasih sudah menemani Budi berpetualang!"
          onNext={() => setScene("freedraw")}
        />
      )}

      {/* SCENE 8: FREE DRAW PENUTUP */}
      {scene === "freedraw" && (
        <div className="w-full max-w-2xl text-center px-4">
          <h1 className="text-4xl font-black text-green-700 mb-4">Tulis Huruf Favoritmu!</h1>
          <p className="text-gray-600 mb-8 font-medium">Sebagai kenang-kenangan, tulis huruf kesukaanmu di kanvas ini.</p>
          <DrawingCanvas watermark="" onComplete={handleFreeDraw} />
        </div>
      )}

      {/* SCENE 9: SELESAI */}
      {scene === "done" && (
        <div className="bg-white p-12 rounded-[40px] shadow-2xl text-center max-w-lg animate-in zoom-in">
          <div className="text-8xl mb-6 animate-bounce">🌟</div>
          <h1 className="text-4xl font-black text-orange-600 mb-2">Petualangan Selesai!</h1>

          {/* Ringkasan Skor */}
          <div className="grid grid-cols-3 gap-4 my-6">
            <div className="bg-orange-50 rounded-2xl p-3 border border-orange-100">
              <p className="text-2xl font-black text-orange-600">{Math.max(10, 100 - mistakes * 5)}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Skor</p>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-100">
              <p className="text-2xl font-black text-emerald-600">{logs.filter(l => l.isCorrect).length}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Benar</p>
            </div>
            <div className="bg-red-50 rounded-2xl p-3 border border-red-100">
              <p className="text-2xl font-black text-red-500">{mistakes}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Salah</p>
            </div>
          </div>

          <p className="text-gray-500 font-medium mb-6">
            {mistakes === 0 ? "Sempurna! Tidak ada kesalahan sama sekali 🎉" : `Kamu membuat ${mistakes} kesalahan. Terus berlatih ya!`}
          </p>

          <button
            onClick={finishGame}
            className="w-full bg-orange-500 text-white py-4 rounded-3xl font-black text-xl shadow-[0_8px_0_#c2410c] hover:bg-orange-600 active:translate-y-2 active:shadow-none transition-all"
          >
            Selesai & Simpan Nilai ✨
          </button>
        </div>
      )}
    </div>
  );
}