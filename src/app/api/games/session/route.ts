import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { sessionType } = await req.json(); // Contoh: "PRATEST"
    const cookieStore = await cookies();
    const token = cookieStore.get("bunyikata_token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Invalid Token" }, { status: 401 });

    // Hapus sesi PRATEST yang menggantung (IN_PROGRESS) jika ada,
    // supaya data diagnosa tidak kotor oleh percobaan yang tidak selesai.
    if (sessionType === "PRATEST") {
      await prisma.gameSession.deleteMany({
        where: {
          studentId: decoded.userId,
          sessionType: "PRATEST",
          status: "IN_PROGRESS"
        }
      });
    }

    // Buat sesi baru di DB
    const newSession = await prisma.gameSession.create({
      data: {
        studentId: decoded.userId,
        sessionType: sessionType,
        status: "IN_PROGRESS",
      },
    });

    return NextResponse.json({ sessionId: newSession.id });
  } catch (error) {
    return NextResponse.json({ error: "Gagal membuat sesi" }, { status: 500 });
  }
}
export async function PUT(req: Request) {
  try {
    const { sessionId, score, durationSec } = await req.json();

    // 1. Update status sesi menjadi COMPLETED
    const session = await prisma.gameSession.update({
      where: { id: sessionId },
      data: {
        status: "COMPLETED",
        score: score,
        durationSec: durationSec,
        endedAt: new Date(),
      },
    });

    // 2. Update statistik siswa (Tambah XP dan Level Up sederhana)
    // Kita asumsikan setiap 100 XP naik 1 level
    const currentStat = await prisma.studentStat.findUnique({
      where: { userId: session.studentId }
    });

    const newXp = (currentStat?.xp || 0) + score;
    const newLevel = Math.floor(newXp / 100) + 1;

    await prisma.studentStat.upsert({
      where: { userId: session.studentId },
      update: { xp: newXp, level: newLevel },
      create: { userId: session.studentId, xp: newXp, level: newLevel }
    });

    return NextResponse.json({ success: true, message: "Sesi selesai, XP bertambah!" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menyelesaikan sesi" }, { status: 500 });
  }
}