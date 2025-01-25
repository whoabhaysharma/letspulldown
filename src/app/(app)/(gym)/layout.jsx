import GymLayout from "@/components/GymLayout";

export default function Layout({children}) {
    return (
        <GymLayout>
            <div className="w-full pt-2">
                {children}
            </div>
        </GymLayout>
    )
}