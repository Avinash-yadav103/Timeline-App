"use client";

import React from 'react';
import { useWorkspace } from "@/context/workspace-context";
import { Timeline } from "./timeline";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function TimelineWorkspaceWrapper() {
  // This will throw the error if not within a WorkspaceProvider
  const { currentWorkspace, loading } = useWorkspace();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" />
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

  return <Timeline workspaceId={currentWorkspace.id} />;
}