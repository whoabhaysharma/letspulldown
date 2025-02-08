import axios from "axios";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

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