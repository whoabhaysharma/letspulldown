import { getCurrentUser, isCurrentGymBelongsToUser } from "@/lib/authorizations";
import { db } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function GET(request, {params}){
    try{
        const user = await getCurrentUser();
        const gymId = (await params).gymId

        if(!user){
            return NextResponse.json(
                {error: "Unauthorized: No token provided"},
                {status: 401}
            );
        }

        if(!gymId){
            return NextResponse.json(
                {error: "Gym ID is required"},
                {status: 400}
            );
        }

        const isValidGymRequest = await isCurrentGymBelongsToUser(gymId);

        if(!isValidGymRequest){
            return NextResponse.json(
                {error: "Unauthorized: Gym does not belong to user"},
                {status: 403}
            );
        }

        const gymRef = db.collection("gyms").doc(gymId);
        const gymSnapshot = await gymRef.get();

        return NextResponse.json(
            {data: gymSnapshot.data()},
            {status: 200}
        );
    }catch(e){
        return NextResponse.json(
            {error: "Internal Server Error"},
            {status: 500}
        );
    }
}