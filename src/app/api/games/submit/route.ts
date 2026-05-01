import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // 1. Dapatkan Token
    const cookieStore = await cookies();
    const token = cookieStore.get("bunyikata_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Tidak ada token" }, { status: 401 });
    }

    // 2. Verifikasi Token
    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId || decoded.role !== "SISWA") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const studentId = decoded.userId;

    // 3. Parsing Request
    const body = await req.json();
    const { sessionType, durationSec, score, logs } = body;

    // 4. Lakukan Transaction ke Database
    const result = await prisma.$transaction(async (tx) => {
      // a. Buat Sesi Game
      const gameSession = await tx.gameSession.create({
        data: {
          studentId,
          sessionType,
          durationSec,
          score,
          status: "COMPLETED",
          endedAt: new Date(),
        },
      });

      // b. Insert logs (jika ada)
      if (logs && logs.length > 0) {
        const logData = logs.map((log: any) => ({
          sessionId: gameSession.id,
          targetItem: log.targetItem,
          answeredItem: log.answeredItem,
          isCorrect: log.isCorrect,
          responseTimeMs: log.responseTimeMs,
          errorCategory: log.errorCategory || null,
        }));
        
        await tx.answerLog.createMany({
          data: logData,
        });
      }

      // c. Update StudentStat (XP & Koin)
      // Asumsi: Score 100 = 50 XP, atau 1 Score = 1 XP
      const gainedXp = Math.floor(score); 
      const gainedCoins = Math.floor(score / 5);

      const stat = await tx.studentStat.upsert({
        where: { userId: studentId },
        update: {
          xp: { increment: gainedXp },
          coins: { increment: gainedCoins },
        },
        create: {
          userId: studentId,
          xp: gainedXp,
          coins: gainedCoins,
          level: 1,
          avatar: "TELUR_KATAK"
        }
      });

      // Leveling Up logic (Setiap 100 XP naik level 1)
      const newLevel = Math.floor(stat.xp / 100) + 1;
      if (newLevel > stat.level) {
        await tx.studentStat.update({
          where: { userId: studentId },
          data: { level: newLevel }
        });
      }

      return gameSession;
    });

    return NextResponse.json({ success: true, message: "Data berhasil disubmit", sessionId: result.id });
  } catch (error) {
    console.error("Error submitting game:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}