"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { say } from "@/lib/speak";
import DrawingCanvas from "@/app/components/DrawingCanvas";

/* =========================================================
   DATA DEFINISI TUGAS — LEVEL 1, 2, 3
   ========================================================= */
const LEVEL_1_TASKS = [
  { voice: "S", options: ["S", "I", "N", "G"] },
  { voice: "I", options: ["A", "I", "U", "E"] },
  { voice: "N", options: ["N", "M", "L", "K"] },
  { voice: "G", options: ["B", "G", "F", "H"] },
  { voice: "A", options: ["A", "O", "U", "I"] },
];

const LEVEL_2_TASKS = [
  { voice: "Aku",   options: ["Aku",   "Apel",  "Alas",   "Anek"] },
  { voice: "Kamu",  options: ["Kamu",  "Kapal", "Kertas", "Keda"] },
  { voice: "Kita",  options: ["Kita",  "Kipas", "Kali",   "Kerja"] },
  { voice: "Pasti", options: ["Pasti", "Papan", "Padi",   "Peda"] },
  { voice: "Bisa",  options: ["Bisa",  "Bulan", "Batu",   "Bulu"] },
];

/* --- Level 3 discriminated union --- */
interface Level3AnimalTask {
  type: "animal";
  img: string;
  voice: string;
  options: string[];
}
interface Level3WordTask {
  type: "word";
  display: string;
  voice: string;
  options: string[];
}
type Level3Task = Level3AnimalTask | Level3WordTask;

const LEVEL_3_TASKS: Level3Task[] = [
  {
    type: "animal",
    img: "/hero/gorogu-landing.png",
    voice: "Kucing",
    options: ["Kucing", "Kunci"],
  },
  {
    type: "animal",
    img: "/hero/gorogu-landing.png",
    voice: "Ayam",
    options: ["Ayam", "Ajam"],
  },
  {
    type: "word",
    display: "P E N S I L",
    voice: "Pensil",
    options: ["Pensil", "Pinsil"],
  },
  {
    type: "word",
    display: "T A R U N G",
    voice: "Tarung",
    options: ["Tarung", "Tarang"],
  },
  {
    type: "word",
    display: "B O N E K A",
    voice: "Boneka",
    options: ["Boneka", "Bonike"],
  },
];

/* =========================================================
   LOG ENTRY TYPE (konsisten dgn game lain)
   ========================================================= */
interface LogEntry {
  targetItem: string;
  answeredItem: string;
  isCorrect: boolean;
  responseTimeMs: number;
  errorCategory: string;
}

/* =========================================================
   HEWAN LAWAN PER SOAL — cerita VN
   ========================================================= */
const OPPONENTS = ["🐍 Ular", "🦅 Elang", "🐊 Buaya", "🐻 Beruang", "🐉 Naga"];

/* =========================================================
   COMPONENT UTAMA
   ========================================================= */
