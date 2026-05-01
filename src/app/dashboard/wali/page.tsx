"use client";
import { useEffect, useState } from "react";
import LogoutButton from "@/app/components/LogoutButton";

export default function WaliDashboard() {
  const [data, setData] = useState({ namaWali: "", totalAnak: 0 });
  const [loading, setLoading] = useState(true);

  // Fungsi ambil data dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/dashboard/wali");
        const result = await res.json();
        if (res.ok) {
          setData(result);
        }
      } catch (err) {
        console.error("Gagal load data dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 p-6 flex flex-col">
        <h2 className="text-2xl font-black text-indigo-600 mb-10">BunyiKata</h2>
        <nav className="flex-1 space-y-2">
          <div className="bg-indigo-50 text-indigo-700 p-3 rounded-xl font-bold">Ringkasan Siswa</div>
        </nav>
        <LogoutButton />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-gray-800">
            Halo, {loading ? "..." : data.namaWali}! 
          </h1>
          <p className="text-gray-500">Pantau perkembangan disleksia anak anda di sini.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* KARTU TOTAL ANAK (Sudah Dinamis) */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 font-bold text-sm uppercase">Total Anak</p>
            <h3 className="text-4xl font-black text-indigo-600">
              {loading ? "--" : data.totalAnak}
            </h3>
          </div>
        </div>
      </main>
    </div>
  );
}