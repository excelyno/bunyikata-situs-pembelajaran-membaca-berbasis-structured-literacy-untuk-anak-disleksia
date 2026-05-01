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

    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#3b82f6"; // Warna biru
    
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
    <div className="animate-in fade-in slide-in-from-right duration-500">
      <h2 className="text-3xl font-black text-gray-800 mb-2">Tulis huruf 'b'</h2>
      <p className="text-gray-500 font-medium mb-6">Gunakan jarimu untuk menggambar!</p>
      
      <div className="flex justify-center mb-8">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="bg-yellow-50 border-4 border-dashed border-yellow-300 rounded-3xl touch-none cursor-crosshair"
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
        className={`px-8 py-3 rounded-2xl font-bold text-xl transition-all ${
          hasDrawn ? "bg-green-500 text-white shadow-[0_6px_0_#166534] active:translate-y-2 active:shadow-none" 
                   : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        Sudah Selesai!
      </button>
    </div>
  );
}