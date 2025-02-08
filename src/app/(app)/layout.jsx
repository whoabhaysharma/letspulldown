import UserProvider from "@/context/UserProvider";
import { getUserInformationFromSessionToken } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({ children }) {
  const cookieStore = cookies()

  const sessionToken = (await cookieStore).get("sessionToken")?.value
  if(!sessionToken){
    redirect("/login")
  }

  let user = null

  try{
    user  = (await getUserInformationFromSessionToken(sessionToken))
  }catch(e){
    redirect("/login")
  }

  return <UserProvider user={user}>{children}</UserProvider>;
}
