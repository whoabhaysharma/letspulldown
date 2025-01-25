import GymOwnerLayout from "@/components/gymOwnerLayout";

export default async function Layout({ children }) {
  return (
    <GymOwnerLayout>
      <div className="w-full pt-2">
        {children}
      </div>
    </GymOwnerLayout>
  );
}
