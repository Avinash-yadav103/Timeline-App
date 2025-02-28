"use client"

import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
  setHours,
  getHours,
  getMinutes,
  differenceInMinutes,
} from "date-fns"
import { useCalendar } from "@/hooks/use-calendar"
import { EventCard } from "@/components/event-card"
import { cn } from "@/lib/utils"

export function WeekView() {
  const { currentDate, events, setSelectedDate, setSelectedEvent } = useCalendar()

  // Get days for the current week
  const weekStart = startOfWeek(currentDate)
  const weekEnd = endOfWeek(currentDate)

  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: weekEnd,
  })

  // Generate hours for the day
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const handleDateClick = (date: Date, hour: number) => {
    const selectedDateTime = setHours(date, hour)
    setSelectedDate(selectedDateTime)
  }

  const getEventsForDay = (date: Date) => {
    return events.filter((event) => isSameDay(new Date(event.startTime), date))
  }

  const getEventPosition = (event: any, day: Date) => {
    const eventStart = new Date(event.startTime)
    const eventEnd = new Date(event.endTime)

    const startHour = getHours(eventStart) + getMinutes(eventStart) / 60
    const duration = differenceInMinutes(eventEnd, eventStart) / 60

    return {
      top: `${startHour * 60}px`,
      height: `${duration * 60}px`,
    }
  }

  return (
    <div className="h-full w-full overflow-auto">
      <div className="flex">
        <div className="w-16 flex-shrink-0"></div>
        <div className="grid flex-1 grid-cols-7 gap-px">
          {weekDays.map((day) => (
            <div key={day.toString()} className={cn("p-2 text-center", isToday(day) && "bg-primary/10")}>
              <div className="font-medium">{format(day, "EEE")}</div>
              <div
                className={cn(
                  "mx-auto flex h-6 w-6 items-center justify-center rounded-full text-sm",
                  isToday(day) && "bg-primary text-primary-foreground",
                )}
              >
                {format(day, "d")}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex">
        <div className="w-16 flex-shrink-0">
          {hours.map((hour) => (
            <div key={hour} className="h-[60px] border-t border-border pr-2 text-right text-xs text-muted-foreground">
              {hour === 0 ? "" : `${hour}:00`}
            </div>
          ))}
        </div>

        <div className="relative grid flex-1 grid-cols-7 gap-px">
          {weekDays.map((day) => {
            const dayEvents = getEventsForDay(day)

            return (
              <div key={day.toString()} className={cn("relative", isToday(day) && "bg-primary/5")}>
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="h-[60px] border-t border-border"
                    onClick={() => handleDateClick(day, hour)}
                  ></div>
                ))}

                {/* Events */}
                {dayEvents.map((event) => {
                  const { top, height } = getEventPosition(event, day)

                  return (
                    <div
                      key={event.id}
                      className="absolute left-0 right-0 mx-1 overflow-hidden rounded"
                      style={{ top, height }}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedEvent(event)
                      }}
                    >
                      <EventCard event={event} variant="week" />
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

