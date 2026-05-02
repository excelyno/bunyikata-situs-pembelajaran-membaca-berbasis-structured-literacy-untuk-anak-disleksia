"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { say } from "@/lib/speak";
import DrawingCanvas from "@/app/components/DrawingCanvas";
import HeroImage from "../../../../../../public/hero/gorogu-landing.png";


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
    if (scene === "intro") say("Sang Guribuu sedang berpetualang di lautan suara. Ia harus mengalahkan monster‑monster pengganggu. Ayo bantu Guribuu!");
    if (scene === "lvl1") say(`Dengarkan hurufnya!`);
    if (scene === "trans1") say("Hebat! Guribuu berhasil mengalahkan monster pertama. Ayo lanjut ke Level 2!");
    if (scene === "lvl2") say(`Dengarkan katanya!`);
    if (scene === "trans2") say("Luar biasa! Guribuu semakin kuat. Tinggal satu tantangan lagi!");
    if (scene === "lvl3") say("Pilih pengucapan yang benar!");
    if (scene === "outro") say("Guribuu berhasil menguasai samudra suara! Selamat!");
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
     COMPONENTS
     ========================================================= */
  const VNStoryScreen = ({ text, onNext, icon }: { text: string; onNext: () => void; icon?: string }) => (
    <div className="w-full h-full flex flex-col justify-end relative overflow-hidden min-h-[400px]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/20 rounded-full blur-3xl" />
      
      {/* KARAKTER GURIBUU */}
      <img 
        src={HeroImage.src} 
        alt="guribu" 
        className="absolute bottom-[22%] sm:bottom-28 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-10 w-48 sm:w-64 md:w-80 transition-all duration-700 z-10" 
      />

      {/* KOTAK DIALOG (TRANSPARAN) */}
      <div className="bg-white/40 backdrop-blur-sm border-t-4 border-orange-500/80 p-6 w-full min-h-[22vh] shadow-xl z-20 flex flex-col justify-between">
        <div className="flex items-start gap-4">
          <span className="text-4xl">{icon || "🐙"}</span>
          <p className="text-lg sm:text-xl text-gray-900 font-bold leading-relaxed max-w-4xl drop-shadow-sm">
            {text}
          </p>
        </div>
        <div className="flex justify-end mt-4">
          <button 
            onClick={onNext} 
            className="bg-[#F18230] text-white px-8 py-3 rounded-full font-black text-lg shadow-[0_6px_0_#C56521] active:translate-y-2 active:shadow-none hover:bg-[#E07220] transition-all flex items-center gap-2"
          >
            Lanjut <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF8F0] font-sans relative overflow-hidden">
      
      {/* Dekorasi elemen organik background */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#FDE9D2] rounded-full translate-x-20 -translate-y-20 opacity-60" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-[#EF953322] rounded-full -translate-x-10 translate-y-10" />

      {/* ===== FEEDBACK POPUP ===== */}
      {flash && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`bg-[#FFF9F2] rounded-[40px] p-8 max-w-sm w-full text-center shadow-2xl border-b-8 ${flash === "correct" ? "border-green-400" : "border-red-400"} animate-in zoom-in duration-300`}>
            <div className="w-32 h-32 mx-auto mb-4 animate-bounce flex items-center justify-center">
              {flash === "correct" ? (
                <span className="text-8xl">🌟</span>
              ) : (
                <img src={HeroImage.src} alt="Guribuu" className="w-full h-full object-contain drop-shadow-md" />
              )}
            </div>
            <h3 className={`text-2xl font-black mb-2 ${flash === "correct" ? "text-green-600" : "text-red-500"}`}>
              {flash === "correct" ? "Hebat!" : "Ayo Coba Lagi!"}
            </h3>
            <p className="text-gray-900 font-medium mb-6">
              {flash === "correct" 
                ? "Jawabanmu benar! Guribuu bangga padamu!" 
                : "Wah, belum tepat! Guribuu yakin kamu bisa, dengarkan lagi ya! 🧐"}
            </p>
            {flash === "wrong" && (
              <button 
                onClick={() => setFlash(null)}
                className="w-full bg-[#F18230] text-white py-3 rounded-2xl font-black shadow-[0_4px_0_#C56521] active:translate-y-1 active:shadow-none"
              >
                Dengar Lagi 💪
              </button>
            )}
          </div>
        </div>
      )}

      {/* ===== TOP BAR ===== */}
      <div className="sticky top-0 z-50 bg-[#EF9533] text-white shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.push("/games/terapi/auditori")}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white font-black text-lg hover:bg-white/30 transition"
          >
            ←
          </button>
          <h1 className="text-lg md:text-xl font-black tracking-wide uppercase">
            🐙 Petualangan Guribuu — Auditori
          </h1>
          {/* Live score pills */}
          {["lvl1", "lvl2", "lvl3"].includes(scene) ? (
            <div className="flex gap-2">
              <span className="bg-[#D17A20] text-white text-xs font-black px-3 py-1 rounded-full shadow-inner">✓ {correctCount}</span>
              <span className="bg-red-500/80 text-white text-xs font-black px-3 py-1 rounded-full shadow-inner">✗ {mistakes}</span>
            </div>
          ) : <div className="w-20" />}
        </div>
        {/* Progress bar */}
        {["lvl1", "lvl2", "lvl3"].includes(scene) && (
          <div className="h-1.5 bg-orange-900/20">
            <div className="h-full bg-white transition-all duration-500 ease-out" style={{ width: `${progressPct}%` }} />
          </div>
        )}
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[calc(100vh-60px)]">

        {/* ────────── INTRO ────────── */}
        {scene === "intro" && (
          <div className="w-full h-full animate-in zoom-in duration-500 z-10">
            <VNStoryScreen 
              text="Halo! Aku Guribuu. Aku sedang menjelajahi Samudra Suara, tapi ada banyak monster yang mengganggu. Bantu aku mengalahkan mereka dengan mendengarkan suara dengan teliti ya!"
              onNext={() => setScene("lvl1")}
              icon="🐙"
            />
          </div>
        )}

        {/* ────────── LEVEL 1 — Dengarkan Huruf ────────── */}
        {scene === "lvl1" && (
          <div className="w-full animate-in slide-in-from-right duration-500 z-10">
            {/* Card */}
            <div className="bg-[#FFF9F2] rounded-[28px] shadow-xl border border-orange-100 overflow-hidden">
              {/* Card header */}
              <div className="bg-[#EF9533] text-white px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-black text-lg">Level 1 — Dengarkan Huruf</h3>
                  <p className="text-orange-100 text-sm font-medium">Soal {taskIdx + 1} dari {LEVEL_1_TASKS.length}</p>
                </div>
                <span className="text-3xl">{currentOpponent.split(" ")[0]}</span>
              </div>

              {/* Card body */}
              <div className="p-6 md:p-8 text-center">
                <p className="text-gray-500 font-medium mb-4">Dengarkan hurufnya!</p>

                {/* Speaker button */}
                <button
                  onClick={() => say(LEVEL_1_TASKS[taskIdx].voice)}
                  className="w-24 h-24 mx-auto bg-orange-50 hover:bg-orange-100 rounded-full flex items-center justify-center text-5xl shadow-inner transition-all hover:scale-105 active:scale-95 mb-8 border-2 border-orange-100"
                >
                  🔊
                </button>

                {/* Options grid */}
                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                  {LEVEL_1_TASKS[taskIdx].options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleLvl1(opt)}
                      className="bg-[#5C4D4A] text-white rounded-2xl py-4 text-3xl font-black hover:bg-[#433835] active:scale-95 transition-all shadow-md"
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
          <div className="w-full h-full animate-in zoom-in duration-500 z-10">
            <VNStoryScreen 
              text="Wah, telingamu tajam sekali! Monster Ular itu langsung lari ketakutan. Ayo kita lanjut ke perairan yang lebih dalam!"
              onNext={() => setScene("lvl2")}
              icon="🐙"
            />
          </div>
        )}

        {/* ────────── LEVEL 2 — Kata Awalan ────────── */}
        {scene === "lvl2" && (
          <div className="w-full animate-in slide-in-from-right duration-500 z-10">
            <div className="bg-[#FFF9F2] rounded-[28px] shadow-xl border border-orange-100 overflow-hidden">
              {/* Card header */}
              <div className="bg-[#EF9533] text-white px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-black text-lg">Level 2 — Dengarkan Kata</h3>
                  <p className="text-orange-100 text-sm font-medium">Soal {taskIdx + 1} dari {LEVEL_2_TASKS.length}</p>
                </div>
                <span className="text-3xl">{currentOpponent.split(" ")[0]}</span>
              </div>

              <div className="p-6 md:p-8 text-center">
                <p className="text-gray-500 font-medium mb-4">Dengarkan katanya!</p>

                {/* Speaker button */}
                <button
                  onClick={() => say(LEVEL_2_TASKS[taskIdx].voice)}
                  className="w-24 h-24 mx-auto bg-orange-50 hover:bg-orange-100 rounded-full flex items-center justify-center text-5xl shadow-inner transition-all hover:scale-105 active:scale-95 mb-4 border-2 border-orange-100"
                >
                  🔊
                </button>

                {/* Hint: the spoken word */}
                <p className="text-2xl font-black text-[#5C4D4A] mb-6">{LEVEL_2_TASKS[taskIdx].voice}</p>

                {/* Options */}
                <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                  {LEVEL_2_TASKS[taskIdx].options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleLvl2(opt)}
                      className="bg-white border-2 border-orange-100 text-[#5C4D4A] rounded-2xl py-3 text-lg font-black hover:bg-orange-50 hover:border-orange-300 active:scale-95 transition-all shadow-sm"
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
          <div className="w-full h-full animate-in zoom-in duration-500 z-10">
            <VNStoryScreen 
              text="Luar biasa! Guribuu bangga padamu. Sekarang kita akan menghadapi Raja Monster di Samudra Dalam. Fokus ya!"
              onNext={() => setScene("lvl3")}
              icon="🐙"
            />
          </div>
        )}

        {/* ────────── LEVEL 3 — Kombinasi ────────── */}
        {scene === "lvl3" && (() => {
          const task = LEVEL_3_TASKS[taskIdx];
          return (
            <div className="w-full animate-in slide-in-from-right duration-500 z-10">
              <div className="bg-[#FFF9F2] rounded-[28px] shadow-xl border border-orange-100 overflow-hidden">
                {/* Card header */}
                <div className="bg-[#EF9533] text-white px-6 py-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-black text-lg">Level 3 — Dengarkan & Pilih</h3>
                    <p className="text-orange-100 text-sm font-medium">Soal {taskIdx + 1} dari {LEVEL_3_TASKS.length}</p>
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
                            className="w-12 h-14 bg-[#5C4D4A] text-white rounded-xl flex items-center justify-center text-2xl font-black hover:bg-[#3D2D29] active:scale-90 transition-all cursor-pointer shadow-md"
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
                        className="flex flex-col items-center gap-2 bg-orange-50 border-2 border-orange-100 rounded-2xl px-6 py-4 hover:bg-orange-100 hover:border-orange-300 active:scale-95 transition-all shadow-sm"
                      >
                        <span className="text-3xl">🔊</span>
                        <span className="text-lg font-black text-[#5C4D4A]">{opt}</span>
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
          <div className="bg-[#FFF9F2] rounded-[32px] shadow-2xl p-8 md:p-12 text-center w-full border-b-8 border-orange-200 animate-in zoom-in duration-500 z-10">
            <div className="text-8xl mb-4">👑🐙</div>
            <h2 className="text-3xl md:text-4xl font-black text-orange-600 mb-2">Pahlawan Samudra!</h2>
            <p className="text-gray-600 font-medium mb-6">Hebat! Guribuu dan seluruh penghuni samudra berterima kasih padamu. Kamu memang pendengar yang hebat!</p>

            {/* Score summary */}
            <div className="grid grid-cols-3 gap-4 mb-8 max-w-sm mx-auto">
              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <p className="text-3xl font-black text-orange-700">{finalScore}</p>
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
              {mistakes === 0 ? "Sempurna! Telingamu sangat peka 🎉" : `Kamu membuat ${mistakes} kesalahan. Terus berlatih ya!`}
            </p>

            <button
              onClick={finishGame}
              className="w-full max-w-sm mx-auto bg-[#F18230] text-white py-4 rounded-2xl font-black text-xl shadow-[0_6px_0_#C56521] hover:bg-[#E07220] active:translate-y-1 active:shadow-none transition-all"
            >
              Simpan & Kembali ✨
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
