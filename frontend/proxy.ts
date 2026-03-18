import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  // Protected routes
  if (pathname.startsWith('/dumpsters')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect to dashboard if logged in and trying to access login
  if (pathname === '/login') {
    if (token) {
      return NextResponse.redirect(new URL('/dumpsters', request.url));
    }
  }

  return NextResponse.next();
}

export const proxyConfig = {
  matcher: ['/dumpsters/:path*', '/login'],
};
