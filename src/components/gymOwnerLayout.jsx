"use client";

import { Home, Settings, Bell, User, BarChart, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const GymOwnerLayout = ({ children }) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white shadow-sm z-50 border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4">
          <div className="h-14 flex items-center justify-between">
            {/* Left Section - App Name */}
            <h1 className="text-xl font-bold text-gray-900">
              Gym<span className="text-blue-600">Pro</span>
            </h1>

            {/* Right Section - Notifications */}
            <button
              onClick={() => router.push("/notifications")}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
            >
              <Bell className="w-5 h-5 text-gray-700" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-14 pb-16 px-4 max-w-2xl mx-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-100 shadow-lg z-40">
        <div className="max-w-2xl mx-auto px-4">
          <div className="h-16 flex items-center justify-around">
            {/* Home */}
            <button
              onClick={() => router.push("/")}
              className="flex flex-col items-center justify-center p-2 rounded-lg text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Home className="w-6 h-6" />
              <span className="text-xs mt-1">Home</span>
            </button>

            {/* Analytics */}
            <button
              onClick={() => router.push("/analytics")}
              className="flex flex-col items-center justify-center p-2 rounded-lg text-gray-500 hover:text-blue-600 transition-colors"
            >
              <BarChart className="w-6 h-6" />
              <span className="text-xs mt-1">Analytics</span>
            </button>

            {/* Profile */}
            <button
              onClick={() => router.push("/profile")}
              className="flex flex-col items-center justify-center p-2 rounded-lg text-gray-500 hover:text-blue-600 transition-colors"
            >
              <User className="w-6 h-6" />
              <span className="text-xs mt-1">Profile</span>
            </button>

            {/* Settings */}
            <button
              onClick={() => router.push("/settings")}
              className="flex flex-col items-center justify-center p-2 rounded-lg text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Settings className="w-6 h-6" />
              <span className="text-xs mt-1">Settings</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default GymOwnerLayout;