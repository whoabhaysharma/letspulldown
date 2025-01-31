import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;
  const gymId = searchParams.get('gymId');
  const isAdminRoute = pathname.startsWith('/admin');

  // Skip gymId check for admin routes
  if (!isAdminRoute && !gymId) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};