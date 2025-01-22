import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/lib/firebase-admin";

export async function GET(request) {
    try {
        // Get Authorization header
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "Missing or invalid authorization header" },
                { status: 401 }
            );
        }

        // Extract the token
        const idToken = authHeader.split("Bearer ")[1];

        // Verify the token with Firebase Admin
        const decodedToken = await auth.verifyIdToken(idToken);

        // Create session cookie
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds
        const sessionCookie = await auth.createSessionCookie(idToken, {
            expiresIn,
        });

        // Await the cookies() call to set the cookie in response
        const cookieStore = await cookies(); // Await the cookies() function

        // Set cookie in response
        cookieStore.set("session", sessionCookie, {
            maxAge: expiresIn / 1000, // maxAge should be in seconds
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error verifying token:", error);
        return NextResponse.json(
            { error: "Invalid token or server error" },
            { status: 401 }
        );
    }
}
