"use client";

import React from 'react';
import { useWorkspace } from "@/context/workspace-context";
import { Timeline } from "../timeline/timeline";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useTimelineStore } from "@/store/timeline-store";

export function TimelineView() {
  const { currentWorkspace, loading } = useWorkspace();
  const { createProject, projects, setCurrentProject } = useTimelineStore();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-lg font-medium mb-2">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center h-full flex-col">
        <h2 className="text-xl font-medium mb-2">No Workspace Selected</h2>
        <p className="text-muted-foreground">Please select a workspace to view timelines</p>
      </div>
    );
  }
  
  const handleCreateProject = () => {
    if (currentWorkspace) {
      const newProject = createProject("New Project");
      setCurrentProject(newProject.id);
    }
  };
  
  // Find projects for current workspace
  const workspaceProjects = projects.filter(
    project => project.workspaceId === currentWorkspace.id
  );
  
  if (workspaceProjects.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">No Timeline Projects</h2>
          <p className="text-muted-foreground mb-4">Create your first project to start planning</p>
          <Button onClick={handleCreateProject}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        </div>
      </div>
    );
  }

  return <Timeline workspaceId={currentWorkspace.id} />;
}