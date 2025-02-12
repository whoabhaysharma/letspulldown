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

async function isUserAvailableWithPhone(phone){
    if(!phone) return false
  
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('id') // Fetch only the necessary field for efficiency
        .eq('phone', phone)
        .limit(1)
        .single(); // Fetch a single record if exists
  
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user:', error);
        return false;
      }
  
      return !!data; // Returns true if user exists, false otherwise
    } catch (err) {
      console.error('Unexpected error:', err);
      return false;
    }
  
  }