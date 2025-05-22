"use client"
import { ThemeProvider } from "@/context/theme-context";
import { CalendarProvider } from "@/context/calendar-context";
import { WorkspaceProvider } from "@/context/workspace-context";
import { WorkspaceDashboard } from "@/components/workspace-dashboard";

export function WorkspaceApp() {
  return (
    <ThemeProvider>
      <WorkspaceProvider>
        <CalendarProvider>
          <WorkspaceDashboard />
        </CalendarProvider>
      </WorkspaceProvider>
    </ThemeProvider>
  );
}