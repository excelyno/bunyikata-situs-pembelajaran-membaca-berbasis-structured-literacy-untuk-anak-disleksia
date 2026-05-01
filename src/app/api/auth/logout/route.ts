import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Panggil brankas cookie
    const cookieStore = await cookies();
    
    // Hapus cookie dengan nama 'bunyikata_token'
    cookieStore.delete("bunyikata_token");

    return NextResponse.json({ success: true, message: "Berhasil logout bang!" });
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json({ error: "Gagal logout nih" }, { status: 500 });
  }
}