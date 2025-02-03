import { getCurrentGym } from "@/lib/authorizations";
import { db } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, phone, joining_date, gym_code } = await request.json();

    // Validate required fields
    if (!name || !phone || !joining_date || !gym_code) {
      return NextResponse.json(
        { error: "All fields (name, contact, joining_date, gym_code) are required." },
        { status: 400 }
      );
    }

    // Check if user with the given gym_code already exists
    const userSnapshot = await db
      .collection("users")
      .where("code", "==", gym_code)
      .get();

    if (!userSnapshot.empty) {
      return NextResponse.json(
        { error: "A user with this gym code already exists." },
        { status: 400 }
      );
    }

    // Get current gym information
    const currentGym = await getCurrentGym();
    if (!currentGym?.id) {
      return NextResponse.json(
        { error: "Current gym not found." },
        { status: 404 }
      );
    }

    // Create new member object
    const currentGymRef = db.collection("gyms").doc(currentGym.id);
    const newMember = {
      gym_code,
      name,
      phone,
      joining_date,
      gym: currentGymRef,
      role: "member",
    };

    // Save the new member to the database
    const memberRef = await db.collection("users").add(newMember);

    return NextResponse.json(
      { data: { id: memberRef.id, ...newMember } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding member:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
