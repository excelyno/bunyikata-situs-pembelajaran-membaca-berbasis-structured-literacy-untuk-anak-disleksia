"use client";
import { useRef, useState, useEffect } from "react";

interface Props {
  watermark?: string;
}

export default function DrawingCanvas({ watermark }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Supaya garisnya tidak pecah-pecah
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 12;
    ctx.strokeStyle = "#4f46e5"; // Warna tinta indigo
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.beginPath(); // Reset path biar ga nyambung pas nulis lagi
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Hitung posisi kursor/jari relatif terhadap canvas
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
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

  return (
    <div className="relative border-4 border-orange-200 rounded-[32px] overflow-hidden bg-white shadow-inner flex flex-col items-center">
      {/* Watermark untuk jiplak huruf */}
      {watermark && (
        <div className="absolute inset-0 flex items-center justify-center text-[200px] font-black text-gray-100 pointer-events-none select-none">
          {watermark}
        </div>
      )}
      
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="touch-none bg-transparent relative z-10 cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      <button 
        onClick={clearCanvas}
        className="absolute bottom-4 right-4 bg-red-100 text-red-500 p-3 rounded-full font-bold hover:bg-red-200 active:scale-95 transition-all z-20 shadow-sm"
        title="Hapus Tulisan"
      >
        🗑️
      </button>
    </div>
  );
}