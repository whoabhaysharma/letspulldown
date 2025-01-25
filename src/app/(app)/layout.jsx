import GymOwnerLayout from "@/components/gymOwnerLayout";
import { auth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({ children }) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session?.value) {
    redirect("/login");
  }

  try {
    // Verify the session cookie using Firebase Admin SDK
    const user = await auth.verifySessionCookie(session.value);
  } catch (error) {
    redirect("/login");
  }

  return children;
}
