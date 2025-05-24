"use client";

import * as React from "react";
import { useWhiteboardStore } from "@/store/whiteboard-store";
import { useWorkspace, WorkspaceProvider } from "@/context/workspace-context";
import { WorkspaceSidebar } from "@/components/workspace-sidebar";
import { ProjectTimeline } from "@/components/project-timeline";
import { CalendarView } from "@/components/calendar-view";
import { WhiteboardDashboard } from "@/components/whiteboard/whiteboard-dashboard";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { CalendarProvider } from "@/context/calendar-context"; // Add this import
import { GoalsView } from "@/components/goals-view";

// Create a wrapper component that uses the context hooks
function WorkspaceDashboardContent() {
  const router = useRouter();
  const { currentProject, currentView } = useWorkspace();
  const { whiteboards, createWhiteboard } = useWhiteboardStore();

  const handleNewWhiteboard = () => {
    const whiteboard = createWhiteboard("Untitled Whiteboard");
    router.push(`/whiteboard/${whiteboard.id}`);
  };

  const renderContent = () => {
    switch (currentView) {
      case "timeline":
        return currentProject ? (
          <ProjectTimeline projectId={currentProject} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">No Project Selected</h2>
              <p className="text-muted-foreground mb-4">
                Select or create a project to view timeline
              </p>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </div>
          </div>
        );
      case "calendar":
        return (
          <CalendarProvider>
            <CalendarView />
          </CalendarProvider>
        );
      case "notes":
        return (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Markdown Notes</h2>
              <p className="text-muted-foreground mb-4">
                Create and manage your markdown notes
              </p>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Note
              </Button>
            </div>
          </div>
        );
      case "whiteboard":
        return whiteboards.length > 0 ? (
          <WhiteboardDashboard />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Whiteboard</h2>
              <p className="text-muted-foreground mb-4">
                Create diagrams and collaborate visually
              </p>
              <Button onClick={handleNewWhiteboard}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Whiteboard
              </Button>
            </div>
          </div>
        );
      case "goals":
        return <GoalsView />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <WorkspaceSidebar />
      <SidebarInset>{renderContent()}</SidebarInset>
    </div>
  );
}

// Main export component with all required providers
export function WorkspaceDashboard() {
  return (
    <WorkspaceProvider>
      <SidebarProvider defaultOpen={true}>
        <WorkspaceDashboardContent />
      </SidebarProvider>
    </WorkspaceProvider>
  );
}