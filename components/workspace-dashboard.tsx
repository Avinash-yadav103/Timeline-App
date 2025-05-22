"use client"

import * as React from "react"
import { useWorkspace } from "@/hooks/use-workspace"
import { WorkspaceSidebar } from "@/components/workspace-sidebar"
import { ProjectTimeline } from "@/components/project-timeline"
import { CalendarView } from "@/components/calendar-view"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export function WorkspaceDashboard() {
  const { currentProject, currentView } = useWorkspace()
  
  const renderContent = () => {
    switch (currentView) {
      case "timeline":
        return currentProject ? (
          <ProjectTimeline projectId={currentProject} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">No Project Selected</h2>
              <p className="text-muted-foreground mb-4">Select or create a project to view timeline</p>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </div>
          </div>
        )
      case "calendar":
        return <CalendarView />
      case "notes":
        return (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Markdown Notes</h2>
              <p className="text-muted-foreground mb-4">Create and manage your markdown notes</p>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Note
              </Button>
            </div>
          </div>
        )
      case "whiteboard":
        return (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Whiteboard</h2>
              <p className="text-muted-foreground mb-4">Create diagrams and collaborate visually</p>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Whiteboard
              </Button>
            </div>
          </div>
        )
    }
  }
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full overflow-hidden">
        <WorkspaceSidebar />
        <SidebarInset>
          {renderContent()}
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}