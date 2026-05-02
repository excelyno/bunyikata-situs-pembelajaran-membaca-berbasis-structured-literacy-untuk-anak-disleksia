"use client";
import { useEffect, useState, useRef } from "react";

interface Props {
  onAnswer: (target: string, answered: string, isCorrect: boolean, timeMs: number, category: string) => void;
}

export default function MotorikSoal3({ onAnswer }: Props) {
  const [startTime, setStartTime] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    setStartTime(performance.now());
  }, []);

  // Fungsi Corat-coret Canvas
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    setHasDrawn(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) canvas.getContext("2d")?.beginPath();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#F18230"; // Warna brand orange BunyiKata
    
    // Support mouse & touch screen (HP)
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const handleSubmit = () => {
    const timeMs = Math.round(performance.now() - startTime);
    onAnswer(
      "Draw_b_canvas",
      "stroke_completed",
      true, // Asumsi benar selama anak mau mencoba corat-coret
      timeMs,
      "MOTORIK_DRAWING"
    );
  };

  return (
    <div className="animate-in fade-in duration-500 w-full flex flex-col items-center">
      <p className="text-[#5C4033] font-bold text-xl md:text-2xl mb-8">Ikuti garisnya untuk menulis huruf di bawah ini!</p>
      
      <div className="flex justify-center mb-8 relative bg-white rounded-[40px] shadow-sm">
        {/* Helper text di belakang canvas jika mau ditambah */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-[220px] h-[220px] text-gray-300">
            {/* Jalur huruf 'b' putus-putus (dotted/dashed) */}
            <path 
              d="M60,20 L60,180 M60,100 C120,100 150,120 150,150 C150,180 120,180 60,180" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="10" 
              strokeDasharray="15,15" 
              strokeLinecap="round"
            />
            {/* Panah petunjuk arah (opsional tpi bantu banget) */}
            <path d="M60,25 L55,35 M60,25 L65,35" fill="none" stroke="#F18230" strokeWidth="4" />
          </svg>
        </div>

        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          className="bg-transparent border-4 border-dashed border-[#FDE9D2] rounded-[40px] touch-none cursor-crosshair shadow-sm z-10"
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
        />
      </div>

      <button 
        onClick={handleSubmit}
        disabled={!hasDrawn}
        className={`px-10 py-4 rounded-2xl font-black text-xl transition-all w-full max-w-sm flex items-center justify-center gap-2 ${
          hasDrawn ? "bg-[#4CAF50] text-white shadow-[0_6px_0_#388E3C] hover:bg-[#43A047] active:translate-y-2 active:shadow-none" 
                   : "bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200"
        }`}
      >
        Sudah Selesai! {hasDrawn && "➔"}
      </button>
    </div>
  );
}