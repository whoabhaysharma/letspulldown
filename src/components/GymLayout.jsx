"use client";

import { Home, Users, CreditCard, Settings, Bell } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const GymLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()
  const gymId = searchParams.get('gymId')

  const isActive = (routeSegment) => {
    return pathname === routeSegment;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white shadow-sm z-50 border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4">
          <div className="h-14 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">
              Gym Name ({gymId})
            </h1>
            <button
              onClick={() => router.push(`/gym/${gymId}/notifications`)}
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

      <main className="pt-14 pb-16 px-4 max-w-2xl mx-auto">{children}</main>

      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-100 shadow-lg z-40">
        <div className="max-w-2xl mx-auto px-4">
          <div className="h-16 flex items-center justify-around">
            <button
              onClick={() => router.push(`/`)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                isActive("/") ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs mt-1">Home</span>
            </button>

            <button
              onClick={() => router.push(`/members`)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                isActive("/members") ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
              }`}
            >
              <Users className="w-6 h-6" />
              <span className="text-xs mt-1">Members</span>
            </button>

            <button
              onClick={() => router.push(`/memberships`)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                isActive("/memberships") ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
              }`}
            >
              <CreditCard className="w-6 h-6" />
              <span className="text-xs mt-1">Memberships</span>
            </button>

            <button
              onClick={() => router.push(`/settings`)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                isActive("/settings") ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
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

export default GymLayout;