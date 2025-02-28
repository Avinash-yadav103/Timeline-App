"use client"
import { CalendarProvider } from "@/context/calendar-context"
import { ThemeProvider } from "@/context/theme-context"
import { Dashboard } from "@/components/dashboard"

export function CalendarApp() {
  return (
    <ThemeProvider>
      <CalendarProvider>
        <Dashboard />
      </CalendarProvider>
    </ThemeProvider>
  )
}

