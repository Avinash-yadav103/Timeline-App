"use client"

import { useCalendar } from "@/hooks/use-calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function CategoryList() {
  const { categories, toggleCategory } = useCalendar()

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox id="work" checked={categories.includes("work")} onCheckedChange={() => toggleCategory("work")} />
        <Label htmlFor="work" className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
          Work
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="personal"
          checked={categories.includes("personal")}
          onCheckedChange={() => toggleCategory("personal")}
        />
        <Label htmlFor="personal" className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
          Personal
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="reminder"
          checked={categories.includes("reminder")}
          onCheckedChange={() => toggleCategory("reminder")}
        />
        <Label htmlFor="reminder" className="flex items-center">
          <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
          Reminder
        </Label>
      </div>
    </div>
  )
}

