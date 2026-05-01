import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // 1. Ambil token dari cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("bunyikata_token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 2. Bongkar token untuk dapat ID Wali
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Token tidak valid" }, { status: 401 });

    // 3. Cari data lengkap si Wali (buat ambil email-nya)
    const wali = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!wali || !wali.email) {
      return NextResponse.json({ error: "Data Wali tidak ditemukan" }, { status: 404 });
    }

    // 4. HITUNG JUMLAH ANAK yang waliEmail-nya cocok dengan email Wali ini
    const totalAnak = await prisma.user.count({
      where: {
        role: "SISWA",
        waliEmail: wali.email
      }
    });

    // 5. Kirim datanya
    return NextResponse.json({ 
      namaWali: wali.nama,
      totalAnak: totalAnak 
    });
    
  } catch (error) {
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}