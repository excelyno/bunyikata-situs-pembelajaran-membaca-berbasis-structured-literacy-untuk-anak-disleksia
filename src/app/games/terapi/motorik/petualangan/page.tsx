"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DrawingCanvas from "@/app/components/DrawingCanvas"; // Pastikan path ini sesuai dengan canvas buatan abang
import Image from "next/image";
import HeroImage from "../../../../../../public/hero/gorogu-landing.png";

// --- DATA LEVEL SESUAI SKENARIO ---
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
  { type: "drag", target: "b", options: ["d", "p", "b"] }, // 3 Opsi dipersulit
  { type: "write", target: "8" },
];

export default function MotorikBudi() {
  const router = useRouter();
  
  // STATE MANAGEMENT UTAMA (Menggantikan phase 0,1,2)
  const [scene, setScene] = useState<
    "intro" | "lvl1" | "trans1" | "lvl2" | "trans2" | "lvl3" | "outro" | "freedraw" | "done"
  >("intro");
  
  const [taskIndex, setTaskIndex] = useState(0); // Melacak urutan soal di dalam level
  const [draggedLetter, setDraggedLetter] = useState<string | null>(null);

  // Fungsi Text-to-Speech (Membaca otomatis)
  const playAudio = (text: string) => {
    window.speechSynthesis.cancel(); // Hentikan suara sebelumnya jika ada
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "id-ID";
    speech.rate = 0.9; // Agak lambat agar anak jelas mendengarnya
    window.speechSynthesis.speak(speech);
  };

  // Efek Suara Otomatis Setiap Pindah Scene/Task
  useEffect(() => {
    if (scene === "intro") playAudio("Halo! Budi ingin pergi ke suatu taman. Tetapi dia kesepian dan ingin kamu menemani dia berpetualang. Bantu Budi menyelesaikan soal-soal ini agar Budi dan kamu sampai di taman ya!");
    if (scene === "lvl1") playAudio(`Ayo tulis huruf ${LEVEL_1_TASKS[taskIndex]} di dalam kotak!`);
    if (scene === "trans1") playAudio("Hebat sekali! Jalan menuju taman mulai terbuka. Ayo kita lanjutkan petualangan ini!");
    if (scene === "lvl2") playAudio(`Budi kebingungan nih. Pindahkan huruf ${LEVEL_2_TASKS[taskIndex].target} ke dalam kotak kosong ya!`);
    if (scene === "trans2") playAudio("Wah, kamu pintar sekali! Tinggal satu bukit lagi menuju taman di Misi Kombinasi.");
    if (scene === "lvl3") {
        const task = LEVEL_3_TASKS[taskIndex];
        if (task.type === "write") playAudio(`Tulis huruf ${task.target} ikuti garisnya!`);
        else playAudio(`Pilih dan pindahkan huruf ${task.target} dari tiga pilihan ini!`);
    }
    if (scene === "outro") playAudio("Yeay! Budi sudah sampai di taman! Terima kasih sudah menemani Budi berpetualang. Sebagai penutup, tulis huruf favoritmu di sini ya!");
  }, [scene, taskIndex]);

  // --- LOGIC GAMEPLAY ---
  const handleNextTask_Lvl1 = (score: number) => {
    // Bisa simpan score ke state logs jika perlu
    if (taskIndex < LEVEL_1_TASKS.length - 1) setTaskIndex((p) => p + 1);
    else { setTaskIndex(0); setScene("trans1"); }
  };

  const handleDrop_Lvl2 = (targetObj: any) => {
    if (draggedLetter === targetObj.target) {
      setDraggedLetter(null);
      if (taskIndex < LEVEL_2_TASKS.length - 1) setTaskIndex((p) => p + 1);
      else { setTaskIndex(0); setScene("trans2"); }
    } else {
      playAudio("O-ow, sepertinya itu huruf yang berbeda. Coba lihat lagi!");
      setDraggedLetter(null);
    }
  };

  const handleNextTask_Lvl3 = () => {
    setDraggedLetter(null);
    if (taskIndex < LEVEL_3_TASKS.length - 1) setTaskIndex((p) => p + 1);
    else { setTaskIndex(0); setScene("outro"); }
  };


  // --- KOMPONEN RENDERER ---

  // 1. Template Scene Cerita (Visual Novel Mode)
  const VNStoryScreen = ({ text, onNext, bgClass, bgImage }: { text: string, onNext: () => void, bgClass?: string, bgImage?: string }) => (
    <div 
      className={`w-full h-screen ${bgClass || ""} bg-cover bg-center flex flex-col justify-end relative overflow-hidden`}
      style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
    >
      {/* Sprite Budi (Gambar transparan tanpa background) */}
      <img src={HeroImage.src} width={500} height={500} alt="Budi" className="absolute bottom-20 left-10 w-64 md:w-80" />
      
      {/* Kotak Dialog Khas Visual Novel */}
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
      {/* Tombol Keluar Global */}
      <button onClick={() => router.push("/games/terapi/motorik")} className="absolute top-6 left-6 w-12 h-12 bg-white text-orange-500 rounded-full flex items-center justify-center font-black text-xl shadow-md hover:scale-110 z-50">{"<"}</button>

      {/* --- SCENE 1: INTRO STORY --- */}
      {scene === "intro" && (
        <VNStoryScreen 
          bgImage="/bg/pemandangan-background.png"
          text="Budi ingin pergi ke suatu taman. Tetapi dia kesepian dan ingin kamu menemani dia berpetualang. Bantu Budi menyelesaikan soal-soal ini agar Budi dan kamu sampai di taman!"
          onNext={() => setScene("lvl1")}
        />
      )}

      {/* --- SCENE 2: LEVEL 1 (MENULIS HURUF) --- */}
      {scene === "lvl1" && (
        <div className="w-full max-w-2xl text-center px-4 animate-in slide-in-from-right duration-500">
          <div className="bg-orange-200 text-orange-800 px-6 py-2 rounded-full font-bold inline-block mb-6 uppercase tracking-wider">Level 1: Menulis (Soal {taskIndex + 1} dari 5)</div>
          <DrawingCanvas watermark={LEVEL_1_TASKS[taskIndex]} onComplete={handleNextTask_Lvl1} />
        </div>
      )}

      {/* --- SCENE 3: TRANSISI 1 --- */}
      {scene === "trans1" && (
        <VNStoryScreen 
          bgImage="/bg/pemandangan-background.png"
          text="Budi bilang: 'Wah, tulisanmu rapi sekali! Peta ini mulai menunjukkan jalan, ayo lanjut masuk ke hutan!'"
          onNext={() => setScene("lvl2")}
        />
      )}

      {/* --- SCENE 4: LEVEL 2 (DRAG & DROP 2 OPSI) --- */}
      {scene === "lvl2" && (
        <div className="w-full max-w-2xl text-center px-4 animate-in slide-in-from-right duration-500">
          <div className="bg-green-200 text-green-800 px-6 py-2 rounded-full font-bold inline-block mb-6 uppercase tracking-wider">Level 2: Pindahkan Huruf (Soal {taskIndex + 1} dari 5)</div>
          
          <p className="text-2xl font-black text-gray-700 mb-8">Pindahkan huruf yang benar ke kotak di atas!</p>
          
          {/* Kotak Target */}
          <div className="flex justify-center mb-12">
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop_Lvl2(LEVEL_2_TASKS[taskIndex])}
              className="w-40 h-48 border-8 border-dashed border-gray-300 rounded-3xl flex items-center justify-center text-9xl font-black text-gray-200"
            >
              {LEVEL_2_TASKS[taskIndex].target} {/* Sebagai Watermark bayangan */}
            </div>
          </div>

          {/* Opsi Drag */}
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

      {/* --- SCENE 5: TRANSISI 2 --- */}
      {scene === "trans2" && (
        <VNStoryScreen 
          bgImage="/bg/pemandangan-background.png"
          text="Budi berseru, 'Jalannya hampir sampai! Kita hanya perlu melewati rintangan kombinasi di bukit ini!'"
          onNext={() => setScene("lvl3")}
        />
      )}

      {/* --- SCENE 6: LEVEL 3 (KOMBINASI) --- */}
      {scene === "lvl3" && (
        <div className="w-full max-w-2xl text-center px-4 animate-in slide-in-from-right duration-500">
          <div className="bg-purple-200 text-purple-800 px-6 py-2 rounded-full font-bold inline-block mb-6 uppercase tracking-wider">Level 3: Kombinasi (Soal {taskIndex + 1} dari 3)</div>
          
          {LEVEL_3_TASKS[taskIndex].type === "write" ? (
             <DrawingCanvas watermark={LEVEL_3_TASKS[taskIndex].target} onComplete={handleNextTask_Lvl3} />
          ) : (
            <>
              <p className="text-2xl font-black text-gray-700 mb-8">Pindahkan huruf yang benar ke kotak di atas!</p>
              <div className="flex justify-center mb-12">
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedLetter === LEVEL_3_TASKS[taskIndex].target) handleNextTask_Lvl3();
                    else { playAudio("Bukan yang itu, ayo cari lagi!"); setDraggedLetter(null); }
                  }}
                  className="w-40 h-48 border-8 border-dashed border-gray-300 rounded-3xl flex items-center justify-center text-9xl font-black text-gray-200"
                >
                  {LEVEL_3_TASKS[taskIndex].target}
                </div>
              </div>
              <div className="flex justify-center gap-6">
                {LEVEL_3_TASKS[taskIndex].options?.map((opt, idx) => (
                  <div key={idx} draggable onDragStart={() => setDraggedLetter(opt)} className="w-24 h-32 bg-white border-b-8 border-purple-600 rounded-2xl flex items-center justify-center text-6xl font-black text-gray-700 cursor-grab hover:-translate-y-2 shadow-md">{opt}</div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* --- SCENE 7: OUTRO (TAMAN) --- */}
      {scene === "outro" && (
        <VNStoryScreen 
          bgImage="/bg/pemandangan-background.png"
          text="Yeay! Budi sudah sampai di taman! Budi dan kelinci sangat senang. Terima kasih sudah menemani Budi berpetualang!"
          onNext={() => setScene("freedraw")}
        />
      )}

      {/* --- SCENE 8: FREE DRAW PENUTUP --- */}
      {scene === "freedraw" && (
        <div className="w-full max-w-2xl text-center px-4">
          <h1 className="text-4xl font-black text-green-700 mb-4">Tulis Huruf Favoritmu!</h1>
          <p className="text-gray-600 mb-8 font-medium">Sebagai kenang-kenangan, tulis huruf kesukaanmu di kanvas ini.</p>
          <DrawingCanvas watermark="" onComplete={() => setScene("done")} />
        </div>
      )}

      {/* --- SCENE 9: SELESAI --- */}
      {scene === "done" && (
        <div className="bg-white p-12 rounded-[40px] shadow-2xl text-center max-w-lg animate-in zoom-in">
          <div className="text-8xl mb-6 animate-bounce">🌟</div>
          <h1 className="text-4xl font-black text-orange-600 mb-2">Petualangan Selesai!</h1>
          <button onClick={() => router.push("/games")} className="mt-8 w-full bg-orange-500 text-white py-4 rounded-3xl font-black text-xl shadow-[0_8px_0_#c2410c] hover:bg-orange-600 transition-all">Kembali ke Beranda</button>
        </div>
      )}

    </div>
  );
}