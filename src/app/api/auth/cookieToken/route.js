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
    console.error("Axios error:", error.response?.data || error.message);
    
    if (error.response) {
      const { status, data } = error.response;
      const errorMessage = `Error ${status}: ${data.errorCode || "Unknown"} - ${data.description || "No description"}`;
      throw new Error(errorMessage);
    }

    throw new Error("Network error or invalid response from server.");
  }
};

export async function POST(request) {
  try {
    const { sessionToken } = await request.json();
    if (!sessionToken) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const sessionDetails = await getSessionDetails(sessionToken);

    const response = NextResponse.json({ success: true, session: sessionDetails }, { status: 200 });
    
    response.cookies.set("sessionToken", sessionToken, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Request handling error:", error.message);
    
    let status = 500;
    if (error.message.includes("7414")) status = 400;
    else if (error.message.includes("7415")) status = 401;
    
    return NextResponse.json({ error: error.message }, { status });
  }
}