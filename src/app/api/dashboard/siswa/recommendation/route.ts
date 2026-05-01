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

    // FIX: Kita sesuaikan dengan skema, pakai 'studentId' bukan 'userId'
    const lastPratest = await prisma.gameSession.findFirst({
      where: { 
        studentId: decoded.userId, // <--- INI YANG BENAR
        sessionType: "PRATEST", 
        status: "COMPLETED" 
      },
      orderBy: { createdAt: "desc" },
      include: { logs: true }
    });

    if (!lastPratest || lastPratest.logs.length === 0) {
      return NextResponse.json({ recommended: "ALL", message: "Belum ada data Pratest" });
    }

    // Hitung akurasi masing-masing kategori
    const logs = lastPratest.logs;
    const calcAccuracy = (prefix: string) => {
      const catLogs = logs.filter(l => l.errorCategory?.startsWith(prefix));
      if (catLogs.length === 0) return 100; // Kalau ga ada datanya anggap 100% (aman)
      const correct = catLogs.filter(l => l.isCorrect).length;
      return (correct / catLogs.length) * 100;
    };

    const scores = {
      motorik: calcAccuracy("MOTORIK"),
      visual: calcAccuracy("VISUAL"),
      auditori: calcAccuracy("AUDITORY"),
    };

    // Cari nilai terkecil untuk direkomendasikan
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

    return NextResponse.json({ recommended: lowestCategory, scores });
  } catch (error) {
    console.error("Error Detail:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}