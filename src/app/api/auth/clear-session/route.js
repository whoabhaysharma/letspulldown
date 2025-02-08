import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL("/login", request.url); // Absolute URL required

  const response = NextResponse.redirect(url);
  response.cookies.set("sessionToken", "", {
    expires: new Date(0),
    path: "/",
  });

  return response;
}
