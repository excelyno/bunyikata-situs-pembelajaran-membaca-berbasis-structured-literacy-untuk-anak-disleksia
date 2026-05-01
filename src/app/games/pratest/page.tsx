"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Import Semua 9 Soal (Ini harus diredesain di file aslinya masing-masing)
import MotorikSoal1 from "./components/motorik/soal1";
import MotorikSoal2 from "./components/motorik/soal2";
import MotorikSoal3 from "./components/motorik/soal3";
import VisualSoal1 from "./components/visual/soal1";
import VisualSoal2 from "./components/visual/soal2";
import VisualSoal3 from "./components/visual/soal3";
import AuditorySoal1 from "./components/auditory/soal1";
import AuditorySoal2 from "./components/auditory/soal2";
import AuditorySoal3 from "./components/auditory/soal3";

// Konstanta Palette Warna berdasarkan image_1.png
const COLORS = {
  bgPage: "#F2F1F0", // Abu-abu sangat terang untuk background halaman
  textPrimary: "#4C4C4C", // Abu-abu gelap untuk teks utama
  textHeading: "#5C4D4A", // Cokelat tua untuk judul besar
  accent: "#EF9550", // Peach/Oranye untuk tombol utama dan aksen
  accentText: "#FFFFFF", // Teks putih untuk tombol utama
  cardBg: "#FFFFFF", // Latar belakang kartu putih bersih
  progressEmpty: "#E0E0E0", // Abu-abu muda untuk bar progres kosong
};

