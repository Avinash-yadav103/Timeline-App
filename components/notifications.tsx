"use client"
import { Bell, X } from "lucide-react"
import { useCalendar } from "@/hooks/use-calendar"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

export function Notifications() {
  const { notifications, dismissNotification } = useCalendar()

  if (notifications.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            "flex items-start gap-2 rounded-lg border p-4 shadow-md bg-card w-80",
            notification.category === "work" && "border-blue-500",
            notification.category === "personal" && "border-green-500",
            notification.category === "reminder" && "border-amber-500",
          )}
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <div className="font-medium">{notification.title}</div>
            <div className="text-sm text-muted-foreground">{format(new Date(notification.time), "h:mm a")}</div>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => dismissNotification(notification.id)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}

