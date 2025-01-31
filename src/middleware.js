import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { searchParams } = request.nextUrl;
  const gymId = searchParams.get('gymId');

  if(gymId) {
    const response = NextResponse.next();
    response.headers.set('x-gym-id', gymId);
    return response
  }

  return NextResponse.next();
}