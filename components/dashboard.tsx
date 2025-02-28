"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { CalendarView } from "@/components/calendar-view"
import { EventDialog } from "@/components/event-dialog"
import { useCalendar } from "@/hooks/use-calendar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export function Dashboard() {
  const { selectedEvent, setSelectedEvent } = useCalendar()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar />
        <SidebarInset>
          <CalendarView />
          <EventDialog
            open={!!selectedEvent}
            onOpenChange={(open) => {
              if (!open) setSelectedEvent(null)
            }}
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

