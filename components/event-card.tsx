"use client"

import { Clock, MapPin } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import type { Event } from "@/types"

interface EventCardProps {
  event: Event
  variant?: "default" | "mini" | "week" | "day"
  onClick?: () => void
}

export function EventCard({ event, variant = "default", onClick }: EventCardProps) {
  const getEventTime = () => {
    const start = new Date(event.startTime)
    const end = new Date(event.endTime)

    if (variant === "mini") {
      return format(start, "h:mm a")
    }

    return `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`
  }

  const getCategoryColor = () => {
    switch (event.category) {
      case "work":
        return "bg-blue-500"
      case "personal":
        return "bg-green-500"
      case "reminder":
        return "bg-amber-500"
      default:
        return "bg-gray-500"
    }
  }

  if (variant === "mini") {
    return (
      <div
        className={cn("flex items-center px-1 py-0.5 text-xs rounded truncate", getCategoryColor(), "text-white")}
        onClick={onClick}
      >
        {event.title}
      </div>
    )
  }

  if (variant === "week") {
    return (
      <div className={cn("h-full p-1 text-xs overflow-hidden", getCategoryColor(), "text-white")} onClick={onClick}>
        <div className="font-medium truncate">{event.title}</div>
        {event.location && (
          <div className="flex items-center gap-1 truncate">
            <MapPin className="h-3 w-3" />
            <span>{event.location}</span>
          </div>
        )}
      </div>
    )
  }

  if (variant === "day") {
    return (
      <div className={cn("h-full p-2 overflow-hidden", getCategoryColor(), "text-white")} onClick={onClick}>
        <div className="font-medium">{event.title}</div>
        <div className="flex items-center gap-1 text-sm">
          <Clock className="h-3 w-3" />
          <span>{getEventTime()}</span>
        </div>
        {event.location && (
          <div className="flex items-center gap-1 text-sm">
            <MapPin className="h-3 w-3" />
            <span>{event.location}</span>
          </div>
        )}
        {event.description && <div className="mt-1 text-sm line-clamp-2">{event.description}</div>}
      </div>
    )
  }

  return (
    <div
      className="flex flex-col gap-2 p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-card"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{event.title}</h3>
        <div className={cn("h-3 w-3 rounded-full", getCategoryColor())}></div>
      </div>
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>{getEventTime()}</span>
      </div>
      {event.location && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{event.location}</span>
        </div>
      )}
      {event.description && <div className="mt-1 text-sm text-muted-foreground">{event.description}</div>}
    </div>
  )
}

