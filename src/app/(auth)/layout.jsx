import { auth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LoginLayout({ children }) {
  const cookieStore = await cookies(); // cookies() is synchronous
  const session = cookieStore.get("session");

  let redirectPath = null;
  if (session?.value) {
    try {
      await auth.verifySessionCookie(session.value);
      redirectPath = "/";
    } catch (error) {
      console.error("Session verification failed:", error);
    } finally {
        if (redirectPath){
            redirect(redirectPath);
        }
        
    }
  }

  return children
}