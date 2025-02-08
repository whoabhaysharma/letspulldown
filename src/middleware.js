import { NextResponse } from "next/server";
import { validateSession } from "./lib/utils";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Exclude routes that should be public (e.g. API auth routes and login page)
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Extract session token from cookies.
  const sessionToken = request.cookies.sessionToken;

  // Redirect to login if token is missing.
  if (!sessionToken) {
    console.warn("No session token found, redirecting to login...");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const res = await validateSession(sessionToken);

    if (!res || res.error) {
      console.warn("Invalid session, redirecting to login...");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    console.log("Session validation successful:", res);
  } catch (error) {
    console.error("Session validation failed:", error.message);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Limit middleware execution only to routes that require authentication.
export const config = {
  matcher: '/api:path*',
}