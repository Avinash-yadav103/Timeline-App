"use client"
import { useCalendar } from "@/hooks/use-calendar"
import { MonthView } from "@/components/month-view"
import { WeekView } from "@/components/week-view"
import { DayView } from "@/components/day-view"
import { CalendarHeader } from "@/components/calendar-header"
import { Notifications } from "@/components/notifications"

export function CalendarView() {
  const { view, currentDate, events, notifications } = useCalendar()

  return (
    <div className="flex h-full w-full flex-col">
      <CalendarHeader />
      <div className="flex-1 overflow-auto p-4">
        {view === "month" && <MonthView />}
        {view === "week" && <WeekView />}
        {view === "day" && <DayView />}
      </div>
      <Notifications />
    </div>
  )
}

