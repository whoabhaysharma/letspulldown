import UserProvider from "@/context/UserProvider";
import { getSessionTokenFromCookie } from "@/lib/serverUtils";
import { getUserInformationFromSessionToken } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function Layout({ children }) {
  const sessionToken = await getSessionTokenFromCookie()

  if (!sessionToken) {
    console.log("NO SESSION TOKEN FOUND, REDIRECTING TO LOGIN");
    return redirect("/login");
  }

  const user = await getUserInformationFromSessionToken(sessionToken).catch((e) => {
    console.error("Failed to fetch user information:", e);
    return null;
  });

  if (!user) {
    console.log("INVALID SESSION, REDIRECTING TO CLEAR SESSION");
    return redirect("/api/auth/clear-session");
  }

  return <UserProvider user={user}>{children}</UserProvider>;
}
