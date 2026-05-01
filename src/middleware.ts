import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('bunyikata_token')?.value;
  const path = req.nextUrl.pathname;

  const isProtectedRoute = path.startsWith('/dashboard');
  const isAuthRoute = path.startsWith('/login') || path.startsWith('/register');

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/login', 
    '/register/:path*'
  ],
};