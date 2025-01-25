"use client";

import { Users, Clock, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AddMemberDrawer } from "@/components/AddMemberDrawer";

const membersData = [
    {
        id: 1,
        name: "John Doe",
        membershipStart: "2023-09-01",
        membershipDuration: 30, // 30 days
    },
    {
        id: 2,
        name: "Jane Smith",
        membershipStart: "2023-09-15",
        membershipDuration: 60, // 60 days
    },
    {
        id: 3,
        name: "Alice Johnson",
        membershipStart: "2023-10-01",
        membershipDuration: 90, // 90 days
    },
    {
        id: 4,
        name: "Bob Brown",
        membershipStart: "2023-08-20",
        membershipDuration: 30, // 30 days
    },
];

const calculateMembershipProgress = (startDate, duration) => {
    const start = new Date(startDate);
    const now = new Date();
    const end = new Date(start);
    end.setDate(start.getDate() + duration);

    const totalDuration = end - start;
    const elapsedDuration = now - start;

    if (now > end) return 100; // Membership expired
    return Math.round((elapsedDuration / totalDuration) * 100);
};

export default function MembersList() {
    return (
        <div className="flex flex-col gap-4">
            {membersData.map((member) => {
                const progress = calculateMembershipProgress(
                    member.membershipStart,
                    member.membershipDuration
                );

                return (
                    <Card key={member.id} className="bg-white shadow-sm">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 rounded-full bg-blue-500 bg-opacity-10">
                                        <Users className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{member.name}</p>
                                        <p className="text-xs text-gray-500">
                                            Membership Start: {member.membershipStart}
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
            <AddMemberDrawer onAddMember={() => { }} />

        </div>
    );
}