// app/login/layout.js
import { getSessionTokenFromCookie, validateSession } from "@/lib/serverUtils";
import { redirect } from "next/navigation";

export default async function LoginLayout({ children }) {
  try {
    const sessionToken = await getSessionTokenFromCookie();
    if (sessionToken) {
      try {
        const session = await validateSession(sessionToken);
        if (session) {
          // If the session is valid, redirect to home
          redirect("/");
        }
      } catch (e) {
        redirect("/api/auth/clear-session")
      }
    }
  } catch (e) {
    console.log("NO SESSION FOUND, SHOWING LOGIN");
  }
  return children;
}
