'use server';

import { cookies, headers } from "next/headers";
import { auth, db } from "./firebase-admin"; // Ensure this imports your initialized Firebase Admin SDK

// Function to get the current user based on session cookie
export async function getCurrentUser() {
    const cookieToken = (await cookies()).get("session")?.value;
    if (!cookieToken) {
        return null; // No session cookie found
    }

    try {
        const decodedToken = await auth.verifySessionCookie(cookieToken);
        const uid = decodedToken.uid; // Extract the user's UID from the decoded token

        // Use Firestore modular API to get user document
        const userRef = db.collection("users").where("uid", "==", uid).limit(1);
        const userSnapshot = await userRef.get();

        if (userSnapshot.empty) {
            return null; // No user found
        }
        
        return userSnapshot.docs[0].ref; // Return the reference of the found user
    } catch (error) {
        console.error("Error verifying session cookie:", error);
        return null; // Handle error appropriately
    }
}

// Function to get Gym ID from headers
export async function getGymIdServerSide() {
    return (await headers()).get('x-gym-id');
}

// Function to check if the gym ID belongs to the current user
export async function isCurrentGymBelongsToUser() {
    try {
        const gymId = await getGymIdServerSide();
        // Use Firestore modular API to get gym document
        const gymRef = db.collection("gyms").doc(gymId);
        const gymSnapshot = await gymRef.get();

        if (!gymSnapshot.exists) {
            return false; // Gym does not exist
        }

        const gymData = gymSnapshot.data();
        const currentUserRef = await getCurrentUser();

        if (!currentUserRef) {
            return false; // No current user found
        }

        console.log(currentUserRef.id, 'CURRENT USER ID'); // Log current user ID

        // Compare the owner's reference with the current user's reference
        return gymData.owner.id === currentUserRef.id;
    } catch (error) {
        console.error("Error checking gym ownership:", error);
        return false; // Handle error appropriately
    }
}
