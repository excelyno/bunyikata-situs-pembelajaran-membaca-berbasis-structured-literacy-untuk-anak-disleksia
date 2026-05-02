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
    if (!decoded) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // 1. Ambil sesi-sesi terakhir yang sudah selesai (Maks 20 sesi)
    const completedSessions = await prisma.gameSession.findMany({
      where: { 
        studentId: decoded.userId,
        status: "COMPLETED" 
      },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { logs: true }
    });

    // 2. Cek apakah sudah pernah PRATEST atau punya aktivitas lain
    const hasPratest = completedSessions.some(s => s.sessionType === "PRATEST");
    const needsPratest = !hasPratest && completedSessions.length === 0;

    // 3. Kumpulkan semua logs untuk kalkulasi rekomendasi yang lebih akurat
    const allLogs = completedSessions.flatMap(s => s.logs);

    if (allLogs.length === 0) {
      return NextResponse.json({ 
        recommended: "ALL", 
        message: "Belum ada data aktivitas",
        needsPratest 
      });
    }

    // 4. Fungsi hitung akurasi dengan keyword mapping (Handle inkonsistensi penamaan kategori)
    const calcAccuracy = (keywords: string[]) => {
      const catLogs = allLogs.filter(l => {
        const cat = (l.errorCategory || "").toUpperCase();
        return keywords.some(k => cat.includes(k.toUpperCase()));
      });
      
      if (catLogs.length === 0) return 100; // Default aman jika kategori belum dimainkan
      const correct = catLogs.filter(l => l.isCorrect).length;
      return (correct / catLogs.length) * 100;
    };

    const scores = {
      motorik: calcAccuracy(["MOTORIK", "WRITING", "MENULIS", "TRACE"]),
      visual: calcAccuracy(["VISUAL", "MEMORI", "SILUET", "ERROR", "LIHAT"]),
      auditori: calcAccuracy(["AUDITORY", "AUDITORI", "PHONICS", "DENGAR", "HURUF"]),
    };

    // 5. Cari kategori dengan skor terendah
    let lowestCategory = "motorik";
    let lowestScore = scores.motorik;

    if (scores.visual < lowestScore) {
      lowestCategory = "visual";
      lowestScore = scores.visual;
    }
    if (scores.auditori < lowestScore) {
      lowestCategory = "auditori";
      lowestScore = scores.auditori;
    }

    // Jika semua skor di atas 90%, rekomendasikan secara bergantian atau tetap ALL
    if (lowestScore > 90) {
       lowestCategory = "ALL";
    }

    return NextResponse.json({ 
      recommended: lowestCategory, 
      scores,
      needsPratest 
    });
  } catch (error) {
    console.error("Error Detail:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}