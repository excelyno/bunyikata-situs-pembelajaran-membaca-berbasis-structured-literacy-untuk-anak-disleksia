import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    // 1. Autentikasi Wali
    const cookieStore = await cookies();
    const token = cookieStore.get("bunyikata_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "WALI") {
      return NextResponse.json({ error: "Hanya Wali yang bisa mengakses" }, { status: 403 });
    }

    const waliId = decoded.userId;

    // 2. Cari Data Wali untuk dapat email
    const wali = await prisma.user.findUnique({
      where: { id: waliId }
    });

    if (!wali || !wali.email) {
      return NextResponse.json({ error: "Data wali tidak valid" }, { status: 404 });
    }

    // 3. Ambil data anak-anak (Siswa) yang nyambung ke email wali ini
    const students = await prisma.user.findMany({
      where: {
        role: "SISWA",
        waliEmail: wali.email
      },
      include: {
        stat: true,
        gameSessions: {
          where: { status: "COMPLETED" },
          include: {
            logs: true
          }
        }
      }
    });

    // 4. Analisis Data / Diagnosis
    const diagnosisData = students.map(student => {
      let totalLogs = 0;
      let totalMistakes = 0;
      let totalResponseTimeMs = 0;
      
      const errorCategoryCount: Record<string, number> = {};
      const slowCategories: Record<string, { totalMs: number, count: number }> = {};

      student.gameSessions.forEach(session => {
        session.logs.forEach(log => {
          totalLogs++;
          totalResponseTimeMs += log.responseTimeMs;

          // Hitung Kesalahan
          if (!log.isCorrect) {
            totalMistakes++;
            const cat = log.errorCategory || "LAINNYA";
            errorCategoryCount[cat] = (errorCategoryCount[cat] || 0) + 1;
          }

          // Hitung Kecepatan (untuk analisa keterlambatan respon)
          const cat = log.errorCategory || "LAINNYA";
          if (!slowCategories[cat]) slowCategories[cat] = { totalMs: 0, count: 0 };
          slowCategories[cat].totalMs += log.responseTimeMs;
          slowCategories[cat].count += 1;
        });
      });

      const avgResponseTimeMs = totalLogs > 0 ? totalResponseTimeMs / totalLogs : 0;
      
      // Temukan Kategori Error Terbanyak
      let mostCommonError = "Belum Ada Data";
      let maxError = 0;
      for (const [cat, count] of Object.entries(errorCategoryCount)) {
        if (count > maxError) {
          maxError = count;
          mostCommonError = cat;
        }
      }

      return {
        studentId: student.id,
        nama: student.nama,
        level: student.stat?.level || 1,
        totalGamePlayed: student.gameSessions.length,
        diagnosis: {
          totalLogs,
          totalMistakes,
          avgResponseTimeMs: Math.round(avgResponseTimeMs),
          mostCommonErrorCategory: mostCommonError,
          errorCategoryCount,
          categoryPerformance: Object.keys(slowCategories).map(cat => ({
            category: cat,
            avgResponseMs: Math.round(slowCategories[cat].totalMs / slowCategories[cat].count)
          }))
        }
      };
    });

    return NextResponse.json({ success: true, data: diagnosisData });

  } catch (error) {
    console.error("Diagnosis Error:", error);
    return NextResponse.json({ error: "Gagal memproses diagnosis" }, { status: 500 });
  }
}
