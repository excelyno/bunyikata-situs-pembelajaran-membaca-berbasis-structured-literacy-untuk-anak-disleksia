"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

export default function DetektifKiki() {
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
      <div className="flex gap-1 justify-center items-end bg-gray-900/30 p-4 rounded-3xl border-4 border-dashed border-emerald-400/50 min-h-[120px] w-full max-w-sm mx-auto">
        {word.split("").map((char, idx) => {
          if (ascenders.includes(char)) {
            return <div key={idx} className="w-10 h-20 bg-emerald-400/80 rounded-t-xl" />;
          } else if (descenders.includes(char)) {
            return <div key={idx} className="w-10 h-20 bg-emerald-400/80 rounded-b-xl -mb-6" />;
          } else {
            return <div key={idx} className="w-10 h-14 bg-emerald-400/80 rounded-md" />;
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
      if (subPhase < 4) {
        setSubPhase((prev) => prev + 1);
      } else {
        setPhase((prev) => prev + 1); // Pindah Level
        setSubPhase(0);
      }
    } else {
      setMistakes((prev) => prev + 1);
      alert("Wah, belum tepat! Kiki yakin kamu bisa, coba teliti lagi ya! 🧐");
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
    <div className="min-h-screen bg-[#0F3D3E] text-white p-6 flex flex-col items-center justify-center relative font-sans overflow-hidden">
      
      {/* Efek Bintang Hutan */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-200 via-[#0F3D3E] to-[#0F3D3E]" />

      <button onClick={() => router.push("/games/terapi/visual")} className="absolute top-6 left-6 w-14 h-14 bg-white/10 text-white rounded-full flex items-center justify-center font-black text-2xl backdrop-blur-md z-20 hover:bg-white/20 transition-all">{"<"}</button>

      {/* --- INTRO --- */}
      {phase === 0 && (
        <div className="bg-[#1C5D5E] p-10 rounded-[40px] shadow-2xl text-center max-w-xl z-10 border-4 border-emerald-500/30 relative">
          <div className="text-8xl mb-6 animate-bounce">🦉✨</div>
          <h1 className="text-4xl font-black text-emerald-300 mb-6 tracking-wide">Petualangan Detektif Kiki</h1>
          <p className="text-emerald-100 text-lg leading-relaxed mb-8 font-medium">
            Kiki si Burung Hantu menjatuhkan kacamata ajaibnya dan kesulitan melihat. 
            Ia butuh bantuanmu sebagai Detektif Kata untuk menemukan barang-barangnya yang hilang di hutan kegelapan!
          </p>
          <button onClick={() => setPhase(1)} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-4 rounded-3xl font-black text-xl shadow-[0_6px_0_#059669] active:translate-y-2 active:shadow-none transition-all">
            Mulai Penyelidikan 🔍
          </button>
        </div>
      )}

      {/* --- LEVEL 1 : FLASH WORD --- */}
      {phase === 1 && (
        <div className="w-full max-w-2xl flex flex-col items-center z-10">
          <div className="bg-[#1C5D5E]/80 px-6 py-2 rounded-full text-emerald-300 font-bold mb-6 tracking-widest">
            LEVEL 1: MEMORI VISUAL ({subPhase + 1}/5)
          </div>

          <div className="bg-white p-12 rounded-[40px] shadow-2xl text-center w-full min-h-[400px] flex flex-col justify-center border-b-8 border-emerald-200">
            {showFlash ? (
              <div className="animate-pulse">
                <p className="text-emerald-600 font-bold mb-4 uppercase tracking-widest">Ingat kata ini baik-baik!</p>
                <h2 className="text-8xl font-black text-[#0F3D3E] tracking-widest drop-shadow-md">
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
                      className="bg-emerald-50 text-emerald-800 text-3xl font-black py-5 rounded-3xl hover:bg-emerald-500 hover:text-white border-b-4 border-emerald-200 hover:border-emerald-700 transition-all"
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
          <div className="bg-[#1C5D5E]/80 px-6 py-2 rounded-full text-emerald-300 font-bold mb-6 tracking-widest">
            LEVEL 2: SILUET KATA ({subPhase + 1}/5)
          </div>

          <div className="bg-[#1C5D5E] p-8 rounded-[40px] shadow-2xl text-center w-full border-4 border-emerald-500/30">
            <div className="text-[100px] drop-shadow-xl mb-4 bg-white/10 rounded-3xl inline-block px-8 py-4">
              {LEVEL_2_DATA[subPhase].image}
            </div>
            
            <p className="text-emerald-200 font-bold mb-4">Pilih kata yang bentuknya pas dengan kotak di bawah ini:</p>
            
            {/* Visualisasi Siluet Box */}
            <div className="mb-10">
              {renderSilhouette(LEVEL_2_DATA[subPhase].target)}
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {LEVEL_2_DATA[subPhase].options.map((opt, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handlePick(opt, LEVEL_2_DATA[subPhase].target, LEVEL_2_DATA[subPhase].category)}
                  className="bg-emerald-500 text-white text-2xl font-black py-4 px-8 rounded-2xl shadow-[0_6px_0_#059669] active:translate-y-2 active:shadow-none transition-all tracking-widest"
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
          <div className="bg-[#1C5D5E]/80 px-6 py-2 rounded-full text-emerald-300 font-bold mb-6 tracking-widest">
            LEVEL 3: MENCARI PENIPU ({subPhase + 1}/5)
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-emerald-300 mb-2">Hati-hati Rubah Penipu! 🦊</h2>
            <p className="text-emerald-100 text-lg">Pilih papan petunjuk dengan tulisan yang BENAR.</p>
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
        <div className="bg-white p-10 rounded-[40px] shadow-2xl text-center max-w-xl z-10 border-b-8 border-yellow-400 animate-in zoom-in duration-500">
          <div className="text-[120px] mb-4 animate-bounce">🎖️🦉</div>
          <h1 className="text-4xl font-black text-yellow-500 mb-4 tracking-wide">Misi Berhasil!</h1>
          <p className="text-gray-600 text-lg font-medium leading-relaxed mb-8">
            Terima kasih Detektif! Berkat matamu yang tajam, Kiki berhasil menemukan kacamata dan barang-barangnya. 
            Kiki memberimu lencana Bintang Emas!
          </p>
          <button 
            onClick={finishGame} 
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 py-4 rounded-3xl font-black text-xl shadow-[0_6px_0_#CA8A04] active:translate-y-2 active:shadow-none transition-all"
          >
            Ambil Lencana & Selesai ✨
          </button>
        </div>
      )}
    </div>
  );
}