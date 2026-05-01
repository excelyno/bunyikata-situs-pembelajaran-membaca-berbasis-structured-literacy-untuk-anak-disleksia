"use client";
import Link from "next/link";
import LogoutButton from "../../components/LogoutButton";

export default function SiswaDashboard() {
  return (
    <div className="min-h-screen bg-blue-50 p-6 sm:p-10 flex flex-col items-center">
      {/* Header Siswa */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-10">
        <div className="bg-white px-6 py-2 rounded-full shadow-sm border border-blue-100 font-bold text-blue-600">
          Level: Pemula 🐣
        </div>
        <LogoutButton />
      </div>

      {/* Konten Utama */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-blue-900 mb-4">Ayo Bermain! 🐸</h1>
        <p className="text-blue-700 font-medium">Pilih tantanganmu hari ini dan kumpulkan skor tinggi!</p>
      </div>

      {/* Kartu Game */}
      <div className="w-full max-w-md">
        <Link href="/games/fonologi/easy" className="group">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border-b-8 border-green-500 hover:translate-y-2 transition-all flex items-center gap-6">
            <div className="text-6xl group-hover:animate-bounce transition-all">🐸</div>
            <div className="text-left">
              <h3 className="text-2xl font-black text-gray-800">Katak Lompat</h3>
              <p className="text-gray-500 font-medium">Latihan bunyi huruf 'B', 'P', 'D'</p>
            </div>
          </div>
        </Link>
      </div>
      
      <p className="mt-10 text-blue-400 font-bold text-sm">SKOR TERTINGGIMU: 0</p>
    </div>
  );
}