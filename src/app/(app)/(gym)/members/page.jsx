"use client";

import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AddMemberDrawer } from "@/components/AddMemberDrawer";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

const calculateMembershipProgress = (startDate, duration) => {
    const start = new Date(startDate);
    const now = new Date();
    const end = new Date(start);
    end.setDate(start.getDate() + duration);

    if (now > end) return 100; // Membership expired

    return Math.round(((now - start) / (end - start)) * 100);
};

export default function MembersList() {
    const [members, setMembers] = useState([]);
    const searchParams = useSearchParams();
    const gymId = searchParams.get("gymId");

    const fetchMembers = async () => {
        try {
            const { data } = await axios.get(`/api/members/list?gymId=${gymId}`);
            setMembers(data?.data || []);
        } catch (err) {
            console.error("Failed to load members data", err);
        }
    };

    useEffect(() => {
        if (gymId) fetchMembers();
    }, [gymId]);

    const addMember = async(data) => {
        try{
            const resp = await axios.post(`/api/members?gymId=${gymId}`, data);
            console.log("Member added", resp.data);
        }catch(err){
            console.error("Failed to add member", err);
        }
    }
 
    return (
        <div className="flex flex-col gap-4">
            {members.map(({ id, name, membershipStart, membershipDuration }) => {
                const progress = calculateMembershipProgress(membershipStart, membershipDuration);

                return (
                    <Card key={id} className="bg-white shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 rounded-full bg-blue-500 bg-opacity-10">
                                        <Users className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{name}</p>
                                        <p className="text-xs text-gray-500">
                                            Membership Start: {membershipStart}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500">
                                    {progress === 100 ? "Expired" : `${100 - progress}% left`}
                                </div>
                            </div>
                            <div className="mt-4">
                                <Progress value={progress} className="h-2" />
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
            <AddMemberDrawer onAddMember={addMember} />
        </div>
    );
}
