"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HeroImage from "../../../../../../public/hero/gorogu-landing.png";


// --- DATA LEVEL ---
const LEVEL_1_DATA = [
  { target: "SAPU", options: ["SAPI", "SAPU", "PALU"], category: "FLASH_MEMORI" },
  { target: "BUKU", options: ["BUKA", "KUKU", "BUKU"], category: "FLASH_MEMORI" },
  { target: "TOPI", options: ["KOPI", "TAPI", "TOPI"], category: "FLASH_MEMORI" },
  { target: "BOLA", options: ["BOLA", "BOLO", "BALA"], category: "FLASH_MEMORI" },
  { target: "MEJA", options: ["MEJA", "EJAAN", "MANA"], category: "FLASH_MEMORI" },
];

const LEVEL_2_DATA = [
  { image: "🐘", target: "GAJAH", options: ["GAJAH", "GAGAK", "GALAH"], category: "SILUET_KATA" },
  { image: "🚗", target: "MOBIL", options: ["MOBIL", "BOTOL", "MODEL"], category: "SILUET_KATA" },
  { image: "🪑", target: "KURSI", options: ["KASUR", "KURSI", "KUNCI"], category: "SILUET_KATA" },
  { image: "🚪", target: "PINTU", options: ["PINTU", "PIATU", "PINTA"], category: "SILUET_KATA" },
  { image: "🍎", target: "APEL", options: ["ASAL", "APEL", "AWAL"], category: "SILUET_KATA" },
];

const LEVEL_3_DATA = [
  { target: "SEPATU", options: ["SEPAUT", "SEPATU", "SPEATU"], category: "SPOT_ERROR" },
  { target: "KELAPA", options: ["KEPALA", "KALAPE", "KELAPA"], category: "SPOT_ERROR" },
  { target: "LEMARI", options: ["LAMERI", "LEMARI", "RELAMI"], category: "SPOT_ERROR" },
  { target: "KUCING", options: ["KUNING", "KUICNG", "KUCING"], category: "SPOT_ERROR" },
  { target: "PISANG", options: ["PISNAG", "PISANG", "PASING"], category: "SPOT_ERROR" },
];

