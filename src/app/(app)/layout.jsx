import { auth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({ children }) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session?.value) {
    // If no session cookie is present, redirect to the login page
    redirect("/login");
  }

  try {
    // Verify the session cookie using Firebase Admin SDK
    const user = await auth.verifySessionCookie(session.value);
  } catch (error) {
    console.error("Session verification failed:", error);
    // If verification fails, redirect to the login page
    redirect("/login");
  }

  // If verification is successful, render the children components
  return children;
}
