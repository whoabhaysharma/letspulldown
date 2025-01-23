import { auth } from "@/lib/firebase-admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({ children }) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");


  if(session){
    redirect('/')
  }

  // If verification is successful, render the children components
  return children;
}
