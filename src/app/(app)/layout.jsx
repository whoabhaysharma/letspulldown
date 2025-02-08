import UserProvider from "@/context/UserProvider";
import { getUserInformationFromSessionToken } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({ children }) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value;

  if (!sessionToken) {
    redirect("/login");
  }

  let user = null;

  try {
    user = await getUserInformationFromSessionToken(sessionToken);
  } catch (e) {
    redirect("/api/auth/clear-session");
  }

  return <UserProvider user={user}>{children}</UserProvider>;
}
