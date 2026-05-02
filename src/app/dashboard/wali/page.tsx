"use client";
import { useEffect, useState } from "react";
import LogoutButton from "@/app/components/LogoutButton";

interface DailyPoint { date: string; avgScore: number; totalMin: number; sessions: number; }
interface StudentData {
  id: string; nama: string; level: number; xp: number; coins: number;
  stats: { visual: number; auditori: number; motorik: number; fonik: number; menulis: number; };
  totalTimeSec: number; totalSessions: number; avgScore: number; avgResponseMs: number;
  dailyData: DailyPoint[];
  blindSpots: [string, number][];
  recentSessions: { id: string; sessionType: string; score: number; durationSec: number; createdAt: string; }[];
}

const NAV_ITEMS = [
  { key: "beranda", label: "Beranda" },
  { key: "ringkasan", label: "Ringkasan" },
  { key: "progress", label: "Progress Belajar" },
  { key: "terapi", label: "Terapi" },
  { key: "riwayat", label: "Riwayat Sesi" },
  { key: "laporan", label: "Laporan" },
  { key: "rekomendasi", label: "Rekomendasi" },
  { key: "pengaturan", label: "Pengaturan" },
];

function formatTime(sec: number) {
  const h = Math.floor(sec / 3600); const m = Math.floor((sec % 3600) / 60);
  return h > 0 ? `${h} jam ${m} mnt` : `${m} mnt`;
}
function sessionLabel(t: string) {
  return t.replace(/_/g, " ").replace(/TERAPI /i, "").split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}
function scoreColor(s: number) { return s >= 80 ? "text-emerald-600" : s >= 50 ? "text-amber-600" : "text-red-500"; }

