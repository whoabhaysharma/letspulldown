import { isUserAvailableWithPhone } from "@/lib/utils";
import { NextResponse } from "next/server";

/**
 * 
 * @param {*} request 
 * @returns 
 * this api checks if the user is available or not with the mobile number or not
 */

export async function GET(request, {params}) {
    const phone = (await params).phone
    if(!phone){
        return NextResponse.json(
            {error: "Phone number is required"},
            {status: 400}
        )
    }

    const isAvailable = await isUserAvailableWithPhone(phone)
    return NextResponse.json(
        {data: {status : isAvailable}},
        {status: 200}
    )
}
