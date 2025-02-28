"use client"
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns"
import { useCalendar } from "@/hooks/use-calendar"
import { EventCard } from "@/components/event-card"
import { cn } from "@/lib/utils"

export function MonthView() {
  const { currentDate, events, setSelectedDate, setSelectedEvent } = useCalendar()

  // Get days for the current month view (including days from prev/next months)
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  })

  // Group days into weeks
  const weeks = []
  let week = []

  calendarDays.forEach((day, i) => {
    week.push(day)
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  })

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
  }

  const getEventsForDay = (date: Date) => {
    return events.filter((event) => isSameDay(new Date(event.startTime), date))
  }

  return (
    <div className="h-full w-full">
      <div className="grid grid-cols-7 gap-px border-b border-border">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-2 text-center font-medium">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 grid-rows-6 gap-px h-[calc(100%-2rem)]">
        {weeks.flat().map((day, i) => {
          const dayEvents = getEventsForDay(day)
          const isCurrentMonth = isSameMonth(day, currentDate)

          return (
            <div
              key={i}
              className={cn(
                "min-h-[100px] p-1 border border-border/20",
                isCurrentMonth ? "bg-background" : "bg-muted/30",
                isToday(day) && "ring-2 ring-primary ring-inset",
              )}
              onClick={() => handleDateClick(day)}
            >
              <div className="flex justify-between items-start">
                <span
                  className={cn(
                    "inline-block h-6 w-6 rounded-full text-center text-sm leading-6",
                    isToday(day) && "bg-primary text-primary-foreground",
                    !isCurrentMonth && "text-muted-foreground",
                  )}
                >
                  {format(day, "d")}
                </span>
              </div>
              <div className="mt-1 max-h-[80px] overflow-y-auto space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <EventCard key={event.id} event={event} variant="mini" onClick={() => setSelectedEvent(event)} />
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground px-1">+{dayEvents.length - 3} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

