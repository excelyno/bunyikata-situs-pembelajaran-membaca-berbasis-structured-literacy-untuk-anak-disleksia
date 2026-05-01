"use client";
import { useRef, useState, useEffect } from "react";

interface Props {
  watermark: string;
  onComplete?: (score: number) => void;
  passThreshold?: number; // Batas minimal kelulusan gambar, default 40%
}

export default function DrawingCanvas({ watermark, onComplete, passThreshold = 40 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null); // Canvas untuk anak menggambar
  const bgCanvasRef = useRef<HTMLCanvasElement>(null); // Canvas untuk garis putus-putus
  const hitboxCanvasRef = useRef<HTMLCanvasElement>(null); // Canvas rahasia untuk hitung zona aman
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [validationState, setValidationState] = useState<'idle' | 'success' | 'fail'>('idle');
  const [currentScore, setCurrentScore] = useState<number>(0);

  // Inisialisasi Canvas saat watermark berubah
  useEffect(() => {
    // 1. Setup Canvas Menggambar (Foreground)
    const fgCanvas = canvasRef.current;
    if (fgCanvas) {
      const fgCtx = fgCanvas.getContext("2d");
      if (fgCtx) {
        fgCtx.lineCap = "round";
        fgCtx.lineJoin = "round";
        fgCtx.lineWidth = 16; // Cukup tebal agar mudah
        fgCtx.strokeStyle = "#D97736"; // Warna oranye khas tema
      }
    }

    // 2. Setup Canvas Latar (Visual Garis Putus-putus)
    const bgCanvas = bgCanvasRef.current;
    if (bgCanvas && watermark) {
      const bgCtx = bgCanvas.getContext("2d");
      if (bgCtx) {
        bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        bgCtx.font = "900 180px 'Nunito', sans-serif";
        bgCtx.textAlign = "center";
        bgCtx.textBaseline = "middle";
        bgCtx.setLineDash([12, 12]); // Efek putus-putus
        bgCtx.lineWidth = 8;
        bgCtx.strokeStyle = "#D1D5DB"; // Abu-abu
        bgCtx.strokeText(watermark, bgCanvas.width / 2, bgCanvas.height / 2 + 15);
      }
    }

    // 3. Setup Canvas Hitbox (Tersembunyi, untuk Penilaian)
    const hitCanvas = hitboxCanvasRef.current;
    if (hitCanvas && watermark) {
      const hitCtx = hitCanvas.getContext("2d");
      if (hitCtx) {
        hitCtx.clearRect(0, 0, hitCanvas.width, hitCanvas.height);
        hitCtx.font = "900 180px 'Nunito', sans-serif";
        hitCtx.textAlign = "center";
        hitCtx.textBaseline = "middle";
        // ZONA AMAN: Garis tebal 45px. Selama coretan anak ada di dalam area tebal ini, dianggap benar.
        hitCtx.lineWidth = 45; 
        hitCtx.lineCap = "round";
        hitCtx.lineJoin = "round";
        hitCtx.strokeStyle = "black";
        hitCtx.strokeText(watermark, hitCanvas.width / 2, hitCanvas.height / 2 + 15);
      }
    }

    // Bersihkan coretan sebelumnya
    clearCanvas();
    setValidationState('idle');
  }, [watermark]);

  // Fungsi Suara (TTS)
  const playAudio = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(text);
      speech.lang = "id-ID";
      speech.rate = 0.9;
      window.speechSynthesis.speak(speech);
    }
  };

  // --- Fungsi Menggambar ---
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (validationState !== 'idle') return; // Matikan input saat pop-up muncul
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.beginPath(); // Reset agar garis tidak nyambung
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || validationState !== 'idle') return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      if (e.cancelable) e.preventDefault(); 
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // --- Algoritma Penilaian ---
  const handleSelesai = () => {
    const fgCanvas = canvasRef.current;
    if (!fgCanvas) return;

    const fgCtx = fgCanvas.getContext("2d");
    if (!fgCtx) return;

    const fgData = fgCtx.getImageData(0, 0, fgCanvas.width, fgCanvas.height).data;

    // Hitung total pixel yang sudah digambar anak
    let totalDrawn = 0;
    for (let i = 3; i < fgData.length; i += 4) {
      if (fgData[i] > 50) totalDrawn++;
    }

    // --- MODE BEBAS: Jika tidak ada watermark/target (mis. "Gambar kata favoritmu") ---
    // Cukup pastikan anak sudah menggambar sesuatu (minimal 200px), langsung lulus.
    if (!watermark || watermark.trim() === "") {
      if (totalDrawn < 200) {
        setValidationState('fail');
        playAudio("Sepertinya coretanmu masih terlalu sedikit. Ayo coba lagi!");
        return;
      }
      const freeScore = 100; // Mode bebas selalu dapat nilai sempurna
      setCurrentScore(freeScore);
      setValidationState('success');
      playAudio("Hebat sekali! Gambaranmu sangat bagus.");
      return;
    }

    // --- MODE TARGET: Ada watermark, hitung akurasi coretan vs hitbox huruf ---
    const hitCanvas = hitboxCanvasRef.current;
    if (!hitCanvas) return;
    const hitCtx = hitCanvas.getContext("2d");
    if (!hitCtx) return;

    const hitData = hitCtx.getImageData(0, 0, hitCanvas.width, hitCanvas.height).data;

    let overlapPixels = 0;
    let strayPixels = 0;

    for (let i = 3; i < fgData.length; i += 4) {
      const isUserDrawn = fgData[i] > 50;
      if (isUserDrawn) {
        const isSafeZone = hitData[i] > 50;
        if (isSafeZone) {
          overlapPixels++;
        } else {
          strayPixels++;
        }
      }
    }

    const total = overlapPixels + strayPixels;

    if (total < 200) {
      setValidationState('fail');
      playAudio("Sepertinya coretanmu masih terlalu sedikit. Ayo coba lagi!");
      return;
    }

    const accuracy = (overlapPixels / total) * 100;
    const finalScore = Math.round(accuracy);
    setCurrentScore(finalScore);

    if (finalScore >= passThreshold) {
      setValidationState('success');
      playAudio("Hebat sekali! Tulisanmu sangat bagus.");
    } else {
      setValidationState('fail');
      playAudio("Kurang tepat. Ayo ulangi lagi, kamu pasti bisa!");
    }
  };

  // --- Handler Pop-up ---
  const handleLanjut = () => {
    if (onComplete) {
      onComplete(currentScore);
    }
    setValidationState('idle');
    clearCanvas();
  };

  const handleUlangi = () => {
    setValidationState('idle');
    clearCanvas();
  };

  return (
    <div className="flex flex-col items-center w-full relative">
      {/* Area Kanvas */}
      <div className="relative border-4 border-[#FDE9D2] rounded-[40px] overflow-hidden bg-white shadow-inner mb-6 w-[300px] h-[300px]">
        
        {/* Canvas Rahasia (Hidden) untuk kalkulasi saja */}
        <canvas 
          ref={hitboxCanvasRef} 
          width={300} 
          height={300} 
          className="absolute inset-0 hidden" 
        />

        {/* Canvas Visual Background (Putus-putus) */}
        <canvas 
          ref={bgCanvasRef} 
          width={300} 
          height={300} 
          className="absolute inset-0 pointer-events-none opacity-60" 
        />
        
        {/* Canvas Utama Anak */}
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className={`touch-none absolute inset-0 z-10 ${validationState === 'idle' ? 'cursor-crosshair' : 'cursor-default pointer-events-none'} bg-transparent`}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        {/* OVERLAYS POP-UP */}
        {validationState === 'success' && (
          <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-in zoom-in duration-300">
            <div className="text-6xl mb-2 animate-bounce">🌟</div>
            <h3 className="text-3xl font-black text-green-600 mb-1 tracking-wide">Hebat!</h3>
            <p className="text-base font-bold text-gray-700 text-center mb-6">Akurasi tulisanmu: {currentScore}%</p>
            <button 
              onClick={handleLanjut}
              className="bg-green-500 text-white px-8 py-3 rounded-2xl font-black shadow-[0_6px_0_#16A34A] active:translate-y-2 active:shadow-none hover:bg-green-600 transition-all text-lg"
            >
              Lanjutkan ➔
            </button>
          </div>
        )}

        {validationState === 'fail' && (
          <div className="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-in zoom-in duration-300">
            <div className="text-6xl mb-2 animate-pulse">🤔</div>
            <h3 className="text-2xl font-black text-[#D97736] mb-1 text-center tracking-wide">Kurang Tepat</h3>
            <p className="text-sm font-bold text-gray-600 text-center mb-6 px-2 leading-relaxed">
              Tulisanmu belum pas di garis. Ayo kita coba lagi!
            </p>
            <button 
              onClick={handleUlangi}
              className="bg-[#D97736] text-white px-8 py-3 rounded-2xl font-black shadow-[0_6px_0_#B35D26] active:translate-y-2 active:shadow-none hover:bg-[#C2652A] transition-all text-lg"
            >
              Ulangi ↺
            </button>
          </div>
        )}
      </div>

      {/* Tombol Kontrol (Disembunyikan jika pop-up muncul) */}
      <div className={`flex gap-4 w-full justify-center transition-opacity duration-300 ${validationState !== 'idle' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <button 
          onClick={clearCanvas}
          className="bg-[#FFF6ED] text-[#D97736] px-6 py-3 rounded-2xl font-bold border-2 border-[#D97736] hover:bg-[#FDE9D2] active:scale-95 transition-all shadow-sm flex items-center gap-2"
        >
          🗑️ Hapus
        </button>
        <button 
          onClick={handleSelesai}
          className="bg-[#D97736] text-white px-8 py-3 rounded-2xl font-black shadow-[0_4px_0_#B35D26] active:translate-y-1 active:shadow-none hover:bg-[#C2652A] transition-all flex items-center gap-2"
        >
          Cek Nilai <span>→</span>
        </button>
      </div>
    </div>
  );
}