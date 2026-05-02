import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // 1. Auth & Verify
    const cookieStore = await cookies();
    const token = cookieStore.get("bunyikata_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });

    const wali = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!wali || !wali.email) return NextResponse.json({ error: "Wali tidak ditemukan" }, { status: 404 });

    // 2. Ambil data lengkap semua anak yang terhubung dengan email Wali ini
    const daftarAnak = await prisma.user.findMany({
      where: {
        role: "SISWA",
        waliEmail: wali.email
      },
      include: {
        stat: true,
        gameSessions: {
          include: { logs: true },
          orderBy: { createdAt: "desc" }
        }
      }
    });

    // 3. Olah data analitik untuk setiap anak
    const dataLengkapSiswa = daftarAnak.map(siswa => {
      const calculateStats = (type: string) => {
        const sessions = siswa.gameSessions.filter(s => s.sessionType.includes(type));
        if (sessions.length === 0) return { accuracy: 0 };
        
        let totalLogs = 0;
        let correctLogs = 0;
        sessions.forEach(s => {
          s.logs.forEach(l => {
            totalLogs++;
            if (l.isCorrect) correctLogs++;
          });
        });
        return { accuracy: Math.round((correctLogs / totalLogs) * 100) || 0 };
      };

      // Cari huruf yang paling sering salah (Blind Spot)
      const allErrors = siswa.gameSessions.flatMap(s => s.logs).filter(l => !l.isCorrect);
      const errorMap: Record<string, number> = {};
      allErrors.forEach(err => {
        const key = `${err.targetItem} vs ${err.answeredItem}`;
        errorMap[key] = (errorMap[key] || 0) + 1;
      });

      // Total waktu belajar (dalam detik)
      const totalTimeSec = siswa.gameSessions.reduce((acc, s) => acc + (s.durationSec || 0), 0);

      // Total sesi
      const totalSessions = siswa.gameSessions.length;

      // Rata-rata skor
      const avgScore = totalSessions > 0
        ? Math.round(siswa.gameSessions.reduce((acc, s) => acc + (s.score || 0), 0) / totalSessions)
        : 0;

      // Rata-rata response time (ms) dari semua logs
      const allLogs = siswa.gameSessions.flatMap(s => s.logs);
      const avgResponseMs = allLogs.length > 0
        ? Math.round(allLogs.reduce((acc, l) => acc + l.responseTimeMs, 0) / allLogs.length)
        : 0;

      // Data chart: skor per hari (7 hari terakhir)
      const now = new Date();
      const dailyData: { date: string; avgScore: number; totalMin: number; sessions: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
        const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
        
        const daySessions = siswa.gameSessions.filter(s => {
          const created = new Date(s.createdAt);
          return created >= dayStart && created < dayEnd;
        });

        const dayAvg = daySessions.length > 0
          ? Math.round(daySessions.reduce((a, s) => a + s.score, 0) / daySessions.length)
          : 0;
        const dayMin = Math.round(daySessions.reduce((a, s) => a + (s.durationSec || 0), 0) / 60);

        dailyData.push({ date: dateStr, avgScore: dayAvg, totalMin: dayMin, sessions: daySessions.length });
      }

      // Fonik accuracy (gabungan auditori + visual yang ada fonik)
      const fonikAcc = calculateStats("FONIK").accuracy || calculateStats("AUDITORI").accuracy;

      // Menulis accuracy (bisa dari motorik write)
      const menulisLogs = siswa.gameSessions
        .filter(s => s.sessionType.includes("MOTORIK"))
        .flatMap(s => s.logs)
        .filter(l => l.errorCategory?.includes("WRITE"));
      const menulisAcc = menulisLogs.length > 0
        ? Math.round(menulisLogs.filter(l => l.isCorrect).length / menulisLogs.length * 100)
        : 0;

      return {
        id: siswa.id,
        nama: siswa.nama,
        level: siswa.stat?.level || 1,
        xp: siswa.stat?.xp || 0,
        coins: siswa.stat?.coins || 0,
        stats: {
          visual: calculateStats("VISUAL").accuracy,
          auditori: calculateStats("AUDITORI").accuracy,
          motorik: calculateStats("MOTORIK").accuracy,
          fonik: fonikAcc,
          menulis: menulisAcc,
        },
        totalTimeSec,
        totalSessions,
        avgScore,
        avgResponseMs,
        dailyData,
        blindSpots: Object.entries(errorMap).sort((a, b) => b[1] - a[1]).slice(0, 5),
        recentSessions: siswa.gameSessions.slice(0, 5).map(s => ({
          id: s.id,
          sessionType: s.sessionType,
          score: s.score,
          durationSec: s.durationSec,
          createdAt: s.createdAt.toISOString(),
        })),
      };
    });

    return NextResponse.json({ 
      namaWali: wali.nama,
      totalAnak: daftarAnak.length,
      dataAnak: dataLengkapSiswa
    });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}