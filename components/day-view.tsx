"use client"

import { isToday, setHours, getHours, getMinutes, differenceInMinutes, isSameDay } from "date-fns"
import { useCalendar } from "@/hooks/use-calendar"
import { EventCard } from "@/components/event-card"

export function DayView() {
  const { currentDate, events, setSelectedDate, setSelectedEvent } = useCalendar()

  // Generate hours for the day
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const handleTimeClick = (hour: number) => {
    const selectedDateTime = setHours(currentDate, hour)
    setSelectedDate(selectedDateTime)
  }

  const getEventsForDay = () => {
    return events.filter((event) => isSameDay(new Date(event.startTime), currentDate))
  }

  const getEventPosition = (event: any) => {
    const eventStart = new Date(event.startTime)
    const eventEnd = new Date(event.endTime)

    const startHour = getHours(eventStart) + getMinutes(eventStart) / 60
    const duration = differenceInMinutes(eventEnd, eventStart) / 60

    return {
      top: `${startHour * 60}px`,
      height: `${duration * 60}px`,
    }
  }

  const dayEvents = getEventsForDay()

  return (
    <div className="h-full w-full overflow-auto">
      <div className="flex">
        <div className="w-16 flex-shrink-0">
          {hours.map((hour) => (
            <div key={hour} className="h-[60px] border-t border-border pr-2 text-right text-xs text-muted-foreground">
              {hour === 0 ? "" : `${hour}:00`}
            </div>
          ))}
        </div>

        <div className="relative flex-1">
          {hours.map((hour) => (
            <div key={hour} className="h-[60px] border-t border-border" onClick={() => handleTimeClick(hour)}></div>
          ))}

          {/* Current time indicator */}
          {isToday(currentDate) && (
            <div
              className="absolute left-0 right-0 border-t border-red-500 z-10"
              style={{
                top: `${(getHours(new Date()) + getMinutes(new Date()) / 60) * 60}px`,
              }}
            >
              <div className="absolute -left-1 -top-1.5 h-3 w-3 rounded-full bg-red-500"></div>
            </div>
          )}

          {/* Events */}
          {dayEvents.map((event) => {
            const { top, height } = getEventPosition(event)

            return (
              <div
                key={event.id}
                className="absolute left-0 right-0 mx-4 overflow-hidden rounded"
                style={{ top, height }}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedEvent(event)
                }}
              >
                <EventCard event={event} variant="day" />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

