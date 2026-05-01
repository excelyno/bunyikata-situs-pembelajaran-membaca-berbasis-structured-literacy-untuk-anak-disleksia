"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import DrawingCanvas from "@/app/components/DrawingCanvas";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const NUMBERS = "1234567890".split("");

export default function MotorikBelajarStepByStep() {
  const router = useRouter();
  
  const [step, setStep] = useState<number>(1);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);

  const handleNextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const handlePrevStep = () => {
    if (step === 1) router.push("/games/terapi/motorik");
    else setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSelectChar = (char: string) => {
    setActiveItem(char);
  };

  // Fungsi ini yang akan dipanggil OLEH DrawingCanvas saat anak klik tombol "Selanjutnya" di dalam canvas
  const handleFinishDrawing = (calculatedScore: number) => {
    setScore(calculatedScore);
    handleNextStep(); // Otomatis pindah ke Step 3 (Penilaian)
  };

  const playAudio = (text: string) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "id-ID";
    window.speechSynthesis.speak(speech);
  };

  const renderProgress = () => (
    <div className="flex flex-col items-center mb-8">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-4 h-4 rounded-full ${step >= 1 ? 'bg-[#D97736]' : 'bg-[#FDE9D2]'}`}></div>
        <div className={`w-12 h-1 rounded-full ${step >= 2 ? 'bg-[#D97736]' : 'bg-[#FDE9D2]'}`}></div>
        <div className={`w-4 h-4 rounded-full ${step >= 2 ? 'bg-[#D97736]' : 'bg-[#FDE9D2]'}`}></div>
        <div className={`w-12 h-1 rounded-full ${step >= 3 ? 'bg-[#D97736]' : 'bg-[#FDE9D2]'}`}></div>
        <div className={`w-4 h-4 rounded-full ${step >= 3 ? 'bg-[#D97736]' : 'bg-[#FDE9D2]'}`}></div>
      </div>
      <p className="text-[#D97736] font-bold text-sm">Langkah {step} dari 3</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFDF9] pt-8 px-6 pb-12 font-sans flex flex-col items-center">
      
      <header className="w-full max-w-3xl flex justify-between items-start mb-4">
        <button 
          onClick={handlePrevStep}
          className="w-12 h-12 bg-[#FFF6ED] rounded-2xl flex items-center justify-center text-[#D97736] text-xl font-black border-2 border-[#FDE9D2] hover:bg-[#FDE9D2] transition-colors"
        >
          ←
        </button>
        {renderProgress()}
        <div className="w-12"></div>
      </header>

      {/* STEP 1: PILIH HURUF */}
      {step === 1 && (
        <div className="w-full max-w-3xl animate-in slide-in-from-right-8 duration-500">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-[#5C4D4A] mb-2">Pilih Huruf atau Angka</h1>
            <p className="text-[#8D7B68] font-medium text-lg">Huruf apa yang mau kamu tulis hari ini?</p>
          </div>

          <div className="bg-[#FFF8F0] border-2 border-[#FDE9D2] rounded-[40px] p-8 shadow-sm">
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {ALPHABET.map((char) => (
                <button 
                  key={char} 
                  onClick={() => handleSelectChar(char)}
                  className={`w-14 h-14 text-2xl font-black rounded-2xl transition-all flex items-center justify-center border-b-4 active:border-b-0 active:translate-y-1
                    ${activeItem === char 
                      ? "bg-[#D97736] text-white border-[#B35D26] shadow-sm scale-110" 
                      : "bg-white text-[#5C4D4A] border-[#FDE9D2] hover:bg-[#FFF6ED] hover:text-[#D97736]"
                    }`}
                >
                  {char}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {NUMBERS.map((num) => (
                <button 
                  key={num} 
                  onClick={() => handleSelectChar(num)}
                  className={`w-14 h-14 text-2xl font-black rounded-2xl transition-all flex items-center justify-center border-b-4 active:border-b-0 active:translate-y-1
                    ${activeItem === num 
                      ? "bg-[#D97736] text-white border-[#B35D26] shadow-sm scale-110" 
                      : "bg-white text-[#5C4D4A] border-[#FDE9D2] hover:bg-[#FFF6ED] hover:text-[#D97736]"
                    }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {activeItem && (
            <div className="mt-8 flex justify-center animate-in fade-in zoom-in">
              <button 
                onClick={handleNextStep}
                className="bg-[#4A7C59] text-white px-12 py-4 rounded-full font-black text-xl shadow-[0_6px_0_#2E523A] active:translate-y-2 active:shadow-none hover:bg-[#3B6648] transition-all flex items-center gap-3"
              >
                Mulai Menulis {activeItem} <span>→</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: KANVAS LATIHAN */}
      {step === 2 && activeItem && (
        <div className="w-full max-w-2xl flex flex-col items-center animate-in slide-in-from-right-8 duration-500">
          <div className="text-center mb-6 flex flex-col items-center">
            <h1 className="text-3xl font-black text-[#5C4D4A] mb-2 flex items-center gap-3">
              Ikuti Garisnya!
              <button onClick={() => playAudio(`Ayo ikuti garis putus-putus untuk huruf ${activeItem}`)} className="w-10 h-10 bg-[#FFF6ED] rounded-full flex items-center justify-center text-xl text-[#D97736] hover:scale-110 transition-transform">
                🔊
              </button>
            </h1>
            <p className="text-[#8D7B68] font-medium">Usahakan jangan keluar dari garis putus-putus ya.</p>
          </div>

          {/* Canvas dirender bersih, tidak ada dummy button lagi. Biarkan canvas yang ngurus tombol "Cek Nilai" */}
          <DrawingCanvas 
            watermark={activeItem} 
            onComplete={handleFinishDrawing} 
          />
        </div>
      )}

      {/* STEP 3: HASIL & PENILAIAN */}
      {step === 3 && activeItem && (
        <div className="w-full max-w-md bg-[#FFF8F0] border-4 border-[#FDE9D2] rounded-[40px] p-8 text-center flex flex-col items-center animate-in zoom-in duration-500">
          <div className="text-8xl mb-6">
            {score >= 80 ? "🌟" : score >= 50 ? "👍" : "💪"}
          </div>
          
          <h2 className="text-3xl font-black text-[#5C4D4A] mb-2">
            {score >= 80 ? "Hebat Sekali!" : score >= 50 ? "Bagus, Sedikit Lagi!" : "Ayo Coba Lagi!"}
          </h2>
          
          <div className="bg-white px-6 py-4 rounded-3xl border-2 border-[#FDE9D2] mb-8 w-full">
            <p className="text-[#8D7B68] font-bold text-sm mb-1">Skor Kerapian Garismu:</p>
            <div className="text-5xl font-black text-[#D97736]">{score}</div>
            <p className="text-[#8D7B68] text-sm mt-2">
              {score < 80 && "Garismu masih sedikit keluar jalur, yuk kita latih lagi biar rapi!"}
              {score >= 80 && "Tulisanmu sudah sangat rapi mengikuti pola putus-putus!"}
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <button 
              onClick={() => setStep(2)}
              className="w-full bg-[#FFF6ED] text-[#D97736] py-4 rounded-2xl font-black border-2 border-[#D97736] hover:bg-[#FDE9D2] active:scale-95 transition-all"
            >
              🔄 Ulangi Huruf {activeItem}
            </button>
            <button 
              onClick={() => { setActiveItem(null); setStep(1); }}
              className="w-full bg-[#D97736] text-white py-4 rounded-2xl font-black shadow-[0_4px_0_#B35D26] active:translate-y-1 active:shadow-none hover:bg-[#C2652A] transition-all"
            >
              Pilih Huruf Lain
            </button>
          </div>
        </div>
      )}

    </div>
  );
}