import UserProvider from "@/context/UserProvider";

export default async function Layout({ children }) {
  const user = {name : "Abhay sharma"}

  return <UserProvider user={user}>{children}</UserProvider>;
}
