import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // 1. Ambil token siswa yang sedang login
    const cookieStore = await cookies();
    const token = cookieStore.get("bunyikata_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Belum login" }, { status: 401 });
    }

    // 2. Bongkar token untuk mendapatkan ID Siswa
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "SISWA") {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    // 3. Cari di database: Apakah dia sudah punya Pratest yang selesai?
    const checkPratest = await prisma.gameSession.findFirst({
      where: {
        studentId: decoded.userId,
        sessionType: "PRATEST",
        status: "COMPLETED",
      },
    });

    // 4. Kembalikan statusnya ke Frontend
    if (checkPratest) {
      return NextResponse.json({ hasCompletedPratest: true });
    } else {
      return NextResponse.json({ hasCompletedPratest: false });
    }
  } catch (error) {
    console.error("Check Pratest Error:", error);
    return NextResponse.json({ error: "Gagal mengecek status Pratest" }, { status: 500 });
  }
}