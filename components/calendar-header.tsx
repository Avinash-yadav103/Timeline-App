"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { format, addMonths, addWeeks, addDays, subMonths, subWeeks, subDays } from "date-fns"
import { useCalendar } from "@/hooks/use-calendar"
import { Button } from "@/components/ui/button"

export function CalendarHeader() {
  const { view, currentDate, setCurrentDate } = useCalendar()

  const navigateToToday = () => {
    setCurrentDate(new Date())
  }

  const navigatePrevious = () => {
    if (view === "month") {
      setCurrentDate(subMonths(currentDate, 1))
    } else if (view === "week") {
      setCurrentDate(subWeeks(currentDate, 1))
    } else if (view === "day") {
      setCurrentDate(subDays(currentDate, 1))
    }
  }

  const navigateNext = () => {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, 1))
    } else if (view === "week") {
      setCurrentDate(addWeeks(currentDate, 1))
    } else if (view === "day") {
      setCurrentDate(addDays(currentDate, 1))
    }
  }

  const getHeaderText = () => {
    if (view === "month") {
      return format(currentDate, "MMMM yyyy")
    } else if (view === "week") {
      return `Week of ${format(currentDate, "MMMM d, yyyy")}`
    } else if (view === "day") {
      return format(currentDate, "EEEE, MMMM d, yyyy")
    }
    return ""
  }

  return (
    <div className="flex items-center justify-between border-b border-border p-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={navigateToToday}>
          Today
        </Button>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={navigatePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={navigateNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-xl font-semibold">{getHeaderText()}</h2>
      </div>
    </div>
  )
}

