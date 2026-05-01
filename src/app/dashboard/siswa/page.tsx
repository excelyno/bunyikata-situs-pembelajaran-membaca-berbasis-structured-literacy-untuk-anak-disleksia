"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SiswaDashboard() {
  const router = useRouter();
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/siswa/recommendation")
      .then(async (res) => {
        if (!res.ok) throw new Error(`API Error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.recommended) setRecommendation(data.recommended);
      })
      .catch(e => console.error("Gagal memuat rekomendasi:", e))
      .finally(() => setIsLoading(false));
  }, []);

  const handleLogout = () => {
    document.cookie = "bunyikata_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex flex-col items-center justify-center">
        <div className="text-8xl mb-4 animate-bounce">✨</div>
        <h2 className="text-2xl font-black text-[#5C4D4A] tracking-wide">Tunggu sebentar ya...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] p-4 pb-12 font-sans">
      {/* Header - Ringkas & Ikonik */}
      <header className="flex justify-between items-center mb-6 px-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-[#EF9550] rounded-full flex items-center justify-center text-2xl shadow-sm">🦸‍♂️</div>
          <div>
            <h1 className="text-xl font-black text-[#5C4D4A] leading-tight">Halo, Pahlawan!</h1>
            <p className="text-[#8D7B68] text-sm font-bold">Siap bermain?</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="bg-[#FDE9D2] text-[#8D7B68] px-4 py-2 rounded-2xl font-black text-sm hover:bg-[#EF9550] hover:text-white transition-all border-b-4 border-[#EBCDB0] active:border-b-0"
        >
          Keluar
        </button>
      </header>

      {/* Pratest Section - Dibuat Menarik seperti 'Banner Hadiah' */}
      <div 
        onClick={() => router.push("/games/pratest")}
        className="bg-[#EF9550] rounded-[35px] p-6 text-white mb-10 shadow-[0_8px_0_#D17A20] flex items-center justify-between cursor-pointer hover:scale-[1.02] active:scale-95 transition-all"
      >
        <div className="max-w-[60%]">
          <h2 className="text-2xl font-black mb-1">Cek Kekuatan!</h2>
          <p className="text-[#FFE0C7] font-bold text-sm leading-relaxed">
            Main sebentar yuk, supaya kita tahu misi yang cocok untukmu.
          </p>
        </div>
        <div className="text-6xl mr-2">🚀</div>
      </div>

      <h2 className="text-xl font-black text-[#5C4D4A] mb-6 px-2 tracking-wide">PILIH MISI SERU:</h2>

      {/* Grid Zona Latihan - Visual & Berjarak */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        
        {/* Card Template Function */}
        {[
          { id: 'motorik', title: 'Bantu Budi', tag: 'ZONA TULIS', icon: '✍️', color: '#FFF4E8', border: '#FDE9D2', accent: '#EF9550', path: '/games/terapi/motorik' },
          { id: 'auditori', title: 'Dengar Suara', tag: 'ZONA DENGAR', icon: '🎧', color: '#F0F7FF', border: '#D0E4FF', accent: '#3B82F6', path: '/games/terapi/auditori' },
          { id: 'visual', title: 'Cari Gambar', tag: 'ZONA LIHAT', icon: '👁️', color: '#F0FFF4', border: '#C6F6D5', accent: '#10B981', path: '/games/terapi/visual' },
        ].map((zone) => (
          <div 
            key={zone.id}
            onClick={() => router.push(zone.path)}
            style={{ backgroundColor: zone.color, borderColor: zone.border }}
            className={`relative p-8 rounded-[40px] border-2 border-b-[10px] cursor-pointer transition-all hover:-translate-y-2 active:border-b-2
              ${recommendation === zone.id ? 'ring-4 ring-[#EF9550] ring-offset-4 ring-offset-[#FFF8F0]' : ''}`}
          >
            {recommendation === zone.id && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#EF9550] text-white px-4 py-1 rounded-full text-[10px] font-black shadow-md whitespace-nowrap">
                ⭐ MISI UNTUKMU
              </div>
            )}
            <div className="text-7xl mb-4 text-center">{zone.icon}</div>
            <h3 className="text-2xl font-black text-[#5C4D4A] mb-1 text-center">{zone.title}</h3>
            <div 
              style={{ color: zone.accent }}
              className="font-black text-[12px] tracking-[0.15em] text-center"
            >
              {zone.tag}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}