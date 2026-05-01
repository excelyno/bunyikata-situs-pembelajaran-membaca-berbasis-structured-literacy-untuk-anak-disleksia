import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('bunyikata_token')?.value;
  const path = req.nextUrl.pathname;

  // Cek apakah halaman yang dibuka adalah halaman terproteksi
  const isProtectedRoute = path.startsWith('/dashboard') || path.startsWith('/games');

  // Jika belum login & buka halaman terproteksi -> Tendang ke /login
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Jika SUDAH login & buka halaman /login -> Tendang ke dashboard (sementara arahkan ke root)
  if (token && path === '/login') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

// Tentukan rute mana saja yang dijaga Middleware
export const config = {
  matcher: ['/dashboard/:path*', '/games/:path*', '/login'],
};