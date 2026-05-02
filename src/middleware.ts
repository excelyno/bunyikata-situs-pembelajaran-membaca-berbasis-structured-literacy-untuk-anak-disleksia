import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Fungsi bantuan buat nge-decode JWT (karena Edge runtime ga bisa pakai lib jsonwebtoken biasa)
function decodeJwt(token: string) {
  try {
    // Ambil bagian payload (tengah) dari JWT
    const payloadBase64Url = token.split('.')[1];
    // Convert Base64Url ke Base64 biasa
    const base64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/');
    // Decode ke JSON
    const decodedJson = atob(base64);
    return JSON.parse(decodedJson);
  } catch (error) {
    console.error("Gagal decode token:", error);
    return null;
  }
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get('bunyikata_token')?.value;
  const path = req.nextUrl.pathname;

  const isProtectedRoute = path.startsWith('/dashboard');
  const isAuthRoute = path.startsWith('/login') || path.startsWith('/register');

  // 1. GAK ADA TOKEN, tapi maksa masuk dashboard -> Tendang ke root '/'
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // 2. ADA TOKEN, tapi iseng buka halaman login/register
  if (token && isAuthRoute) {
    const payload = decodeJwt(token);
    
    // Cek rolenya apa (Sesuaikan dengan key yg lu pake di payload JWT lu ya bang)
    const role = payload?.role;

    if (role === 'SISWA') {
      return NextResponse.redirect(new URL('/dashboard/siswa', req.url));
    } else if (role === 'WALI') {
      return NextResponse.redirect(new URL('/dashboard/wali', req.url));
    } else {
      // Jaga-jaga kalau rolenya nyangkut/gak kebaca
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  // 3. Aman, biarin lewat
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/login', 
    '/register/:path*'
  ],
};