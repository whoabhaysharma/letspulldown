import axios from "axios";
import { NextResponse } from "next/server";

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const SESSION_API_URL = process.env.SESSION_API_URL;

const getSessionDetails = async (sessionToken) => {
    try {
        const response = await axios.post(
            SESSION_API_URL,
            { sessionToken },
            {
                headers: {
                    "Content-Type": "application/json",
                    clientId,
                    clientSecret,
                },
            }
        );

        return response.data;
    } catch (error) {
        const { response } = error;

        if (response) {
            const { status, data } = response;

            // Handle specific status codes
            if (status === 400) {
                throw new Error(`Error ${data.errorCode}: ${data.description}`);
            } else if (status === 401) {
                throw new Error(`Error ${data.errorCode}: ${data.description}`);
            } else if (status === 500) {
                throw new Error("Internal server error. Please try again later.");
            }
        }

        throw new Error("Network error or invalid response from server.");
    }
};

export async function POST(request) {
  try {
    // Parse request body
    const { sessionToken } = await request.json();

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    // Verify token using OTPless SDK
    const sessionDetails = await getSessionDetails(sessionToken);

    const response = NextResponse.json(
      { success: true, session: sessionDetails },
      { status: 200 }
    );

    // Set the sessionToken as an HTTP-only cookie in the response
    response.cookies.set("sessionToken", sessionToken, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Error:", error.message);

    const status = error.message.includes("7414")
      ? 400
      : error.message.includes("7415")
      ? 401
      : 500;

    return NextResponse.json(
      { error: error.message },
      { status }
    );
  }
}
