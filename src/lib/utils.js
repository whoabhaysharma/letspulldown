import axios from "axios";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import supabaseAdmin from "./supabase";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getUserInformationFromSessionToken = async (sessionToken) => {
  try {
    const sessionDetails = await getSession(sessionToken)
    return sessionDetails.identities[0]
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to validate session");
  }
}

export const getSession = async (sessionToken) => {
  try {
    const response = await axios.post(
      process.env.SESSION_API_URL,
      { sessionToken }, // Sending sessionToken in request body
      {
        headers: {
          "Content-Type": "application/json",
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
        },
      }
    );

    return response.data; // Successful response
  } catch (error) {
    console.error("Session validation failed:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Failed to validate session");
  }
}

export const isUserAvailableWithPhone = async (phone) => {
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