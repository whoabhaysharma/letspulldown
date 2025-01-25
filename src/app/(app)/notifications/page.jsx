"use client";
import { Bell, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const notifications = [
  {
    id: 1,
    title: "New Gym Added",
    message: "Your gym 'Prime Fitness' has been successfully added.",
    timestamp: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    title: "Verification Approved",
    message: "Your gym 'Elite Training' has been verified.",
    timestamp: "1 day ago",
    read: true,
  },
  {
    id: 3,
    title: "New Message",
    message: "You have a new message from a customer.",
    timestamp: "3 days ago",
    read: true,
  },
];

export default function NotificationsPage() {
  const handleMarkAllAsRead = () => {
    // Add logic to mark all notifications as read
    alert("All notifications marked as read!");
  };

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
        <Button
          onClick={handleMarkAllAsRead}
          variant="outline"
          className="text-sm"
        >
          Mark All as Read
        </Button>
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 bg-white rounded-lg shadow-sm border border-gray-100 ${
              !notification.read ? "bg-blue-50" : ""
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Notification Icon */}
              <div className="flex-shrink-0">
                {notification.read ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <Bell className="w-5 h-5 text-blue-600" />
                )}
              </div>

              {/* Notification Content */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-2">{notification.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="bg-gray-100 p-6 rounded-full">
            <Bell className="w-8 h-8 text-gray-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mt-4">
            No New Notifications
          </h2>
          <p className="text-gray-500 mt-2">
            You're all caught up! Check back later for updates.
          </p>
        </div>
      )}
    </div>
  );
}