export default function DetektifGuribuu() {
  const router = useRouter();
  
  // --- STATE MANAGEMENT ---
  const [phase, setPhase] = useState(0); // 0:Intro, 1:Lvl1, 2:Lvl2, 3:Lvl3, 4:Outro
  const [subPhase, setSubPhase] = useState(0); // Soal ke 0-4
  const [showFlash, setShowFlash] = useState(false);
  
  // --- PENILAIAN & LOGGING ---
  const [startTimeMs, setStartTimeMs] = useState<number>(0);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [logs, setLogs] = useState<any[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);


  // --- LOGIKA LEVEL 1 (Flash Word Timer) ---
  useEffect(() => {
    if (phase === 1) {
      setShowFlash(true);
      setStartTimeMs(Date.now());
      if (sessionStartTime === 0) setSessionStartTime(Date.now());
      
      const timer = setTimeout(() => setShowFlash(false), 3000);
      return () => clearTimeout(timer);
    }
    if (phase > 1) {
      setStartTimeMs(Date.now());
    }
  }, [phase, subPhase]);

  // --- HELPER BENTUK SILUET KATA ---
  const renderSilhouette = (word: string) => {
    const ascenders = ["b", "d", "f", "h", "k", "l", "t", "B", "D", "F", "H", "K", "L", "T"];
    const descenders = ["g", "j", "p", "q", "y", "G", "J", "P", "Q", "Y"];
    
    return (
      <div className="flex gap-1 justify-center items-end bg-orange-900/10 p-4 rounded-3xl border-4 border-dashed border-orange-200 min-h-[120px] w-full max-w-sm mx-auto shadow-inner">
        {word.split("").map((char, idx) => {
          if (ascenders.includes(char)) {
            return <div key={idx} className="w-10 h-20 bg-[#EF9533] rounded-t-xl shadow-sm" />;
          } else if (descenders.includes(char)) {
            return <div key={idx} className="w-10 h-20 bg-[#EF9533] rounded-b-xl -mb-6 shadow-sm" />;
          } else {
            return <div key={idx} className="w-10 h-14 bg-[#EF9533] rounded-md shadow-sm" />;
          }
        })}
      </div>
    );
  };

  // --- HANDLE JAWABAN ---
  const handlePick = (selectedItem: string, targetItem: string, category: string) => {
    const responseTimeMs = Date.now() - startTimeMs;
    const isCorrect = selectedItem === targetItem;

    setLogs((prev) => [...prev, { targetItem, answeredItem: selectedItem, isCorrect, responseTimeMs, errorCategory: category }]);

    if (isCorrect) {
      setFeedback("correct");
      setTimeout(() => {
        setFeedback(null);
        if (subPhase < 4) {
          setSubPhase((prev) => prev + 1);
        } else {
          setPhase((prev) => prev + 1); // Pindah Level
          setSubPhase(0);
        }
      }, 1000);
    } else {
      setMistakes((prev) => prev + 1);
      setFeedback("wrong");
    }
  };

  const finishGame = async () => {
    const durationSec = Math.floor((Date.now() - sessionStartTime) / 1000);
    const score = Math.max(10, 100 - (mistakes * 5)); 

    try {
      await fetch("/api/games/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionType: "TERAPI_VISUAL_KIKI",
          durationSec: durationSec,
          score: score,
          logs: logs,
        }),
      });
      console.log("Data selesai diproses!", { score, durationSec, mistakes, logs });
      router.push("/dashboard/siswa");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] p-6 flex flex-col items-center justify-center relative font-sans overflow-hidden text-[#5C4D4A]">
      
      {/* ===== FEEDBACK POPUP ===== */}
      {feedback && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`bg-[#FFF9F2] rounded-[40px] p-8 max-w-sm w-full text-center shadow-2xl border-b-8 ${feedback === "correct" ? "border-green-400" : "border-red-400"} animate-in zoom-in duration-300`}>
            <div className="w-32 h-32 mx-auto mb-4 animate-bounce">
              {feedback === "correct" ? (
                <span className="text-8xl">🌟</span>
              ) : (
                <img src={HeroImage.src} alt="Guribuu" className="w-full h-full object-contain drop-shadow-md" />
              )}
            </div>
            <h3 className={`text-2xl font-black mb-2 ${feedback === "correct" ? "text-green-600" : "text-red-500"}`}>
              {feedback === "correct" ? "Hebat!" : "Ayo Coba Lagi!"}
            </h3>
            <p className="text-gray-600 font-medium mb-6">
              {feedback === "correct" 
                ? "Jawabanmu benar! Kamu hebat sekali!" 
                : "Wah, belum tepat! Guribuu yakin kamu bisa, ayo lebih teliti lagi ya! 🧐"}
            </p>
            {feedback === "wrong" && (
              <button 
                onClick={() => setFeedback(null)}
                className="w-full bg-[#F18230] text-white py-3 rounded-2xl font-black shadow-[0_4px_0_#C56521] active:translate-y-1 active:shadow-none"
              >
                Coba Lagi 💪
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Dekorasi elemen organik background */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#FDE9D2] rounded-full translate-x-20 -translate-y-20 opacity-60" />
      <div className="absolute bottom-0 left-0 w-56 h-56 bg-[#EF953322] rounded-full -translate-x-10 translate-y-10" />

      <button onClick={() => router.push("/games/terapi/visual")} className="absolute top-6 left-6 w-14 h-14 bg-[#FFF9F2] text-[#8D7B68] rounded-full flex items-center justify-center font-black text-2xl shadow-sm border-2 border-orange-100 z-20 hover:bg-orange-50 transition-all">{"<"}</button>

      {/* --- INTRO --- */}
      {phase === 0 && (
        <div className="bg-[#FFF9F2] p-10 rounded-[40px] shadow-xl text-center max-w-xl z-10 border border-[#FDE9D2] relative animate-in zoom-in duration-500">
          <div className="w-48 h-48 mx-auto mb-6 relative">
            <img src={HeroImage.src} alt="Guribuu" className="w-full h-full object-contain relative z-10 drop-shadow-md" />
          </div>
          <h1 className="text-4xl font-black text-[#5C4D4A] mb-4 tracking-wide">Detektif Guribuu</h1>
          <p className="text-[#8D7B68] text-lg leading-relaxed mb-8 font-medium">
            Guribuu sedang mencari jejak kata yang hilang di pulau misterius. 
            Maukah kamu membantu Guribuu menjadi detektif hebat dan menemukan semua rahasia yang tersembunyi?
          </p>
          <button 
            onClick={() => setPhase(1)} 
            className="w-full bg-[#F18230] text-white py-4 rounded-3xl font-black text-xl shadow-[0_6px_0_#C56521] active:translate-y-2 active:shadow-none hover:bg-[#E07220] transition-all"
          >
            Mulai Penyelidikan 🔍
          </button>
        </div>
      )}

      {/* --- LEVEL 1 : FLASH WORD --- */}
      {phase === 1 && (
        <div className="w-full max-w-2xl flex flex-col items-center z-10">
          <div className="bg-[#EF953322] px-6 py-2 rounded-full text-[#EF9533] font-bold mb-6 tracking-widest border border-[#EF953344]">
            LEVEL 1: MEMORI VISUAL ({subPhase + 1}/5)
          </div>

          <div className="bg-[#FFF9F2] p-12 rounded-[40px] shadow-xl text-center w-full min-h-[400px] flex flex-col justify-center border border-[#FDE9D2] relative">
            {showFlash ? (
              <div className="animate-pulse">
                <p className="text-orange-500 font-bold mb-4 uppercase tracking-widest">Ingat kata ini baik-baik!</p>
                <h2 className="text-8xl font-black text-[#5C4D4A] tracking-widest drop-shadow-md">
                  {LEVEL_1_DATA[subPhase].target}
                </h2>
              </div>
            ) : (
              <div className="animate-in fade-in zoom-in duration-300">
                <p className="text-gray-500 font-black text-2xl mb-8">Kata apa yang barusan kamu lihat?</p>
                <div className="grid grid-cols-1 gap-4">
                  {LEVEL_1_DATA[subPhase].options.map((opt, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => handlePick(opt, LEVEL_1_DATA[subPhase].target, LEVEL_1_DATA[subPhase].category)}
                      className="bg-orange-50 text-[#5C4D4A] text-3xl font-black py-5 rounded-3xl hover:bg-[#EF9533] hover:text-white border-b-4 border-orange-100 hover:border-[#C56521] transition-all shadow-sm"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- LEVEL 2 : BENTUK KATA (SILUET) --- */}
      {phase === 2 && (
        <div className="w-full max-w-2xl flex flex-col items-center z-10 animate-in fade-in zoom-in duration-500">
          <div className="bg-[#EF953322] px-6 py-2 rounded-full text-[#EF9533] font-bold mb-6 tracking-widest border border-[#EF953344]">
            LEVEL 2: SILUET KATA ({subPhase + 1}/5)
          </div>

          <div className="bg-[#FFF9F2] p-8 rounded-[40px] shadow-xl text-center w-full border border-[#FDE9D2]">
            <div className="text-[100px] drop-shadow-xl mb-4 bg-orange-50 rounded-3xl inline-block px-8 py-4 border border-orange-100">
              {LEVEL_2_DATA[subPhase].image}
            </div>
            
            <p className="text-[#8D7B68] font-bold mb-4">Pilih kata yang bentuknya pas dengan kotak di bawah ini:</p>
            
            {/* Visualisasi Siluet Box */}
            <div className="mb-10">
              {renderSilhouette(LEVEL_2_DATA[subPhase].target)}
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {LEVEL_2_DATA[subPhase].options.map((opt, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handlePick(opt, LEVEL_2_DATA[subPhase].target, LEVEL_2_DATA[subPhase].category)}
                  className="bg-[#F18230] text-white text-2xl font-black py-4 px-8 rounded-2xl shadow-[0_6px_0_#C56521] active:translate-y-2 active:shadow-none hover:bg-[#E07220] transition-all tracking-widest"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- LEVEL 3 : SPOT THE ERROR --- */}
      {phase === 3 && (
        <div className="w-full max-w-3xl flex flex-col items-center z-10 animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-[#EF953322] px-6 py-2 rounded-full text-[#EF9533] font-bold mb-6 tracking-widest border border-[#EF953344]">
            LEVEL 3: MENCARI PENIPU ({subPhase + 1}/5)
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-[#5C4D4A] mb-2 tracking-wide">Hati-hati Rubah Penipu! 🦊</h2>
            <p className="text-[#8D7B68] text-lg font-medium">Pilih papan petunjuk dengan tulisan yang BENAR.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 w-full max-w-md">
            {LEVEL_3_DATA[subPhase].options.map((opt, idx) => (
              <button 
                key={idx} 
                onClick={() => handlePick(opt, LEVEL_3_DATA[subPhase].target, LEVEL_3_DATA[subPhase].category)}
                className="relative bg-[#D4A373] text-[#5C3D2E] text-4xl font-black py-6 rounded-xl border-b-8 border-[#A67B5B] hover:bg-[#E6B88A] hover:-translate-y-1 active:translate-y-2 active:border-b-0 transition-all tracking-widest shadow-xl flex items-center justify-center"
              >
                {/* Efek Baut Papan Kayu */}
                <div className="absolute left-4 w-3 h-3 bg-[#8C5A3C] rounded-full shadow-inner" />
                <div className="absolute right-4 w-3 h-3 bg-[#8C5A3C] rounded-full shadow-inner" />
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- OUTRO --- */}
      {phase === 4 && (
        <div className="bg-[#FFF9F2] p-10 rounded-[40px] shadow-xl text-center max-w-xl z-10 border-b-8 border-orange-200 animate-in zoom-in duration-500">
          <div className="text-[120px] mb-4 animate-bounce">🎖️🐙</div>
          <h1 className="text-4xl font-black text-orange-500 mb-4 tracking-wide">Misi Berhasil!</h1>
          <p className="text-[#8D7B68] text-lg font-medium leading-relaxed mb-8">
            Terima kasih Detektif! Berkat bantuanmu, Guribuu berhasil menemukan semua rahasia pulau. 
            Kamu benar-benar detektif yang cerdas dan teliti!
          </p>
          <button 
            onClick={finishGame} 
            className="w-full bg-[#F18230] text-white py-4 rounded-3xl font-black text-xl shadow-[0_6px_0_#C56521] active:translate-y-2 active:shadow-none hover:bg-[#E07220] transition-all"
          >
            Selesai & Ambil Lencana ✨
          </button>
        </div>
      )}
    </div>
  );
}