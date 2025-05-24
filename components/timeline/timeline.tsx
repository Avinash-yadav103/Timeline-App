"use client";

import * as React from "react";
import { useWorkspace } from "@/context/workspace-context";

interface TimelineProps {
  workspaceId: string;
}

export function Timeline({ workspaceId }: TimelineProps) {
  const { state } = useWorkspace();
  const { workspaces } = state;

  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Timeline View</h2>
        <p className="text-muted-foreground mb-4">
          Workspace ID: {workspaceId}
        </p>
        <p>Timeline implementation in progress...</p>
      </div>
    </div>
  );
}