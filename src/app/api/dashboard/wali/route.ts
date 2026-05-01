import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // 1. Auth & Verify (Sesuai kode abang)
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

      return {
        id: siswa.id,
        nama: siswa.nama,
        level: siswa.stat?.level || 1,
        xp: siswa.stat?.xp || 0,
        stats: {
          visual: calculateStats("VISUAL").accuracy,
          auditori: calculateStats("AUDITORI").accuracy,
          motorik: calculateStats("MOTORIK").accuracy,
        },
        blindSpots: Object.entries(errorMap).sort((a, b) => b[1] - a[1]).slice(0, 3),
        recentSessions: siswa.gameSessions.slice(0, 3)
      };
    });

    return NextResponse.json({ 
      namaWali: wali.nama,
      totalAnak: daftarAnak.length,
      dataAnak: dataLengkapSiswa // Ini data yang bakal dipakai Dashboard
    });
    
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}