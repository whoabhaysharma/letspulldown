import { NextResponse } from "next/server";
import { auth, db } from "@/lib/firebase-admin";

export async function GET(request) {
  try {
    // Get the `cookieToken` from the request cookies
    const cookieToken = request.cookies.get("session")?.value;

    if (!cookieToken) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    // Verify and decode the token using Firebase Admin
    const decodedToken = await auth.verifySessionCookie(cookieToken);
    const uid = decodedToken.uid; // Extract the user's UID from the decoded token

    // Get the user's document reference based on UID
    const usersRef = db.collection("users");
    const userSnapshot = await usersRef.where("uid", "==", uid).limit(1).get();

    if (userSnapshot.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Retrieve the user document reference
    const userDocRef = userSnapshot.docs[0].ref;

    // Query the `gyms` collection where `owner` is the user's document reference
    const gymsRef = db.collection("gyms");
    const gymsSnapshot = await gymsRef.where("owner", "==", userDocRef).get();

    if (gymsSnapshot.empty) {
      return NextResponse.json(
        { message: "No gyms found for this user" },
        { status: 200 }
      );
    }

    // Extract gym documents from the snapshot
    const data = gymsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Return the gyms as a JSON response
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching gyms:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
