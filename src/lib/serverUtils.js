"use server"

import axios from "axios"
import { cookies } from "next/headers"

export const getSessionTokenFromCookie = async () => {
    const cookieStore = cookies()

    const sessionToken = (await cookieStore).get("sessionToken")?.value
    if (sessionToken) return sessionToken
    return null
}

export const validateSession = async (sessionToken) => {
    try {
        const response = await axios.post(
            process.env.VALIDATE_SESSION_API_URL,
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
};