export default function PratestGame() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0); 
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/games/session", {
        method: "POST",
        body: JSON.stringify({ sessionType: "PRATEST" }),
      });
      const data = await res.json();
      if (res.ok) {
        setSessionId(data.sessionId);
        setCurrentStep(1); 
      }
    } catch (e) {} finally {
      setLoading(false);
    }
  };

  const handleAnswerLog = async (
    targetItem: string, answeredItem: string, isCorrect: boolean, 
    responseTimeMs: number, errorCategory: string, autoAdvance: boolean = true
  ) => {
    if (!sessionId) return;

    fetch("/api/games/log", {
      method: "POST",
      body: JSON.stringify({ sessionId, targetItem, answeredItem, isCorrect, responseTimeMs, errorCategory }),
    });

    if (autoAdvance) setCurrentStep((prev) => prev + 1);
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await fetch("/api/games/session", {
        method: "PUT",
        body: JSON.stringify({ sessionId, score: 100, durationSec: 300 }),
      });
      router.push("/dashboard/siswa");
    } catch (e) {
      router.push("/dashboard/siswa"); 
    }
  };

  // --- KOMPONEN GAYA ---
  const MainButton = ({ children, onClick, disabled, loadingText }: any) => (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className="bg-[#F18230] text-white px-8 py-4 rounded-2xl font-black text-xl shadow-[0_6px_0_#C56521] active:translate-y-2 active:shadow-none transition-all disabled:opacity-50 flex items-center justify-center gap-3 w-full max-w-sm mx-auto hover:bg-[#E07220]"
    >
      {disabled && loadingText ? loadingText : children}
    </button>
  );

  const GameCard = ({ children }: any) => (
    <div className="w-full max-w-2xl bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-[#FDE9D2] text-center relative min-h-[480px] flex flex-col justify-center">
      {children}
    </div>
  );

  // Komponen Indikator Langkah (Dots)
  const StepIndicator = ({ current }: { current: number }) => {
    return (
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-2 mb-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${step <= current ? "bg-[#F18230]" : "bg-[#FDE9D2]"}`} />
              {step < 9 && (
                <div className={`w-4 md:w-8 h-1 ${step < current ? "bg-[#F18230]" : "bg-[#FDE9D2]"}`} />
              )}
            </div>
          ))}
        </div>
        <p className="text-[#8D7B68] font-bold text-sm">Misi {current} dari 9</p>
      </div>
    );
  };

  // --- STATE 0: MULAI PEMANASAN (Layar Start) ---
  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-[#FFF8EF] flex flex-col items-center justify-center p-6 font-sans">
        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-[#FDE9D2] flex flex-col md:flex-row gap-10 items-center max-w-4xl w-full relative">
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl font-black text-[#5C4033] mb-4 leading-tight">
              Petualangan<br/>Awal
            </h1>
            <p className="text-[#8D7B68] font-medium mb-8 leading-relaxed">
              Yuk, kita cari tahu cara belajarmu supaya BunyiKata bisa jadi teman belajar terbaik untukmu!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-10 text-sm font-bold text-[#8D7B68] justify-center md:justify-start">
              <div className="flex items-center gap-2 bg-[#FFF8EF] px-4 py-2 rounded-full"><span className="text-xl">⏱️</span> ± 10 menit</div>
              <div className="flex items-center gap-2 bg-[#FFF8EF] px-4 py-2 rounded-full"><span className="text-xl">🧩</span> 9 Misi Seru</div>
              <div className="flex items-center gap-2 bg-[#FFF8EF] px-4 py-2 rounded-full"><span className="text-xl">❌</span> Tidak Dinilai</div>
            </div>
            
            <button 
              onClick={handleStart} 
              disabled={loading}
              className="bg-[#F18230] text-white px-10 py-4 rounded-2xl font-black text-xl hover:bg-[#E07220] transition-all shadow-[0_6px_0_#C56521] active:translate-y-2 active:shadow-none w-full md:w-auto"
            >
              {loading ? "Gasss! 🚀" : "Mulai Petualangan! ➔"}
            </button>
          </div>

          <div className="flex-1 flex justify-center relative">
             <div className="absolute w-64 h-64 bg-[#FDE9D2] rounded-full -z-10 blur-xl opacity-50"></div>
             <div className="text-[180px] drop-shadow-xl hover:scale-105 transition-transform">👦🏽</div>
             <div className="absolute top-10 right-10 text-4xl animate-bounce">⭐</div>
             <div className="absolute bottom-10 left-10 text-4xl animate-pulse">🍃</div>
          </div>
        </div>
      </div>
    );
  }

  // --- STATE 1-9 & TAMAT: PROSES GAME ---
  return (
    <div className="min-h-screen bg-[#FFF8EF] flex flex-col items-center py-10 px-4 font-sans relative">
      
      {/* Header dengan Tombol Back (Hanya tampil saat proses game) */}
      <div className="w-full max-w-2xl flex items-center mb-6">
        <button 
          onClick={() => router.push("/dashboard/siswa")}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-black text-xl text-[#8D7B68] hover:bg-[#FDE9D2] hover:text-[#F18230] transition-all shadow-sm"
        >
          {"<"}
        </button>
      </div>

      {currentStep <= 9 && <StepIndicator current={currentStep} />}

      <GameCard>
        {/* Render Motorik (1-3) */}
        {currentStep === 1 && <MotorikSoal1 onAnswer={handleAnswerLog} />}
        {currentStep === 2 && <MotorikSoal2 onAnswer={handleAnswerLog} />}
        {currentStep === 3 && <MotorikSoal3 onAnswer={handleAnswerLog} />}
        
        {/* Render Visual (4-6) */}
        {currentStep === 4 && <VisualSoal1 onAnswer={handleAnswerLog} />}
        {currentStep === 5 && <VisualSoal2 onAnswer={handleAnswerLog} />}
        {currentStep === 6 && <VisualSoal3 onAnswer={handleAnswerLog} />}

        {/* Render Auditory (7-9) */}
        {currentStep === 7 && <AuditorySoal1 onAnswer={handleAnswerLog} />}
        {currentStep === 8 && <AuditorySoal2 onAnswer={handleAnswerLog} />}
        {currentStep === 9 && <AuditorySoal3 onAnswer={handleAnswerLog} />}
        
        {/* Layar Tamat */}
        {currentStep > 9 && (
           <div className="animate-in fade-in duration-500 flex flex-col items-center text-center">
              <h2 className="text-4xl font-black text-[#5C4033] mb-2 leading-tight">
                Yeay! Petualangan<br/>Awal Selesai! 🎉
              </h2>
              <p className="text-lg text-[#8D7B68] font-medium mb-10">
                Ini hasil petualanganmu hari ini!
              </p>

              {/* Ringkasan Placeholder */}
              <div className="w-full bg-[#FFF8EF] p-6 rounded-3xl border border-[#FDE9D2] mb-10 text-left">
                <div className="mb-6">
                  <h3 className="font-black text-[#5C4033] text-lg mb-1">Kekuatanmu</h3>
                  <div className="flex items-center gap-2 text-[#8D7B68] font-medium bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                    <span className="text-yellow-500">⭐</span> Hebat dalam mendengar bunyi!
                  </div>
                </div>
                <div>
                  <h3 className="font-black text-[#5C4033] text-lg mb-1">Yang akan kita latih bersama</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#8D7B68] font-medium bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                      <span className="text-[#F18230]">🔸</span> Membedakan huruf yang mirip
                    </div>
                    <div className="flex items-center gap-2 text-[#8D7B68] font-medium bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                      <span className="text-[#F18230]">🔸</span> Menyusun suku kata menjadi kata
                    </div>
                  </div>
                </div>
              </div>

              <MainButton onClick={handleFinish} disabled={loading} loadingText="Menyimpan... 🏃‍♂️">
                Lanjut ke Beranda ➔
              </MainButton>
           </div>
        )}
      </GameCard>

      {/* Leaf Decorations like image_1.png */}
      <img src="/path/to/bottom_leaf_decor.png" alt="Leaf Decor" className="absolute bottom-0 left-0 w-32 h-auto opacity-70" />
      <img src="/path/to/bottom_leaf_decor.png" alt="Leaf Decor" className="absolute bottom-0 right-0 w-32 h-auto opacity-70 transform scale-x-[-1]" />
    </div>
  );
}