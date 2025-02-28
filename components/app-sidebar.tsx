"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, Plus, Search, User, Settings, Moon, Sun } from "lucide-react"
import { useCalendar } from "@/hooks/use-calendar"
import { useTheme } from "@/context/theme-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { DatePicker } from "@/components/date-picker"
import { CalendarViewSelector } from "@/components/calendar-view-selector"
import { CategoryList } from "@/components/category-list"

export function AppSidebar() {
  const { addEvent, searchEvents } = useCalendar()
  const { theme, setTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    searchEvents(query)
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            <h1 className="text-xl font-bold">Notion Calendar</h1>
          </div>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="p-4">
          <Button className="w-full justify-start gap-2" onClick={() => addEvent()}>
            <Plus className="h-4 w-4" />
            New Event
          </Button>
        </div>

        <SidebarGroup>
          <div className="px-4 pb-2">
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full"
              prefix={<Search className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Calendar</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2">
              <DatePicker />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>View</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2">
              <CalendarViewSelector />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2">
              <CategoryList />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <User className="h-4 w-4" />
              <span>Account</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