export default function AuditoriBertarung() {
  const router = useRouter();

  const [scene, setScene] = useState<
    "intro" | "lvl1" | "trans1" | "lvl2" | "trans2" | "lvl3" | "outro" | "done"
  >("intro");
  const [taskIdx, setTaskIdx] = useState(0);

  // Scoring
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const taskStart = useRef<number>(Date.now());
  const sessionStart = useRef<number>(Date.now());

  // Flash feedback
  const [flash, setFlash] = useState<"correct" | "wrong" | null>(null);

  /* --- Reset timer setiap soal --- */
  useEffect(() => {
    taskStart.current = Date.now();
  }, [scene, taskIdx]);

  /* --- Auto‑play narasi --- */
  useEffect(() => {
    if (scene === "intro") say("Sang Singa ingin menjadi seorang raja. Ia harus mengalahkan hewan‑hewan lain. Ayo bantu Singa!");
    if (scene === "lvl1") say(`Dengarkan hurufnya!`);
    if (scene === "trans1") say("Hebat! Level 1 berhasil. Ayo lanjut ke Level 2!");
    if (scene === "lvl2") say(`Dengarkan katanya!`);
    if (scene === "trans2") say("Luar biasa! Tinggal satu tantangan lagi!");
    if (scene === "lvl3") say("Pilih pengucapan yang benar!");
    if (scene === "outro") say("Singa berhasil menjadi raja! Selamat!");
  }, [scene]);

  /* --------------------------------------------------------
     RECORDING & NAVIGATION HELPERS  (scoring logic tetap)
     -------------------------------------------------------- */
  const recordLog = (target: string, answered: string, correct: boolean, category: string) => {
    const rt = Date.now() - taskStart.current;
    setLogs(p => [...p, { targetItem: target, answeredItem: answered, isCorrect: correct, responseTimeMs: rt, errorCategory: category }]);
    if (!correct) setMistakes(p => p + 1);
  };

  const showFlash = (type: "correct" | "wrong") => {
    setFlash(type);
    setTimeout(() => setFlash(null), 600);
  };

  /* --- Level 1 handler --- */
  const handleLvl1 = (opt: string) => {
    const target = LEVEL_1_TASKS[taskIdx].voice;
    const ok = opt === target;
    recordLog(target, opt, ok, "AUDITORI_HURUF");
    showFlash(ok ? "correct" : "wrong");
    if (!ok) { say("Coba lagi!"); return; }
    setTimeout(() => {
      if (taskIdx < LEVEL_1_TASKS.length - 1) setTaskIdx(p => p + 1);
      else { setTaskIdx(0); setScene("trans1"); }
    }, 500);
  };

  /* --- Level 2 handler --- */
  const handleLvl2 = (opt: string) => {
    const target = LEVEL_2_TASKS[taskIdx].voice;
    const ok = opt === target;
    recordLog(target, opt, ok, "AUDITORI_KATA");
    showFlash(ok ? "correct" : "wrong");
    if (!ok) { say("Bukan yang itu!"); return; }
    setTimeout(() => {
      if (taskIdx < LEVEL_2_TASKS.length - 1) setTaskIdx(p => p + 1);
      else { setTaskIdx(0); setScene("trans2"); }
    }, 500);
  };

  /* --- Level 3 handler --- */
  const handleLvl3 = (opt: string) => {
    const task = LEVEL_3_TASKS[taskIdx];
    const ok = opt === task.voice;
    recordLog(task.voice, opt, ok, task.type === "animal" ? "AUDITORI_HEWAN" : "AUDITORI_KATA_SULIT");
    showFlash(ok ? "correct" : "wrong");
    if (!ok) { say("Kurang tepat!"); return; }
    setTimeout(() => {
      if (taskIdx < LEVEL_3_TASKS.length - 1) setTaskIdx(p => p + 1);
      else { setTaskIdx(0); setScene("outro"); }
    }, 500);
  };

  /* --- Submit ke backend --- */
  const finishGame = async () => {
    const durationSec = Math.floor((Date.now() - sessionStart.current) / 1000);
    const score = Math.max(10, 100 - mistakes * 5);
    try {
      await fetch("/api/games/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionType: "TERAPI_AUDITORI_BERTARUNG", durationSec, score, logs }),
      });
      console.log("✅ Skor Bertarung terkirim", { score, durationSec, logs });
    } catch (e) {
      console.error("❌ Gagal submit skor", e);
    }
    router.push("/dashboard/siswa");
  };

  /* --------------------------------------------------------
     COMPUTED
     -------------------------------------------------------- */
  const correctCount = logs.filter(l => l.isCorrect).length;
  const totalTasks = LEVEL_1_TASKS.length + LEVEL_2_TASKS.length + LEVEL_3_TASKS.length;
  const progressPct = Math.round((logs.filter(l => l.isCorrect).length / totalTasks) * 100);
  const currentOpponent = OPPONENTS[taskIdx % OPPONENTS.length];
  const finalScore = Math.max(10, 100 - mistakes * 5);

  /* =========================================================
     RENDER
     ========================================================= */
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-green-50 to-lime-50 font-sans relative overflow-hidden">

      {/* ===== FLASH FEEDBACK OVERLAY ===== */}
      {flash && (
        <div className={`fixed inset-0 z-[100] pointer-events-none flex items-center justify-center transition-opacity duration-300 ${flash === "correct" ? "bg-green-400/20" : "bg-red-400/20"}`}>
          <span className="text-8xl animate-bounce">{flash === "correct" ? "✅" : "❌"}</span>
        </div>
      )}

      {/* ===== TOP BAR ===== */}
      <div className="sticky top-0 z-50 bg-emerald-700 text-white shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.push("/games/terapi/auditori")}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-black text-lg hover:bg-white/30 transition"
          >
            ←
          </button>
          <h1 className="text-lg md:text-xl font-black tracking-wide uppercase">
            🦁 Terapi Auditori — Bertarung
          </h1>
          {/* Live score pills */}
          {["lvl1", "lvl2", "lvl3"].includes(scene) ? (
            <div className="flex gap-2">
              <span className="bg-emerald-500 text-white text-xs font-black px-3 py-1 rounded-full">✓ {correctCount}</span>
              <span className="bg-red-400 text-white text-xs font-black px-3 py-1 rounded-full">✗ {mistakes}</span>
            </div>
          ) : <div className="w-20" />}
        </div>
        {/* Progress bar */}
        {["lvl1", "lvl2", "lvl3"].includes(scene) && (
          <div className="h-1.5 bg-emerald-900/30">
            <div className="h-full bg-yellow-300 transition-all duration-500 ease-out" style={{ width: `${progressPct}%` }} />
          </div>
        )}
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-60px)]">

        {/* ────────── INTRO ────────── */}
        {scene === "intro" && (
          <div className="bg-white rounded-[32px] shadow-xl p-8 md:p-12 text-center w-full border border-emerald-100 animate-in zoom-in duration-500">
            <div className="text-7xl mb-4">🦁</div>
            <h2 className="text-3xl md:text-4xl font-black text-emerald-800 mb-3">Pertarungan Singa</h2>
            <p className="text-gray-600 font-medium leading-relaxed mb-6 max-w-md mx-auto">
              Sang Singa ingin menjadi seorang raja. Ia harus mengalahkan hewan‑hewan lain dengan menjawab tantangan suara. Bantu Singa menjadi raja!
            </p>
            <div className="flex items-center justify-center gap-4 text-4xl mb-6">
              <span>🐍</span><span>🦅</span><span>🐊</span><span>🐻</span><span>🐉</span>
            </div>
            <button
              onClick={() => setScene("lvl1")}
              className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-[0_6px_0_#065f46] hover:bg-emerald-700 active:translate-y-1 active:shadow-[0_2px_0_#065f46] transition-all"
            >
              Mulai Pertarungan! ⚔️
            </button>
          </div>
        )}

        {/* ────────── LEVEL 1 — Dengarkan Huruf ────────── */}
        {scene === "lvl1" && (
          <div className="w-full animate-in slide-in-from-right duration-500">
            {/* Card */}
            <div className="bg-white rounded-[28px] shadow-xl border border-emerald-100 overflow-hidden">
              {/* Card header */}
              <div className="bg-emerald-600 text-white px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-black text-lg">Level 1 — Dengarkan Huruf</h3>
                  <p className="text-emerald-100 text-sm font-medium">Soal {taskIdx + 1} dari {LEVEL_1_TASKS.length}</p>
                </div>
                <span className="text-3xl">{currentOpponent.split(" ")[0]}</span>
              </div>

              {/* Card body */}
              <div className="p-6 md:p-8 text-center">
                <p className="text-gray-500 font-medium mb-4">Dengarkan hurufnya!</p>

                {/* Speaker button */}
                <button
                  onClick={() => say(LEVEL_1_TASKS[taskIdx].voice)}
                  className="w-24 h-24 mx-auto bg-emerald-100 hover:bg-emerald-200 rounded-full flex items-center justify-center text-5xl shadow-inner transition-all hover:scale-105 active:scale-95 mb-8"
                >
                  🔊
                </button>

                {/* Options grid */}
                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                  {LEVEL_1_TASKS[taskIdx].options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleLvl1(opt)}
                      className="bg-gray-800 text-white rounded-2xl py-4 text-3xl font-black hover:bg-gray-700 active:scale-95 transition-all shadow-md"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ────────── TRANSISI 1 ────────── */}
        {scene === "trans1" && (
          <div className="bg-white rounded-[32px] shadow-xl p-8 text-center w-full border border-emerald-100 animate-in zoom-in duration-500">
            <div className="text-7xl mb-4">💪</div>
            <h2 className="text-3xl font-black text-emerald-700 mb-3">Level 1 Selesai!</h2>
            <p className="text-gray-600 mb-6">Singa berhasil mengalahkan lawan pertama! Siap untuk tantangan kata?</p>
            <button
              onClick={() => setScene("lvl2")}
              className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black text-lg shadow-[0_6px_0_#065f46] hover:bg-emerald-700 active:translate-y-1 active:shadow-[0_2px_0_#065f46] transition-all"
            >
              Lanjut ke Level 2 →
            </button>
          </div>
        )}

        {/* ────────── LEVEL 2 — Kata Awalan ────────── */}
        {scene === "lvl2" && (
          <div className="w-full animate-in slide-in-from-right duration-500">
            <div className="bg-white rounded-[28px] shadow-xl border border-emerald-100 overflow-hidden">
              {/* Card header */}
              <div className="bg-emerald-600 text-white px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-black text-lg">Level 2 — Dengarkan Kata</h3>
                  <p className="text-emerald-100 text-sm font-medium">Soal {taskIdx + 1} dari {LEVEL_2_TASKS.length}</p>
                </div>
                <span className="text-3xl">{currentOpponent.split(" ")[0]}</span>
              </div>

              <div className="p-6 md:p-8 text-center">
                <p className="text-gray-500 font-medium mb-4">Dengarkan katanya!</p>

                {/* Speaker button */}
                <button
                  onClick={() => say(LEVEL_2_TASKS[taskIdx].voice)}
                  className="w-24 h-24 mx-auto bg-emerald-100 hover:bg-emerald-200 rounded-full flex items-center justify-center text-5xl shadow-inner transition-all hover:scale-105 active:scale-95 mb-4"
                >
                  🔊
                </button>

                {/* Hint: the spoken word */}
                <p className="text-2xl font-black text-emerald-700 mb-6">{LEVEL_2_TASKS[taskIdx].voice}</p>

                {/* Options */}
                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                  {LEVEL_2_TASKS[taskIdx].options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleLvl2(opt)}
                      className="bg-white border-2 border-emerald-200 text-emerald-800 rounded-2xl py-3 text-lg font-black hover:bg-emerald-50 hover:border-emerald-400 active:scale-95 transition-all shadow-sm"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ────────── TRANSISI 2 ────────── */}
        {scene === "trans2" && (
          <div className="bg-white rounded-[32px] shadow-xl p-8 text-center w-full border border-emerald-100 animate-in zoom-in duration-500">
            <div className="text-7xl mb-4">🔥</div>
            <h2 className="text-3xl font-black text-emerald-700 mb-3">Level 2 Selesai!</h2>
            <p className="text-gray-600 mb-6">Luar biasa! Satu tantangan lagi menuju tahta raja!</p>
            <button
              onClick={() => setScene("lvl3")}
              className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black text-lg shadow-[0_6px_0_#065f46] hover:bg-emerald-700 active:translate-y-1 active:shadow-[0_2px_0_#065f46] transition-all"
            >
              Masuk Level 3 →
            </button>
          </div>
        )}

        {/* ────────── LEVEL 3 — Kombinasi ────────── */}
        {scene === "lvl3" && (() => {
          const task = LEVEL_3_TASKS[taskIdx];
          return (
            <div className="w-full animate-in slide-in-from-right duration-500">
              <div className="bg-white rounded-[28px] shadow-xl border border-emerald-100 overflow-hidden">
                {/* Card header */}
                <div className="bg-emerald-600 text-white px-6 py-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-lg">Level 3 — Dengarkan & Pilih</h3>
                    <p className="text-emerald-100 text-sm font-medium">Soal {taskIdx + 1} dari {LEVEL_3_TASKS.length}</p>
                  </div>
                  <span className="text-3xl">{currentOpponent.split(" ")[0]}</span>
                </div>

                <div className="p-6 md:p-8 text-center">
                  <p className="text-gray-500 font-medium mb-4">Pilih pengucapan yang benar!</p>

                  {/* Animal image or Word display */}
                  {task.type === "animal" ? (
                    <img src={task.img} alt={task.voice} className="w-40 h-40 object-contain mx-auto mb-4 drop-shadow-lg" />
                  ) : (
                    <div className="mb-6">
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        {task.display.split(" ").map((ch, i) => (
                          <button
                            key={i}
                            onClick={() => say(ch)}
                            className="w-12 h-14 bg-gray-800 text-white rounded-xl flex items-center justify-center text-2xl font-black hover:bg-gray-700 active:scale-90 transition-all cursor-pointer"
                            title={`Dengarkan huruf ${ch}`}
                          >
                            {ch}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">💡 Klik huruf untuk mendengar suaranya!</p>
                    </div>
                  )}

                  {/* Voice option buttons */}
                  <div className="flex items-center justify-center gap-4 mb-2">
                    {task.options.map((opt, idx) => (
                      <button
                        key={opt + idx}
                        onClick={() => {
                          say(opt);
                          handleLvl3(opt);
                        }}
                        className="flex flex-col items-center gap-2 bg-emerald-50 border-2 border-emerald-200 rounded-2xl px-6 py-4 hover:bg-emerald-100 hover:border-emerald-400 active:scale-95 transition-all shadow-sm"
                      >
                        <span className="text-3xl">🔊</span>
                        <span className="text-lg font-black text-emerald-800">{opt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ────────── OUTRO ────────── */}
        {scene === "outro" && (
          <div className="bg-white rounded-[32px] shadow-2xl p-8 md:p-12 text-center w-full border border-yellow-200 animate-in zoom-in duration-500">
            <div className="text-8xl mb-4">👑</div>
            <h2 className="text-3xl md:text-4xl font-black text-yellow-600 mb-2">Singa Menjadi Raja!</h2>
            <p className="text-gray-600 font-medium mb-6">Hebat! Singa berhasil mengalahkan semua tantangan dan kini menjadi raja hutan!</p>

            {/* Score summary */}
            <div className="grid grid-cols-3 gap-4 mb-8 max-w-sm mx-auto">
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                <p className="text-3xl font-black text-emerald-700">{finalScore}</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mt-1">Skor</p>
              </div>
              <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
                <p className="text-3xl font-black text-green-600">{correctCount}</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mt-1">Benar</p>
              </div>
              <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
                <p className="text-3xl font-black text-red-500">{mistakes}</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mt-1">Salah</p>
              </div>
            </div>

            <p className="text-gray-500 font-medium mb-6">
              {mistakes === 0 ? "Sempurna! Tidak ada kesalahan 🎉" : `Kamu membuat ${mistakes} kesalahan. Terus berlatih ya!`}
            </p>

            <button
              onClick={finishGame}
              className="w-full max-w-sm mx-auto bg-emerald-600 text-white py-4 rounded-2xl font-black text-xl shadow-[0_6px_0_#065f46] hover:bg-emerald-700 active:translate-y-1 active:shadow-[0_2px_0_#065f46] transition-all"
            >
              Selesai & Simpan Nilai ✨
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
