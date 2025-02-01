import { getCurrentGym } from "@/lib/authorizations";
import { db } from "@/lib/firebase"; // Assuming db is imported from firebase setup
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { name, contact, joining_date, gymCode } = await request.json();

        if (!name || !contact || !joining_date || !gymCode) {
            return NextResponse.json(
                { error: "All fields (name, contact, joining_date, gymCode) are required." },
                { status: 400 }
            );
        }

        const userSnapshot = await db.collection("users").where("code", "==", gymCode).get();

        if (!userSnapshot.empty) {
            return NextResponse.json(
                { error: "A user with this gym code already exists." },
                { status: 400 }
            );
        }

        const currentGym = await getCurrentGym();
        if (!currentGym?.id) {
            return NextResponse.json(
                { error: "Current gym not found." },
                { status: 404 }
            );
        }

        const currentGymRef = db.collection("gyms").doc(currentGym.id);
        const newMember = {
            code: gymCode,
            name,
            contact,
            joining_date,
            gym: currentGymRef,
            role: "member",
        };

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
