import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('jupid_token')?.value;
  const { pathname, searchParams } = request.nextUrl;
  const tokenFromQuery = searchParams.get('token');

  // Protected routes
  const protectedRoutes = [
    '/dashboard',
    '/competitors',
    '/reports',
    '/notifications',
    '/messages',
    '/settings',
  ];

  const isProtectedRoute = protectedRoutes.some((route) => 
    pathname.startsWith(route)
  );

  // If it's a protected route and no token in cookie, 
  // check if there's a token in the query params (from auth callback)
  if (isProtectedRoute && !token && !tokenFromQuery) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  // Redirect from login if already logged in
  if (pathname === '/login' && (token || tokenFromQuery)) {
    const url = new URL('/dashboard', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    '/dashboard/:path*',
    '/competitors/:path*',
    '/reports/:path*',
    '/notifications/:path*',
    '/messages/:path*',
    '/settings/:path*',
    '/login',
  ],
};
