import React from "react"

export default function LoadingScreen({ fullScreen = true }) {
  return (
    <div
      className={`flex items-center justify-center ${fullScreen ? "fixed inset-0 bg-background/80 backdrop-blur-sm" : "h-full w-full"}`}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <p className="text-sm font-medium text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}

