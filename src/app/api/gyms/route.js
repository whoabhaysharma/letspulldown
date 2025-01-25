import { NextResponse } from "next/server";
import { auth, db } from "@/lib/firebase-admin";

export async function POST(request) {
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
  
      // Parse the request body to get the gym details
      const { name, address } = await request.json();
  
      if (!name || !address) {
        return NextResponse.json(
          { error: "Name and address are required" },
          { status: 400 }
        );
      }
  
      // Create a new gym document in the `gyms` collection
      const gymsRef = db.collection("gyms");
      const newGym = {
        name,
        address,
        verified : false,
        owner: userDocRef, // Reference to the user document
        createdAt: new Date().toISOString(), // Add a timestamp
      };
  
      // Add the new gym to Firestore
      const docRef = await gymsRef.add(newGym);
  
      // Return the newly created gym ID and data
      return NextResponse.json(
        { id: docRef.id, ...newGym, owner: userDocRef.path }, // Include the owner reference path
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating gym:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }