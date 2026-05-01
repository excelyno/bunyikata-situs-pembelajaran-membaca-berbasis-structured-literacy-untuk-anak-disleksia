"use client";
import { useRouter } from "next/navigation";

export default function AuditoriMenu() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-purple-50 p-6 flex flex-col items-center justify-center relative">
      <button 
        onClick={() => router.push("/dashboard/siswa")}
        className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center font-black text-xl text-purple-500 shadow-sm hover:scale-110 transition-all"
      >
        {"<"}
      </button>

      <div className="text-center mb-12">
        <div className="text-8xl mb-4 animate-bounce">🦁</div>
        <h1 className="text-4xl font-black text-purple-600 mb-2">Zona Auditori</h1>
        <p className="text-purple-800 font-medium max-w-md mx-auto">
          Tajamkan telingamu! Bantu Singa menjadi Raja Hutan dengan mendengarkan suara.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {/* Mode Belajar */}
        <div 
          onClick={() => router.push("/games/terapi/auditori/belajar")}
          className="bg-white p-8 rounded-[40px] border-b-8 border-purple-200 cursor-pointer hover:-translate-y-2 transition-all flex flex-col items-center text-center"
        >
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center text-5xl mb-6">📢</div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Dengar & Kenali</h2>
          <p className="text-gray-500 font-medium text-sm">Klik hurufnya dan dengarkan cara membacanya dengan benar.</p>
        </div>

        {/* Mode Petualangan */}
        <div 
          onClick={() => router.push("/games/terapi/auditori/petualangan")}
          className="bg-white p-8 rounded-[40px] border-b-8 border-purple-200 cursor-pointer hover:-translate-y-2 transition-all flex flex-col items-center text-center"
        >
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center text-5xl mb-6">⚔️</div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Singa Bertarung</h2>
          <p className="text-gray-500 font-medium text-sm">Dengarkan tantangan dan pilih huruf yang benar untuk mengalahkan musuh!</p>
        </div>
      </div>
    </div>
  );
}