import UserProvider from "@/context/UserProvider";
import { getSession } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({ children }) {
  const cookieStore = cookies()

  const sessionToken = (await cookieStore).get("sessionToken")
  if(!sessionToken){
    redirect("/login")
  }

  let user = null

  try{
    const sessionDetails = await getSession(sessionToken)
    user = sessionDetails.identities[0]
  }catch(e){
    redirect("/login")
  }

  return <UserProvider user={user}>{children}</UserProvider>;
}
