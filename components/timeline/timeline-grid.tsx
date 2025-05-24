"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  format, 
  isToday,
  isSameMonth,
  addDays,
  differenceInDays,
  startOfWeek,
  endOfWeek,
  addMonths,
  isSameDay
} from "date-fns";
import { cn } from "@/lib/utils";
import { useTimelineStore } from "@/store/timeline-store";
import { TimelineItem } from "./timeline-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { TimelineItemDialog } from "./timeline-item-dialog";

interface TimelineGridProps {
  currentDate: Date;
}

export function TimelineGrid({ currentDate }: TimelineGridProps) {
  const { currentProject, timelineView } = useTimelineStore();
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  
  // Calculate grid based on view type and current date
  const gridData = useMemo(() => {
    switch (timelineView) {
      case "month": {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(currentDate);
        const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
        
        // Start from Sunday of the week the month starts
        const calendarStart = startOfWeek(monthStart);
        // End on Saturday of the week the month ends
        const calendarEnd = endOfWeek(monthEnd);
        
        // All days that should appear in the month view
        const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
        
        return {
          days: calendarDays,
          startDate: calendarStart,
          endDate: calendarEnd,
        };
      }
      
      case "week": {
        const weekStart = startOfWeek(currentDate);
        const weekEnd = endOfWeek(currentDate);
        const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
        
        return {
          days: weekDays,
          startDate: weekStart,
          endDate: weekEnd,
        };
      }
      
      case "day": {
        return {
          days: [currentDate],
          startDate: currentDate,
          endDate: currentDate,
        };
      }
      
      default:
        return {
          days: [],
          startDate: new Date(),
          endDate: new Date(),
        };
    }
  }, [timelineView, currentDate]);
  
  // Position timeline items on the grid
  const positionedItems = useMemo(() => {
    if (!currentProject) return [];
    
    return currentProject.items.map(item => {
      // Calculate position based on item dates relative to the grid
      const startOffset = Math.max(0, differenceInDays(item.startDate, gridData.startDate));
      const duration = Math.min(
        differenceInDays(gridData.endDate, item.startDate) + 1,
        differenceInDays(item.endDate, item.startDate) + 1
      );
      
      return {
        ...item,
        startOffset,
        duration,
      };
    });
  }, [currentProject, gridData]);
  
  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <p className="text-muted-foreground">Select a project to view timeline</p>
      </div>
    );
  }
  
  return (
    <>
      {currentProject && (
        <div className="p-4 flex justify-end">
          <Button onClick={() => setShowAddItemDialog(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      )}
      
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="relative min-h-[500px] min-w-[800px]">
          {/* Time headers */}
          <div className="flex border-b sticky top-0 bg-background z-10">
            {gridData.days.map((day, i) => (
              <div
                key={i}
                className={cn(
                  "flex-1 min-w-[40px] text-center py-2 border-r text-sm",
                  !isSameMonth(day, currentDate) && "text-muted-foreground bg-muted/30",
                  isToday(day) && "bg-blue-50 dark:bg-blue-900/20"
                )}
              >
                <div className="font-medium">{format(day, "EEE")}</div>
                <div className={cn(
                  "text-xs",
                  isToday(day) && "bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto"
                )}>
                  {format(day, "d")}
                </div>
              </div>
            ))}
          </div>
          
          {/* Timeline items */}
          <div className="relative p-2">
            {positionedItems.map((item) => (
              <TimelineItem
                key={item.id}
                item={item}
                startOffset={item.startOffset}
                duration={item.duration}
                totalColumns={gridData.days.length}
              />
            ))}
          </div>
        </div>
      </ScrollArea>
      
      {currentProject && (
        <TimelineItemDialog 
          open={showAddItemDialog}
          onOpenChange={setShowAddItemDialog}
          projectId={currentProject.id}
        />
      )}
    </>
  );
}