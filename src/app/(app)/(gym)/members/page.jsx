"use client";

import { Users, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AddMemberDrawer } from "@/components/AddMemberDrawer";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const calculateMembershipProgress = (startDate, duration) => {
    const start = new Date(startDate);
    const now = new Date();
    const end = new Date(start);
    end.setDate(start.getDate() + duration);

    if (now > end) return 100;
    return Math.round(((now - start) / (end - start)) * 100);
};

export default function MembersList() {
    const [members, setMembers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all");
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

    const addMember = async (data) => {
        try {
            await axios.post(`/api/members?gymId=${gymId}`, data);
            fetchMembers();
        } catch (err) {
            console.error("Failed to add member", err);
        }
    };

    const filteredMembers = members
        .filter(member => {
            const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());
            const isExpired = calculateMembershipProgress(member.membershipStart, member.membershipDuration) === 100;

            if (filter === "active") return matchesSearch && !isExpired;
            if (filter === "expired") return matchesSearch && isExpired;
            return matchesSearch;
        });

    return (
        <div className="flex flex-col gap-3">
            {/* Compact Header */}
            <div className="flex items-center justify-between gap-2">
                <h1 className="text-xl font-semibold text-gray-900">Members</h1>
                <AddMemberDrawer onAddMember={addMember}>
                    <Button size="sm" className="h-8 gap-1">
                        <Plus className="h-4 w-4" />
                        <span className="sr-only sm:not-sr-only">Add</span>
                    </Button>
                </AddMemberDrawer>
            </div>

            {/* Compact Controls */}
            <div className="flex flex-col gap-2">
                <Input
                    placeholder="Search members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 bg-white"
                />
                <div className="flex gap-1">
                    <Button
                        variant={filter === "all" ? "default" : "outline"}
                        onClick={() => setFilter("all")}
                        className="h-8 px-3 text-xs"
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === "active" ? "default" : "outline"}
                        onClick={() => setFilter("active")}
                        className="h-8 px-3 text-xs"
                    >
                        Active
                    </Button>
                    <Button
                        variant={filter === "expired" ? "default" : "outline"}
                        onClick={() => setFilter("expired")}
                        className="h-8 px-3 text-xs"
                    >
                        Expired
                    </Button>
                </div>
            </div>

            {/* Compact Members List */}
            <div className="grid gap-2">
                {filteredMembers.length === 0 ? (
                    <div className="text-center p-4 text-sm text-gray-400">
                        No members found
                    </div>
                ) : (
                    filteredMembers.map(({ id, name, membershipStart, membershipDuration }) => {
                        const progress = calculateMembershipProgress(membershipStart, membershipDuration);
                        const isExpired = progress === 100;
                        const endDate = new Date(membershipStart);
                        endDate.setDate(endDate.getDate() + membershipDuration);

                        return (
                            <Card key={id} className="hover:shadow-sm transition-shadow">
                                <CardContent className="p-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded-md bg-blue-50">
                                                <Users className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-900">{name}</h3>
                                                <p className="text-xs text-gray-500">
                                                    hello
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`text-xs font-medium ${isExpired ? "text-red-600" : "text-green-600"
                                            }`}>
                                            {!isExpired && `${100 - progress}%`}
                                        </span>
                                    </div>
                                    <Progress
                                        value={progress}
                                        className={`h-1 mt-2 ${isExpired ? "bg-red-100" : "bg-blue-100"}`}
                                        indicatorClassName={isExpired ? "bg-red-500" : "bg-blue-500"}
                                    />
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}