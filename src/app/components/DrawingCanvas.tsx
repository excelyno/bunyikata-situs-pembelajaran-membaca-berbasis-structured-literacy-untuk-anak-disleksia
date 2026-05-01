"use client";
import { useRef, useState, useEffect } from "react";

interface Props {
  watermark: string;
  onComplete?: (score: number) => void;
}

export default function DrawingCanvas({ watermark, onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null); // Canvas untuk anak menggambar
  const bgCanvasRef = useRef<HTMLCanvasElement>(null); // Canvas untuk garis putus-putus
  const hitboxCanvasRef = useRef<HTMLCanvasElement>(null); // Canvas rahasia untuk hitung zona aman
  
  const [isDrawing, setIsDrawing] = useState(false);

  // Inisialisasi Canvas
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
  }, [watermark]);

  // --- Fungsi Menggambar ---
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
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
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      // Prevent scrolling saat menggambar di HP
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
    const hitCanvas = hitboxCanvasRef.current;
    
    if (!fgCanvas || !hitCanvas || !onComplete) return;

    const fgCtx = fgCanvas.getContext("2d");
    const hitCtx = hitCanvas.getContext("2d");

    if (!fgCtx || !hitCtx) return;

    const fgData = fgCtx.getImageData(0, 0, fgCanvas.width, fgCanvas.height).data;
    const hitData = hitCtx.getImageData(0, 0, hitCanvas.width, hitCanvas.height).data;

    let overlapPixels = 0; // Piksel di dalam jalur
    let strayPixels = 0; // Piksel keluar jalur

    // Cek setiap piksel. Data gambar bentuknya array [R, G, B, Alpha, R, G, B, Alpha...]
    for (let i = 3; i < fgData.length; i += 4) {
      const isUserDrawn = fgData[i] > 50; // Jika alpha > 50, berarti anak mencoret di titik ini
      
      if (isUserDrawn) {
        const isSafeZone = hitData[i] > 50; // Cek Hitbox di titik yang sama
        if (isSafeZone) {
          overlapPixels++;
        } else {
          strayPixels++;
        }
      }
    }

    const totalDrawn = overlapPixels + strayPixels;

    // Jika anak tidak mencoret sama sekali atau terlalu sedikit
    if (totalDrawn < 200) {
      onComplete(0);
      return;
    }

    // Perhitungan Akurasi: (Piksel Benar / Total Piksel Coretan) * 100
    let accuracy = (overlapPixels / totalDrawn) * 100;

    // Pembulatan nilai
    const finalScore = Math.round(accuracy);
    onComplete(finalScore);
  };

  return (
    <div className="flex flex-col items-center w-full">
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
          className="touch-none absolute inset-0 z-10 cursor-crosshair bg-transparent"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      {/* Tombol Kontrol */}
      <div className="flex gap-4 w-full justify-center">
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