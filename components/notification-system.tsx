"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, AlertCircle, X } from "lucide-react"

interface Notification {
  id: string
  message: string
  type: "success" | "error" | "info"
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const handleNotification = (event: CustomEvent) => {
      const { message, type } = event.detail
      const id = crypto.randomUUID()

      setNotifications((prev) => [...prev, { id, message, type }])

      // Auto-remove after 5 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
      }, 5000)
    }

    window.addEventListener("coconutz-notification", handleNotification as EventListener)

    return () => {
      window.removeEventListener("coconutz-notification", handleNotification as EventListener)
    }
  }, [])

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <Card key={notification.id} className="bg-gray-800/95 border-gray-700 backdrop-blur-sm shadow-lg min-w-80">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              {notification.type === "success" && <CheckCircle className="h-5 w-5 text-green-400" />}
              {notification.type === "error" && <AlertCircle className="h-5 w-5 text-red-400" />}
              {notification.type === "info" && <AlertCircle className="h-5 w-5 text-blue-400" />}

              <p className="text-white text-sm flex-1">{notification.message}</p>

              <button onClick={() => removeNotification(notification.id)} className="text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
