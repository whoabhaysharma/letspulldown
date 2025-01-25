import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth, db } from "@/lib/firebase-admin";

export async function GET(request) {
    try {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "Missing or invalid authorization header" },
                { status: 401 }
            );
        }

        const idToken = authHeader.split("Bearer ")[1];
        const decodedToken = await auth.verifyIdToken(idToken);
        const { uid, name = "", picture = "", email } = decodedToken;

        // User handling
        const userSnapshot = await db.collection("users").where("uid", "==", uid).get();
        if (userSnapshot.empty) {
            await db.collection("users").add({
                uid,
                name,
                email,
                picture,
                role: "gym_owner",
                created: new Date().toISOString()
            });
        }

        // Create session cookie
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
        const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

        // Set cookie in response
        cookies().set("session", sessionCookie, {
            maxAge: expiresIn / 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        // Return success response with user data
        return NextResponse.json(
            { success: true, user: { uid, name, email, picture } },
            { status: 200 }
        );

    } catch (error) {
        console.error("Authentication error:", error);
        return NextResponse.json(
            { error: error.message || "Authentication failed" },
            { status: 500 }
        );
    }
}