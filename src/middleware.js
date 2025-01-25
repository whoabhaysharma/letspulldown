import { NextResponse } from 'next/server';

export async function middleware(request) {
    const { pathname, searchParams } = request.nextUrl;

    return NextResponse.next();
}

export const config = {
    matcher: '/:path*',
};
