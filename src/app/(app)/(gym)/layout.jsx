import GymLayout from "@/components/GymLayout";
import { isCurrentGymBelongsToUser } from "@/lib/authorizations";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({children}) {
    const gymId = (await headers()).get('x-gym-id');
    
    if(!gymId){
        return redirect('/admin')
    }

    const isValidGymId = await isCurrentGymBelongsToUser(gymId);

    if(!isValidGymId){
        return redirect('/admin')
    }

    return (
        <GymLayout>
            <div className="w-full pt-2">
                {children}
            </div>
        </GymLayout>
    )
}