"use client";

import { Home, Settings, Bell, User, BarChart } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

const GymOwnerLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname(); // Get the current route

  // Function to determine if a navigation item is active
  const isActive = (route) => {
    return pathname === route;
  };

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
              onClick={() => router.push("/admin/notifications")}
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
      <main className="pt-14 pb-16 px-4 max-w-2xl mx-auto">{children}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-100 shadow-lg z-40">
        <div className="max-w-2xl mx-auto px-4">
          <div className="h-16 flex items-center justify-around">
            {/* Home */}
            <button
              onClick={() => router.push("/admin")}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                isActive("/admin")
                  ? "text-blue-600" // Active style
                  : "text-gray-500 hover:text-blue-600" // Inactive style
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs mt-1">Home</span>
            </button>

            {/* Analytics */}
            <button
              onClick={() => router.push("/admin/analytics")}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                isActive("/admin/analytics")
                  ? "text-blue-600" // Active style
                  : "text-gray-500 hover:text-blue-600" // Inactive style
              }`}
            >
              <BarChart className="w-6 h-6" />
              <span className="text-xs mt-1">Analytics</span>
            </button>

            {/* Profile */}
            <button
              onClick={() => router.push("/admin/profile")}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                isActive("/admin/profile")
                  ? "text-blue-600" // Active style
                  : "text-gray-500 hover:text-blue-600" // Inactive style
              }`}
            >
              <User className="w-6 h-6" />
              <span className="text-xs mt-1">Profile</span>
            </button>

            {/* Settings */}
            <button
              onClick={() => router.push("/admin/settings")}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                isActive("/admin/settings")
                  ? "text-blue-600" // Active style
                  : "text-gray-500 hover:text-blue-600" // Inactive style
              }`}
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