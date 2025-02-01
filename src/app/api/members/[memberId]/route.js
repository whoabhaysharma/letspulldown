import { getCurrentGym, getCurrentUser, getGymIdServerSide } from "@/lib/authorizations";
import { db } from "@/lib/firebase-admin";
import { isGymOwner } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        const { memberId } = await params; // Extracting memberId from the URL parameters

        // Get current user and check authorization
        const currentUser = await getCurrentUser();
        const currentGymId = await getGymIdServerSide();

        if (!currentUser) {
            return NextResponse.json(
                { error: "Unauthorized: No token provided" },
                { status: 401 }
            );
        }

        const isAdmin = isGymOwner(currentUser);
        if (!isAdmin) {
            return NextResponse.json(
                { error: "Unauthorized: Gym owner only" },
                { status: 403 }
            );
        }

        if(!currentGymId) {
            return NextResponse.json(
                { error: "Gym not found" },
                { status: 404 }
            );
        }

        // Validate memberId
        if (!memberId) {
            return NextResponse.json(
                { error: "memberId is required in the URL." },
                { status: 400 }
            );
        }

        // Get the current gym and check if the user belongs to it
        const currentGym = await getCurrentGym();
        // const currentGymRef = db.collection("gyms").doc(currentGym.id);
        
        const userDoc = await db.collection("users").doc(memberId).get();
        if (!userDoc.exists) {
            return NextResponse.json(
                { error: "User not found." },
                { status: 404 }
            );
        }

        const userData = userDoc.data();
        if (userData.gym.id !== currentGym.id) {
            return NextResponse.json(
                { error: "User does not belong to the current gym." },
                { status: 403 }
            );
        }

        // Return user data
        return NextResponse.json({ data: { id: userDoc.id, ...userData } }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user by memberId:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}
