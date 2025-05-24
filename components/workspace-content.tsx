"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { navigationItems } from "./workspace-navigation";
import { useWorkspace } from "@/context/workspace-context";

export function WorkspaceContent() {
  const pathname = usePathname();
  const { currentWorkspace } = useWorkspace();
  
  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Select a workspace to get started</h2>
          <p className="text-muted-foreground mt-2">
            Choose a workspace from the sidebar or create a new one
          </p>
        </div>
      </div>
    );
  }
  
  // Extract the current section from the path
  const getActiveSection = () => {
    if (!pathname.includes("/workspace/")) return "";
    
    const parts = pathname.split("/");
    const workspaceIdIndex = parts.findIndex(part => part === "workspace") + 2;
    if (workspaceIdIndex >= parts.length) return "";
    
    return parts[workspaceIdIndex] || "";
  };
  
  const activeSection = getActiveSection();
  const activeItem = navigationItems.find(item => item.path === activeSection) || navigationItems[0];
  
  return (
    <div className="h-full overflow-auto">
      {activeItem.component}
    </div>
  );
}