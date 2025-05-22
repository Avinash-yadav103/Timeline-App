"use client"

import * as React from "react"
import { format, differenceInDays } from "date-fns"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { TimelineItem as TimelineItemType } from "@/types"

interface TimelineItemProps {
  task: TimelineItemType
  timelineStart: Date
  dayWidth: number
}

export function TimelineItem({ task, timelineStart, dayWidth }: TimelineItemProps) {
  // Calculate position and width based on dates
  const taskStart = new Date(task.startDate)
  const taskEnd = new Date(task.endDate)
  
  const startOffset = differenceInDays(taskStart, timelineStart)
  const duration = differenceInDays(taskEnd, taskStart) + 1 // +1 because end date is inclusive
  
  const getCategoryColor = () => {
    switch (task.category) {
      case "Database":
        return "bg-red-500"
      case "Import":
        return "bg-amber-500"
      case "Data Import":
        return "bg-amber-500"
      case "Role Management":
        return "bg-slate-500"
      case "Control Tables":
        return "bg-blue-500"
      case "Forms":
        return "bg-purple-500"
      case "User Forms":
        return "bg-purple-500"
      case "Budget Import":
        return "bg-yellow-500"
      case "Reports":
        return "bg-green-500" 
      case "Unit Test":
        return "bg-emerald-800"
      default:
        return "bg-gray-500"
    }
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={cn(
              "absolute rounded border border-border shadow-sm",
              getCategoryColor(),
              "text-white h-14 cursor-pointer"
            )}
            style={{
              left: `${startOffset * dayWidth}px`,
              width: `${duration * dayWidth - 4}px`,
              top: "12px"
            }}
          >
            <div className="p-1 text-xs h-full overflow-hidden">
              <div className="font-medium truncate">{task.title}</div>
              <div className="text-xs opacity-90 truncate">
                {format(taskStart, "MMM dd")} - {format(taskEnd, "MMM dd")}
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <h4 className="font-semibold">{task.title}</h4>
            <p className="text-xs">{task.description}</p>
            <div className="text-xs text-muted-foreground">
              {format(taskStart, "MMM dd, yyyy")} - {format(taskEnd, "MMM dd, yyyy")}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}