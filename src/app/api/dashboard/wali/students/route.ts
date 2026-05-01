import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("bunyikata_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    const wali = await prisma.user.findUnique({ where: { id: decoded?.userId } });
    if (!wali || !wali.email) return NextResponse.json({ error: "Wali not found" }, { status: 404 });

    // 1. Ambil semua siswa yang terhubung dengan Wali ini
    const students = await prisma.user.findMany({
      where: { waliEmail: wali.email, role: "SISWA" },
      include: {
        stat: true,
        gameSessions: {
          where: { status: "COMPLETED" },
          include: { logs: true }
        }
      }
    });

    // 2. Olah data setiap siswa
    const processedStudents = students.map(student => {
      const allLogs = student.gameSessions.flatMap(session => session.logs);
      
      const calcStats = (categoryPrefix: string) => {
        const categoryLogs = allLogs.filter(log => log.errorCategory?.startsWith(categoryPrefix));
        const total = categoryLogs.length;
        const correct = categoryLogs.filter(log => log.isCorrect).length;
        const avgTime = total > 0 ? categoryLogs.reduce((acc, log) => acc + log.responseTimeMs, 0) / total : 0;
        return {
          accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
          avgResponseTime: Math.round(avgTime),
          totalSoal: total
        };
      };

      return {
        id: student.id,
        nama: student.nama,
        level: student.stat?.level || 1,
        xp: student.stat?.xp || 0,
        stats: {
          motorik: calcStats("MOTORIK"),
          visual: calcStats("VISUAL"),
          auditory: calcStats("AUDITORY")
        },
        // Pola Kesalahan Spesifik
        reversalCount: allLogs.filter(l => l.errorCategory === "MOTORIK_REVERSAL" && !l.isCorrect).length,
        transpositionCount: allLogs.filter(l => l.errorCategory === "VISUAL_TRANSPOSITION" && !l.isCorrect).length
      };
    });

    return NextResponse.json(processedStudents);
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}