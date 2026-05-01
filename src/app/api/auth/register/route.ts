import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt"; // Tambahkan ini
import { cookies } from "next/headers"; // Tambahkan ini

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password, nama, role, email, waliEmail } = body;

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) return NextResponse.json({ error: "Username sudah dipakai." }, { status: 400 });

    if (role === "WALI") {
      if (!email) return NextResponse.json({ error: "Email Wali wajib!" }, { status: 400 });
      const existingEmail = await prisma.user.findUnique({ where: { email } });
      if (existingEmail) return NextResponse.json({ error: "Email sudah terdaftar." }, { status: 400 });
    }

    if (role === "SISWA") {
      if (!waliEmail) return NextResponse.json({ error: "Email Wali wajib!" }, { status: 400 });
      const cekWali = await prisma.user.findUnique({ where: { email: waliEmail } });
      if (!cekWali || cekWali.role !== "WALI") return NextResponse.json({ error: "Wali tidak ditemukan." }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Simpan User
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        nama,
        role,
        email: role === "WALI" ? email : null,
        waliEmail: role === "SISWA" ? waliEmail : null,
      },
    });

    // 2. LOGIKA AUTO-LOGIN: Buat Token untuk user yang baru daftar
    const token = signToken({ userId: newUser.id, role: newUser.role });

    // 3. Tanam Cookie
    const cookieStore = await cookies();
    cookieStore.set("bunyikata_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    // 4. Return role agar frontend tau harus redirect kemana
    return NextResponse.json({ success: true, role: newUser.role });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mendaftar" }, { status: 500 });
  }
}