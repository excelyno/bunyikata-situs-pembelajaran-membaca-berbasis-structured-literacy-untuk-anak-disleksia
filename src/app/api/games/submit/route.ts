import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, sessionType, durationSec, score, logs } = body;

    if (!studentId || !sessionType) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // Gunakan Prisma Transaction agar penyimpanan Sesi, Log, dan Update XP berjalan serentak
    const result = await prisma.$transaction(async (tx) => {
      // 1. Buat Game Session beserta Answer Logs-nya
      const session = await tx.gameSession.create({
        data: {
          studentId,
          sessionType,
          status: "COMPLETED",
          durationSec,
          score,
          endedAt: new Date(),
          logs: {
            create: logs.map((log: any) => ({
              targetItem: log.targetItem,
              answeredItem: log.answeredItem,
              isCorrect: log.isCorrect,
              responseTimeMs: log.responseTimeMs,
              errorCategory: log.errorCategory || "GENERAL",
            })),
          },
        },
      });

      // 2. Update Statistik Siswa (Tambah XP dan Koin)
      // Asumsi: 1 XP per score, bonus 10 Koin kalau berhasil namatin sesi
      const xpGained = score; 
      const coinsGained = score > 50 ? 10 : 5;

      const stat = await tx.studentStat.upsert({
        where: { userId: studentId },
        update: {
          xp: { increment: xpGained },
          coins: { increment: coinsGained },
        },
        create: {
          userId: studentId,
          xp: xpGained,
          coins: coinsGained,
          level: 1,
        },
      });

      return { session, stat };
    });

    return NextResponse.json({ success: true, data: result }, { status: 200 });

  } catch (error) {
    console.error("API Submit Game Error:", error);
    return NextResponse.json({ error: "Gagal menyimpan data permainan" }, { status: 500 });
  }
}