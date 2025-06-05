"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"

export function RealtimeIndicator() {
  const [isConnected, setIsConnected] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    // Simulate connection status
    const interval = setInterval(() => {
      setLastUpdate(new Date())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed top-20 right-4 z-50">
      <Badge
        variant={isConnected ? "default" : "destructive"}
        className="bg-green-500 hover:bg-green-600 text-white animate-pulse"
      >
        🟢 Real-time Active
        {lastUpdate && <span className="ml-2 text-xs opacity-75">{lastUpdate.toLocaleTimeString()}</span>}
      </Badge>
    </div>
  )
}
