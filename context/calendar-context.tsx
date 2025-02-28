"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { addMinutes, isBefore, isAfter, isSameDay } from "date-fns"
import type { Event, Notification } from "@/types"

interface CalendarContextType {
  events: Event[]
  filteredEvents: Event[]
  view: "month" | "week" | "day"
  currentDate: Date
  selectedDate: Date | null
  selectedEvent: Event | null
  categories: string[]
  notifications: Notification[]
  setView: (view: "month" | "week" | "day") => void
  setCurrentDate: (date: Date) => void
  setSelectedDate: (date: Date | null) => void
  setSelectedEvent: (event: Event | null) => void
  addEvent: (event: Event) => void
  updateEvent: (event: Event) => void
  deleteEvent: (id: string) => void
  searchEvents: (query: string) => void
  toggleCategory: (category: string) => void
  dismissNotification: (id: string) => void
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined)

// Sample events data
const sampleEvents: Event[] = [
  {
    id: "1",
    title: "Team Meeting",
    description: "Weekly team sync",
    startTime: new Date(new Date().setHours(10, 0, 0, 0)),
    endTime: new Date(new Date().setHours(11, 0, 0, 0)),
    category: "work",
    location: "Conference Room A",
    isRecurring: true,
    recurrencePattern: "weekly",
  },
  {
    id: "2",
    title: "Lunch with Sarah",
    description: "Discuss project collaboration",
    startTime: new Date(new Date().setHours(12, 30, 0, 0)),
    endTime: new Date(new Date().setHours(13, 30, 0, 0)),
    category: "personal",
    location: "Cafe Downtown",
    isRecurring: false,
    recurrencePattern: "none",
  },
  {
    id: "3",
    title: "Dentist Appointment",
    description: "Regular checkup",
    startTime: new Date(new Date().setDate(new Date().getDate() + 2)).setHours(15, 0, 0, 0),
    endTime: new Date(new Date().setDate(new Date().getDate() + 2)).setHours(16, 0, 0, 0),
    category: "personal",
    location: "Dental Clinic",
    isRecurring: false,
    recurrencePattern: "none",
  },
  {
    id: "4",
    title: "Project Deadline",
    description: "Submit final deliverables",
    startTime: new Date(new Date().setDate(new Date().getDate() + 5)).setHours(17, 0, 0, 0),
    endTime: new Date(new Date().setDate(new Date().getDate() + 5)).setHours(18, 0, 0, 0),
    category: "work",
    location: "",
    isRecurring: false,
    recurrencePattern: "none",
  },
  {
    id: "5",
    title: "Gym Session",
    description: "Cardio day",
    startTime: new Date(new Date().setHours(7, 0, 0, 0)),
    endTime: new Date(new Date().setHours(8, 0, 0, 0)),
    category: "personal",
    location: "Fitness Center",
    isRecurring: true,
    recurrencePattern: "daily",
  },
]

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>(sampleEvents)
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(sampleEvents)
  const [view, setView] = useState<"month" | "week" | "day">("month")
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [categories, setCategories] = useState<string[]>(["work", "personal", "reminder"])
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Filter events based on selected categories
  useEffect(() => {
    const filtered = events.filter((event) => categories.includes(event.category))
    setFilteredEvents(filtered)
  }, [events, categories])

  // Check for upcoming events and create notifications
  useEffect(() => {
    const checkUpcomingEvents = () => {
      const now = new Date()
      const upcoming = events.filter((event) => {
        const eventStart = new Date(event.startTime)
        const reminderTime = addMinutes(eventStart, -15) // 15 minutes before event

        return isAfter(eventStart, now) && isBefore(reminderTime, now) && isSameDay(eventStart, now)
      })

      const newNotifications = upcoming.map((event) => ({
        id: uuidv4(),
        title: `Upcoming: ${event.title}`,
        message: `Starting in 15 minutes`,
        time: new Date(),
        category: event.category,
        eventId: event.id,
      }))

      if (newNotifications.length > 0) {
        setNotifications((prev) => [...prev, ...newNotifications])
      }
    }

    // Check for upcoming events every minute
    const interval = setInterval(checkUpcomingEvents, 60000)

    return () => clearInterval(interval)
  }, [events])

  const addEvent = (event: Event) => {
    const newEvent = {
      ...event,
      id: uuidv4(),
    }

    setEvents((prev) => [...prev, newEvent])
  }

  const updateEvent = (updatedEvent: Event) => {
    setEvents((prev) => prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)))
  }

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id))
  }

  const searchEvents = (query: string) => {
    if (!query) {
      setFilteredEvents(events.filter((event) => categories.includes(event.category)))
      return
    }

    const lowerQuery = query.toLowerCase()
    const filtered = events.filter(
      (event) =>
        (event.title.toLowerCase().includes(lowerQuery) ||
          (event.description && event.description.toLowerCase().includes(lowerQuery)) ||
          (event.location && event.location.toLowerCase().includes(lowerQuery))) &&
        categories.includes(event.category),
    )

    setFilteredEvents(filtered)
  }

  const toggleCategory = (category: string) => {
    setCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category)
      } else {
        return [...prev, category]
      }
    })
  }

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  return (
    <CalendarContext.Provider
      value={{
        events,
        filteredEvents,
        view,
        currentDate,
        selectedDate,
        selectedEvent,
        categories,
        notifications,
        setView,
        setCurrentDate,
        setSelectedDate,
        setSelectedEvent,
        addEvent,
        updateEvent,
        deleteEvent,
        searchEvents,
        toggleCategory,
        dismissNotification,
      }}
    >
      {children}
    </CalendarContext.Provider>
  )
}

export function useCalendar() {
  const context = useContext(CalendarContext)

  if (context === undefined) {
    throw new Error("useCalendar must be used within a CalendarProvider")
  }

  return context
}

