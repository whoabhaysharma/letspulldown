import { getCurrentGym, getCurrentUser } from "@/lib/authorizations";
import { db } from "@/lib/firebase-admin";
import { isGymOwner } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Get the current user.
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    // Check that the user is a gym owner.
    if (!isGymOwner(user)) {
      return NextResponse.json(
        { error: "Unauthorized: Gym owner only" },
        { status: 403 }
      );
    }

    // Retrieve the current gym.
    const currentGym = await getCurrentGym();
    if (!currentGym) {
      return NextResponse.json(
        { error: "Gym not found" },
        { status: 404 }
      );
    }

    // Check if the current gym belongs to the current user.
    // Here, currentGym.owner is assumed to be a DocumentReference.
    if (!currentGym.owner?.id || currentGym.owner.id !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized: Gym does not belong to user" },
        { status: 403 }
      );
    }

    // Use the gym document reference to query for members.
    const gymRef = db.collection("gyms").doc(currentGym.id);
    const usersSnapshot = await db
      .collection("users")
      .where("role", "==", "member")
      .where("gym", "==", gymRef)
      .get();

    const usersData = usersSnapshot.docs.map((doc) => doc.data());

    return NextResponse.json({ data: usersData, status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
