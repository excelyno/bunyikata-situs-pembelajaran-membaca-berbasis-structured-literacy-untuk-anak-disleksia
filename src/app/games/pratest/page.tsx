"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Import Semua 9 Soal
import MotorikSoal1 from "./components/motorik/soal1";
import MotorikSoal2 from "./components/motorik/soal2";
import MotorikSoal3 from "./components/motorik/soal3";
import VisualSoal1 from "./components/visual/soal1";
import VisualSoal2 from "./components/visual/soal2";
import VisualSoal3 from "./components/visual/soal3";
import AuditorySoal1 from "./components/auditory/soal1";
import AuditorySoal2 from "./components/auditory/soal2";
import AuditorySoal3 from "./components/auditory/soal3";

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

  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-8xl mb-6">🐸</div>
        <h1 className="text-4xl font-black text-blue-900 mb-8">Halo Pahlawan!</h1>
        <button onClick={handleStart} disabled={loading} className="bg-green-500 text-white px-12 py-5 rounded-[30px] font-black text-2xl shadow-[0_8px_0_#166534] active:translate-y-2 active:shadow-none transition-all">
          {loading ? "Gasss! 🚀" : "Mulai Pemanasan! 🚀"}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-4">
      {/* Progress Bar (Dibagi 9 Soal) */}
      <div className="w-full max-w-md bg-white rounded-full h-3 mb-12 border-2 border-blue-100 overflow-hidden">
        <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${(currentStep / 9) * 100}%` }}></div>
      </div>

      <div className="w-full max-w-2xl bg-white p-10 rounded-[50px] shadow-sm border border-blue-100 text-center relative min-h-[400px] flex flex-col justify-center">
        
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
           <div className="animate-in zoom-in duration-300">
              <div className="text-7xl mb-4">🏆</div>
              <h2 className="text-3xl font-black text-blue-900 mb-2">Pemanasan Selesai!</h2>
              <p className="text-blue-600 font-medium mb-10">Kamu berhasil melewati semua ujian dengan hebat.</p>
              <button onClick={handleFinish} disabled={loading} className="bg-blue-600 text-white px-10 py-4 rounded-3xl font-black text-xl shadow-[0_8px_0_#1e3a8a] active:translate-y-2 active:shadow-none transition-all mt-6">
                {loading ? "Menyimpan... 🏃‍♂️" : "Lanjut ke Dashboard"}
              </button>
           </div>
        )}
      </div>
    </div>
  );
}