"use client"

import { Activity, Users, CreditCard, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const revenueData = [
  { name: "M", total: 4000 },
  { name: "T", total: 3000 },
  { name: "W", total: 2000 },
  { name: "T", total: 2780 },
  { name: "F", total: 1890 },
  { name: "S", total: 2390 },
  { name: "S", total: 3490 },
]

const memberData = [
  { name: "M", total: 100 },
  { name: "T", total: 120 },
  { name: "W", total: 150 },
  { name: "T", total: 180 },
  { name: "F", total: 200 },
  { name: "S", total: 220 },
  { name: "S", total: 240 },
]

export default function MobileGymDashboard() {
  return (
    <div className="flex flex-col gap-2 mb-5">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Users className="w-6 h-6 text-blue-500" />
              <span className="text-xs font-medium text-gray-500">Members</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold">1,234</span>
              <span className="text-xs text-green-500 ml-2">+12%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <CreditCard className="w-6 h-6 text-green-500" />
              <span className="text-xs font-medium text-gray-500">Revenue</span>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold">$12,345</span>
              <span className="text-xs text-green-500 ml-2">+8%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bars */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4 space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Membership Goal</span>
              <span className="text-blue-500">75%</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Revenue Target</span>
              <span className="text-green-500">50%</span>
            </div>
            <Progress value={50} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Revenue Chart */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Weekly Revenue</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis hide={true} />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                  labelStyle={{ color: "#6B7280" }}
                />
                <Bar dataKey="total" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Members Chart */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Weekly New Members</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memberData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis hide={true} />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                  labelStyle={{ color: "#6B7280" }}
                />
                <Bar dataKey="total" fill="#82ca9d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { activity: "New member joined", timeAgo: "2h ago", icon: Users, color: "text-blue-500" },
              { activity: "Revenue target achieved", timeAgo: "1d ago", icon: TrendingUp, color: "text-green-500" },
              { activity: "New equipment arrived", timeAgo: "2d ago", icon: Activity, color: "text-purple-500" },
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${item.color} bg-opacity-10`}>
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium">{item.activity}</p>
                  <p className="text-xs text-gray-500">{item.timeAgo}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}