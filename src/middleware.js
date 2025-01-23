// middleware.js
import { NextResponse } from 'next/server';
import { auth } from './lib/firebase-admin';

export async function middleware(request) {
  const cookieToken = request.cookies.get('session')?.value;

  if (!cookieToken) {
    return NextResponse.json(
      { error: 'Unauthorized: No token provided' },
      { status: 401 }
    );
  }

  try {
    const decodedToken = await auth.verifySessionCookie(cookieToken);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { error: 'Unauthorized: Invalid token' },
      { status: 401 }
    );
  }
}

// Configure the matcher to apply middleware to specific routes
export const config = {
  matcher: '/api/:path*',
};
