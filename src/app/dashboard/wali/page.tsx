"use client";
import { useEffect, useState } from "react";
import LogoutButton from "@/app/components/LogoutButton";

export default function WaliDashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  useEffect(() => {
    fetch("/api/dashboard/wali/students")
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col fixed h-full">
        <h2 className="text-2xl font-black text-indigo-600 mb-10 italic">BunyiKata.</h2>
        <nav className="flex-1 space-y-2">
          <div className="bg-indigo-600 text-white p-3 rounded-xl font-bold shadow-lg shadow-indigo-100">👥 Daftar Siswa</div>
          <div className="text-gray-400 p-3 hover:text-indigo-600 transition-all cursor-not-allowed">📈 Analisis Grup (Soon)</div>
        </nav>
        <LogoutButton />
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-10">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-gray-800">Monitoring Siswa 🏫</h1>
            <p className="text-gray-500 font-medium">Data diolah otomatis dari hasil Pratest & Game.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl border border-gray-200 text-sm font-bold text-gray-600">
            Total Siswa: {students.length}
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-200 rounded-3xl"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((s) => (
              <div 
                key={s.id} 
                onClick={() => setSelectedStudent(s)}
                className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {s.level > 5 ? "🐸" : "🐣"}
                  </div>
                  <span className="text-xs font-black bg-gray-100 text-gray-500 px-3 py-1 rounded-full uppercase tracking-wider">
                    Lvl {s.level}
                  </span>
                </div>
                <h3 className="text-xl font-black text-gray-800 mb-1">{s.nama}</h3>
                <p className="text-sm text-gray-400 font-medium mb-4">{s.xp} Total XP</p>
                
                {/* Mini Accuracy Bars */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                    <span>Motorik</span>
                    <span>{s.stats.motorik.accuracy}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full" style={{ width: `${s.stats.motorik.accuracy}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL DETAIL (The Deep Insight) */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-y-auto p-10 relative">
              <button 
                onClick={() => setSelectedStudent(null)}
                className="absolute top-6 right-6 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold hover:bg-gray-200 transition-all"
              >✕</button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Bagian Kiri: Identitas & Insight Teks */}
                <div>
                  <h2 className="text-4xl font-black text-gray-800 mb-2">{selectedStudent.nama}</h2>
                  <p className="text-indigo-600 font-bold mb-8">Analisis Kemampuan Fonologi</p>

                  <div className="space-y-6">
                    <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                      <h4 className="font-black text-blue-900 mb-2 flex items-center gap-2">
                        <span>🔍</span> Insight Deteksi
                      </h4>
                      <ul className="text-sm text-blue-800 space-y-2 font-medium">
                        {selectedStudent.reversalCount > 0 && (
                          <li>• Terdeteksi pola tertukar huruf (b/d/p/q) sebanyak {selectedStudent.reversalCount}x.</li>
                        )}
                        {selectedStudent.transpositionCount > 0 && (
                          <li>• Terdeteksi kesulitan urutan huruf (Visual Transposition) sebanyak {selectedStudent.transpositionCount}x.</li>
                        )}
                        {selectedStudent.stats.motorik.avgResponseTime > 3000 && (
                          <li>• Respon Motorik lambat ({Math.round(selectedStudent.stats.motorik.avgResponseTime/1000)}s), perlu latihan koordinasi mata-tangan.</li>
                        )}
                        {selectedStudent.reversalCount === 0 && selectedStudent.transpositionCount === 0 && (
                          <li>• Belum ada pola kesalahan signifikan terdeteksi.</li>
                        )}
                      </ul>
                    </div>

                    <div className="bg-green-50 p-6 rounded-3xl border border-green-100">
                      <h4 className="font-black text-green-900 mb-2">💡 Rekomendasi Terapi</h4>
                      <p className="text-sm text-green-800 font-medium">
                        {selectedStudent.stats.visual.accuracy < 50 
                          ? "Fokus pada pengenalan kata visual (Word Search) dan Memori Jangka Pendek." 
                          : "Lanjutkan ke level fonologi yang lebih kompleks (Suku Kata Gabungan)."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bagian Kanan: Visualisasi Grafik */}
                <div className="flex flex-col items-center justify-center">
                   {/* Radar Chart Sederhana pakai SVG */}
                   <div className="relative w-64 h-64 mb-10">
                      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
                        {/* Garis Dasar */}
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="0.5" />
                        <circle cx="50" cy="50" r="30" fill="none" stroke="#f1f5f9" strokeWidth="0.5" />
                        
                        {/* Jalur Data (Radar) */}
                        <polygon 
                          points={`
                            50,${50 - (selectedStudent.stats.motorik.accuracy * 0.45)} 
                            ${50 + (selectedStudent.stats.visual.accuracy * 0.4)} , ${50 + (selectedStudent.stats.visual.accuracy * 0.2)}
                            ${50 - (selectedStudent.stats.auditory.accuracy * 0.4)} , ${50 + (selectedStudent.stats.auditory.accuracy * 0.2)}
                          `}
                          fill="rgba(79, 70, 229, 0.2)"
                          stroke="#4f46e5"
                          strokeWidth="2"
                        />
                      </svg>
                      {/* Label Label */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 font-black text-[10px] text-gray-400 uppercase">Motorik</div>
                      <div className="absolute bottom-4 right-0 font-black text-[10px] text-gray-400 uppercase">Visual</div>
                      <div className="absolute bottom-4 left-0 font-black text-[10px] text-gray-400 uppercase">Auditory</div>
                   </div>

                   {/* Stats Table */}
                   <div className="w-full space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl">
                        <span className="text-xs font-bold text-gray-500 uppercase">Respon Rata-rata</span>
                        <span className="font-black text-gray-800">{selectedStudent.stats.motorik.avgResponseTime}ms</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl">
                        <span className="text-xs font-bold text-gray-500 uppercase">Total Soal Dikerjakan</span>
                        <span className="font-black text-gray-800">{selectedStudent.stats.motorik.totalSoal + selectedStudent.stats.visual.totalSoal + selectedStudent.stats.auditory.totalSoal}</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}