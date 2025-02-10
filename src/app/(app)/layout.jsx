import UserProvider from "@/context/UserProvider";
import { getSessionTokenFromCookie } from "@/lib/serverUtils";
import { getUserInformationFromSessionToken } from "@/lib/utils";
import { redirect } from "next/navigation";

// Inline safe wrappers that catch errors and return null on failure.
async function safeGetSessionToken() {
  try {
    return await getSessionTokenFromCookie();
  } catch (error) {
    console.error("Error in getSessionTokenFromCookie:", error);
    return null;
  }
}

async function safeGetUserInfo(sessionToken) {
  try {
    return await getUserInformationFromSessionToken(sessionToken);
  } catch (error) {
    console.error("Error in getUserInformationFromSessionToken:", error);
    return null;
  }
}

export default async function Layout({ children }) {
  // Step 1: Attempt to get the session token.
  const sessionToken = await safeGetSessionToken();
  if (!sessionToken) {
    // If fetching the token fails, redirect to login.
    return redirect("/login");
  }

  // Step 2: Attempt to get the user information.
  const user = await safeGetUserInfo(sessionToken);
  if (!user) {
    // If fetching user info fails, redirect to clear the session.
    return redirect("/api/auth/clear-session");
  }

  // Step 3: Render the layout with the fetched user.
  return <UserProvider user={user}>{children}</UserProvider>;
}