// Radar Chart SVG - 5 axes (tanpa emoji)
function RadarChart({ data }: { data: { motorik: number; fonik: number; auditori: number; menulis: number; visual: number } }) {
  const keys = ["motorik", "fonik", "auditori", "menulis", "visual"] as const;
  const labels = ["Motorik", "Fonik", "Auditori", "Menulis", "Visual"];
  const cx = 50, cy = 50, R = 38;
  const getPoint = (i: number, r: number) => {
    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  };
  const rings = [R, R * 0.66, R * 0.33];
  const dataPoints = keys.map((k, i) => getPoint(i, (data[k] / 100) * R));
  const poly = dataPoints.map(p => p.join(",")).join(" ");
  return (
    <div className="relative w-full max-w-[240px] mx-auto aspect-square">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {rings.map((r, ri) => (
          <polygon key={ri} points={Array.from({ length: 5 }, (_, i) => getPoint(i, r).join(",")).join(" ")}
            fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
        ))}
        {Array.from({ length: 5 }, (_, i) => {
          const [x, y] = getPoint(i, R);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#e2e8f0" strokeWidth="0.5" />;
        })}
        <polygon points={poly} fill="rgba(234,88,12,0.15)" stroke="#ea580c" strokeWidth="1.2" strokeLinejoin="round" />
        {dataPoints.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.8" fill="#ea580c" />)}
      </svg>
      {keys.map((k, i) => {
        const [x, y] = getPoint(i, R + 10);
        return (
          <div key={k} className="absolute text-[9px] font-bold text-gray-600 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
            style={{ left: `${x}%`, top: `${y}%` }}>
            {labels[i]}<br /><span className="text-orange-600">{data[k]}%</span>
          </div>
        );
      })}
    </div>
  );
}

// Mini bar chart SVG
function BarChart({ dailyData }: { dailyData: DailyPoint[] }) {
  const maxScore = Math.max(...dailyData.map(d => d.avgScore), 1);
  const maxMin = Math.max(...dailyData.map(d => d.totalMin), 1);
  const barW = 100 / dailyData.length;
  return (
    <div>
      <div className="flex items-center gap-4 mb-3 text-[10px] font-bold text-gray-400">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400 inline-block" /> Skor Rata-rata (%)</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Waktu (menit)</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400 inline-block" /> Sesi</span>
      </div>
      <svg viewBox="0 0 200 80" className="w-full h-32">
        {dailyData.map((d, i) => {
          const x = i * (200 / dailyData.length) + 4;
          const w = (200 / dailyData.length) - 8;
          const h1 = (d.avgScore / 100) * 60;
          const h2 = (d.totalMin / maxMin) * 60;
          return (
            <g key={i}>
              <rect x={x} y={65 - h1} width={w / 2 - 1} height={h1} rx="2" fill="#fb923c" opacity="0.8" />
              <rect x={x + w / 2} y={65 - h2} width={w / 2 - 1} height={h2} rx="2" fill="#34d399" opacity="0.7" />
              <text x={x + w / 2} y="75" textAnchor="middle" fontSize="5" fill="#94a3b8" fontWeight="bold">{d.date}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function WaliDashboard() {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [waliName, setWaliName] = useState("");
  const [activeNav, setActiveNav] = useState("beranda");
  const [selIdx, setSelIdx] = useState(0);

  useEffect(() => {
    fetch("/api/dashboard/wali").then(r => r.json()).then(data => {
      if (data.dataAnak) { setStudents(data.dataAnak); setWaliName(data.namaWali); }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const s = students[selIdx];

  return (
    <div className="min-h-screen bg-[#faf7f2] flex font-sans">
      {/* ===== MAIN CONTENT (FULL WIDTH) ===== */}
      <main className="flex-1 min-h-screen">
        {/* Top header dengan navigasi */}
        <header className="sticky top-0 z-20 bg-[#faf7f2]/95 backdrop-blur-md border-b border-orange-100 px-6 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Halo, {waliName || "Bunda"}!</h1>
              <p className="text-xs text-gray-400">Berikut perkembangan belajar {s?.nama || "anak"} hari ini.</p>
            </div>
            <div className="flex items-center gap-3">
              {students.length > 0 && (
                <select value={selIdx} onChange={e => setSelIdx(Number(e.target.value))}
                  className="bg-white border border-orange-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300">
                  {students.map((st, i) => <option key={st.id} value={i}>{st.nama}</option>)}
                </select>
              )}
              <div className="bg-white border border-orange-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500">
                7 Hari Terakhir
              </div>
              <LogoutButton />
            </div>
          </div>
        </header>

        {loading ? (
          <div className="p-6 grid grid-cols-4 gap-4 animate-pulse">
            {[1,2,3,4].map(i => <div key={i} className="h-28 bg-orange-100 rounded-xl" />)}
          </div>
        ) : !s ? (
          <div className="p-16 text-center">
            <div className="text-4xl mb-4 text-gray-300">🔎</div>
            <p className="font-bold text-gray-600 text-lg">Belum ada anak terhubung.</p>
            <p className="text-gray-400 mt-2 text-sm">Pastikan siswa mendaftar dengan email wali Anda.</p>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* === ROW 1: Stat Cards === */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Level Saat Ini", value: `Level ${s.level}`, sub: `XP: ${s.xp} / ${s.level * 500}`, gradient: "from-orange-400 to-amber-500" },
                { label: "Total XP", value: s.xp.toLocaleString(), sub: `+${Math.min(s.xp, 120)} XP hari ini`, gradient: "from-emerald-400 to-teal-500" },
                { label: "Koin", value: s.coins.toString(), sub: "+15 hari ini", gradient: "from-yellow-400 to-orange-400" },
                { label: "Total Sesi", value: `${s.totalSessions}`, sub: `${formatTime(s.totalTimeSec)} belajar`, gradient: "from-rose-400 to-pink-500" },
              ].map(card => (
                <div key={card.label} className="bg-white rounded-xl border border-orange-100 p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-sm`}>
                    <div className="w-5 h-5 rounded bg-white/30" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{card.label}</p>
                    <p className="text-lg font-bold text-gray-800">{card.value}</p>
                    <p className="text-[10px] text-emerald-500 font-medium">{card.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* === ROW 2: Chart + Radar + Sesi Terakhir === */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Ringkasan Perkembangan - Chart */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-orange-100 p-5 shadow-sm">
                <h3 className="font-bold text-gray-700 text-sm mb-1">Ringkasan Perkembangan</h3>
                <p className="text-[10px] text-gray-400 mb-3">Performa {s.nama} dalam 7 hari terakhir</p>
                <BarChart dailyData={s.dailyData} />
                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-50">
                  <div><p className="text-lg font-bold text-gray-800">{s.avgScore}%</p><p className="text-[9px] text-gray-400">Rata-rata Skor</p></div>
                  <div><p className="text-lg font-bold text-gray-800">{formatTime(s.totalTimeSec)}</p><p className="text-[9px] text-gray-400">Total Waktu</p></div>
                  <div><p className="text-lg font-bold text-gray-800">{s.totalSessions} sesi</p><p className="text-[9px] text-gray-400">Total Sesi</p></div>
                </div>
              </div>

              {/* Performa Terapi - Radar */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-orange-100 p-5 shadow-sm">
                <h3 className="font-bold text-gray-700 text-sm mb-1">Performa Terapi</h3>
                <p className="text-[10px] text-gray-400 mb-2">Kemampuan berdasarkan kategori</p>
                <RadarChart data={s.stats} />
                <div className="flex items-center justify-center gap-3 mt-2 text-[9px] font-medium">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-orange-500 rounded-full" />{s.nama}</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-400">Rata-rata Kelas</span>
                </div>
              </div>

              {/* Sesi Terakhir */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-orange-100 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-700 text-sm">Sesi Terakhir</h3>
                  <span className="text-[10px] text-orange-500 font-medium cursor-pointer hover:underline">Lihat Semua</span>
                </div>
                <div className="space-y-2.5">
                  {s.recentSessions.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-6">Belum ada sesi.</p>
                  ) : s.recentSessions.map(session => (
                    <div key={session.id} className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2.5 hover:bg-orange-50 transition-colors cursor-pointer">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-600">
                        {session.sessionType.includes("MOTORIK") ? "M" : session.sessionType.includes("AUDITORI") ? "A" : session.sessionType.includes("VISUAL") ? "V" : "F"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-700 truncate">{sessionLabel(session.sessionType)}</p>
                        <p className="text-[10px] text-gray-400">{new Date(session.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400">Skor</p>
                        <p className={`text-sm font-bold ${scoreColor(session.score)}`}>{session.score}%</p>
                      </div>
                      <span className="text-gray-300">›</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* === ROW 3: Blind Spots + Rekomendasi (2 kolom) === */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-5">
              {/* Area Perlu Ditingkatkan */}
              <div className="lg:col-span-4 bg-white rounded-xl border border-orange-100 p-4 shadow-sm">
                <h3 className="font-bold text-red-500 text-sm mb-3">Area yang Perlu Ditingkatkan</h3>
                <p className="text-[10px] text-gray-400 mb-3">Fokus utama {s.nama} saat ini</p>
                {s.blindSpots.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-2xl mb-1 text-gray-300">✓</p>
                    <p className="text-xs font-medium text-gray-400">Tidak ada kesalahan berulang!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {s.blindSpots.slice(0, 3).map(([label, count], i) => (
                      <div key={i} className="flex items-center gap-3 bg-red-50 rounded-lg px-3 py-2 border border-red-100">
                        <span className="text-base font-bold text-red-400">{label.split(" vs ")[0]}</span>
                        <div className="flex-1">
                          <p className="text-[10px] font-medium text-gray-600">{label}</p>
                          <p className="text-[9px] text-gray-400">Sering tertukar saat menulis dan memilih</p>
                        </div>
                        <span className="text-xs font-bold text-red-500">{Math.round((count / Math.max(s.totalSessions, 1)) * 100)}%</span>
                      </div>
                    ))}
                    {(() => {
                      const weakest = Object.entries(s.stats).sort((a, b) => a[1] - b[1])[0];
                      const tMap: Record<string, string> = { visual: "Terapi Visual", auditori: "Terapi Auditori", motorik: "Terapi Motorik", fonik: "Terapi Fonik", menulis: "Terapi Menulis" };
                      return (
                        <div className="mt-2 flex items-center gap-2 bg-orange-50 rounded-lg px-3 py-2 border border-orange-100">
                          <div className="w-6 h-6 rounded bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-600">L</div>
                          <div>
                            <p className="text-[10px] font-medium text-gray-600">Latihan disarankan:</p>
                            <p className="text-xs font-bold text-orange-600">{tMap[weakest[0]] || "Terapi Umum"} - Level 2</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Rekomendasi Hari Ini */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-orange-100 p-4 shadow-sm">
                <h3 className="font-bold text-gray-700 text-sm mb-1">Rekomendasi Hari Ini</h3>
                <p className="text-[10px] text-gray-400 mb-3">Aktivitas yang cocok untuk {s.nama}</p>
                {(() => {
                  const weakest = Object.entries(s.stats).sort((a, b) => a[1] - b[1])[0];
                  const recMap: Record<string, { title: string; time: string }> = {
                    visual: { title: "Latihan Membedakan Huruf", time: "10 menit" },
                    auditori: { title: "Latihan Mendengar Bunyi", time: "10 menit" },
                    motorik: { title: "Latihan Menulis Huruf Mirip", time: "10 menit" },
                    fonik: { title: "Latihan Fonik Dasar", time: "10 menit" },
                    menulis: { title: "Latihan Menulis Kata", time: "10 menit" },
                  };
                  const rec = recMap[weakest[0]] || recMap.motorik;
                  return (
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-sm font-bold text-orange-600">R</div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-700">{rec.title}</p>
                        <p className="text-[10px] text-gray-400">{rec.time}</p>
                      </div>
                      <button className="bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-orange-600 transition shadow-sm">Mulai</button>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}