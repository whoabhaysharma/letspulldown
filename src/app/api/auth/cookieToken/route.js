import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth, db } from "@/lib/firebase-admin"; // Import Firestore (db) along with auth

export async function GET(request) {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json(
            { error: "Missing or invalid authorization header" },
            { status: 401 }
        );
    }

    const idToken = authHeader.split("Bearer ")[1];


    // Verify the token with Firebase Admin
    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid, name = "", picture = "", email } = decodedToken; // Extract UID from the decoded token

    // Check if user already exists
    const userSnapshot = await db.collection("users").where("uid", "==", uid).get();
    
    let docRef;
    if (userSnapshot.empty) {
        // User doesn't exist, create new document
        docRef = await db.collection("users").add({
            uid,
            name,
            email,
            picture,
            role: "gym_owner"
        });
    } else {
        // User exists, use existing document reference
        docRef = userSnapshot.docs[0].ref;
    }

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn,
    });

    // Set cookie in response
    const cookieStore = await cookies(); // Get the cookie store
    cookieStore.set("session", sessionCookie, {
        maxAge: expiresIn / 1000, // maxAge should be in seconds
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });

    return NextResponse.json({ 
        status: 200, 
        data: {
            uid,
            name,
            email,
            picture,
            role: "gym_owner"
        }
    });
}