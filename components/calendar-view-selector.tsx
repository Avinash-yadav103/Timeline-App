"use client"

import { useCalendar } from "@/hooks/use-calendar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function CalendarViewSelector() {
  const { view, setView } = useCalendar()

  return (
    <div className="flex w-full space-x-1">
      <Button
        variant="outline"
        size="sm"
        className={cn("flex-1", view === "month" && "bg-primary text-primary-foreground")}
        onClick={() => setView("month")}
      >
        Month
      </Button>
      <Button
        variant="outline"
        size="sm"
        className={cn("flex-1", view === "week" && "bg-primary text-primary-foreground")}
        onClick={() => setView("week")}
      >
        Week
      </Button>
      <Button
        variant="outline"
        size="sm"
        className={cn("flex-1", view === "day" && "bg-primary text-primary-foreground")}
        onClick={() => setView("day")}
      >
        Day
      </Button>
    </div>
  )
}

