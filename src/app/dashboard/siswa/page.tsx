"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/app/components/LogoutButton";

export default function SiswaDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPratestStatus = async () => {
      try {
        const res = await fetch("/api/auth/check-pratest");
        const data = await res.json();

        if (res.ok) {
          // JIKA BELUM SELESAI PRATEST -> TENDANG KE HALAMAN PRATEST
          if (data.hasCompletedPratest === false) {
            router.push("/games/pratest");
          } else {
            // JIKA SUDAH SELESAI -> BUKA KUNCI DASHBOARD
            setLoading(false);
          }
        } else {
          // Kalau error (misal token expired), lempar ke login
          router.push("/login");
        }
      } catch (error) {
        console.error("Gagal mengecek Pratest", error);
      }
    };

    checkPratestStatus();
  }, [router]);

  // Tampilkan layar loading saat sistem sedang mengecek status
// Tampilkan layar kosong sekejap (tanpa teks loading) biar transisi terasa instan
  if (loading) {
    return <div className="min-h-screen bg-blue-50"></div>;
  }

  // TAMPILAN DASHBOARD (Hanya muncul jika loading selesai / Pratest sudah lulus)
  return (
    <div className="min-h-screen bg-blue-50 p-6 sm:p-10 flex flex-col items-center">
      <div className="w-full max-w-4xl flex justify-between items-center mb-10">
        <div className="bg-white px-6 py-2 rounded-full shadow-sm border border-blue-100 font-bold text-blue-600 flex items-center gap-2">
          <span>Level: Pemula 🐣</span>
          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">0 XP</span>
        </div>
        <LogoutButton />
      </div>

      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-blue-900 mb-4">Ayo Bermain! 🐸</h1>
        <p className="text-blue-700 font-medium">Pilih tantanganmu hari ini dan kumpulkan koin!</p>
      </div>

      <div className="w-full max-w-md">
        <Link href="/games/motorik" className="group block mb-4">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border-b-8 border-green-500 hover:translate-y-2 transition-all flex items-center gap-6">
            <div className="text-6xl group-hover:rotate-12 transition-all">🏃‍♂️</div>
            <div className="text-left">
              <h3 className="text-2xl font-black text-gray-800">Petualangan Motorik</h3>
              <p className="text-gray-500 font-medium">Latihan gerak dan bentuk!</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}