import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    // 1. Cari user di database berdasarkan username
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return NextResponse.json({ error: "Username tidak ditemukan nih bang." }, { status: 404 });
    }

    // 2. Cek kecocokan password dengan hash di database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Password salah! Coba ingat-ingat lagi." }, { status: 401 });
    }

    // 3. Buat Token JWT (Bawa id dan role-nya)
    const token = signToken({ userId: user.id, role: user.role });

    // 4. Tanam di Cookies browser (Biar aman dan nggak gampang dicuri)
    const cookieStore = await cookies();
    cookieStore.set("bunyikata_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // Masa berlaku 1 hari
      path: "/",
    });

    // 5. Kembalikan data role ke Frontend biar UI tau harus ngelempar kemana
    return NextResponse.json({ success: true, role: user.role });
  } catch (error) {
    console.error("API Login Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server saat login." }, { status: 500 });
  }
}