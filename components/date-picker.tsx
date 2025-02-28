"use client"

import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { useCalendar } from "@/hooks/use-calendar"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function DatePicker() {
  const { currentDate, setCurrentDate } = useCalendar()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !currentDate && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {currentDate ? format(currentDate, "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={currentDate} onSelect={(date) => date && setCurrentDate(date)} initialFocus />
      </PopoverContent>
    </Popover>
  )
}

