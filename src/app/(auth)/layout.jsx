import { getSessionTokenFromCookie, validateSession } from "@/lib/serverUtils";
import { redirect } from "next/navigation";

export default async function LoginLayout({ children }) {
  const sessionToken = await getSessionTokenFromCookie();
  
  if (!sessionToken) {
    console.log("NO SESSION FOUND, SHOWING LOGIN");
    return children;
  }

  const session = await validateSession(sessionToken).catch((e) => {
    console.error("Session validation failed:", e);
    return null;
  });

  if (!session?.success) {
    console.log("SESSION INVALID, REDIRECTING TO CLEAR SESSION");
    return redirect("/api/auth/clear-session");
  }

  console.log("SESSION VALID, REDIRECTING TO HOME");
  return redirect("/");
}
