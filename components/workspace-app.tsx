"use client"
import { ThemeProvider } from "@/context/theme-context";
import { CalendarProvider } from "@/context/calendar-context";
import { WorkspaceProvider } from "@/context/workspace-context";
import { WorkspaceDashboard } from "@/components/workspace-dashboard";
import { TooltipProvider } from "@/components/ui/tooltip"; // Add this import

export function WorkspaceApp() {
  return (
    <ThemeProvider>
      <WorkspaceProvider>
        <CalendarProvider>
          <TooltipProvider>
            <WorkspaceDashboard />
          </TooltipProvider>
        </CalendarProvider>
      </WorkspaceProvider>
    </ThemeProvider>
  );
}