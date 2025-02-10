import { getSessionTokenFromCookie, validateSession } from "@/lib/serverUtils";
import { redirect } from "next/navigation";

// Inline safe wrappers that handle errors internally.
async function safeGetSessionToken() {
  try {
    return await getSessionTokenFromCookie();
  } catch (error) {
    console.error("Error retrieving session token:", error);
    return null;
  }
}

async function safeValidateSession(token) {
  try {
    return await validateSession(token);
  } catch (error) {
    console.error("Session validation failed:", error);
    return null;
  }
}

export default async function LoginLayout({ children }) {
  // Step 1: Attempt to get the session token.
  const sessionToken = await safeGetSessionToken();

  // No session token? Render the login page.
  if (!sessionToken) {
    return children;
  }

  // Step 2: Validate the session using the token.
  const session = await safeValidateSession(sessionToken);

  // If session validation fails or returns a non‑successful result, redirect to clear the session.
  if (!session) {
    return redirect("/api/auth/clear-session");
  }

  // Otherwise, if the session is valid, redirect to the home page.
  return redirect("/");
}
