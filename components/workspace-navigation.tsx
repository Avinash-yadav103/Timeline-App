"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Kanban, 
  Calendar as CalendarIcon, 
  FileText, 
  LineChart, 
  Clock, 
  Layout, 
  Settings 
} from "lucide-react";
import { useWorkspace } from "@/context/workspace-context";

// Export the navigationItems that workspace-content.tsx is trying to import
export const navigationItems = [
  {
    id: "timeline",
    name: "Project Timeline",
    icon: <Clock className="h-4 w-4" />,
    view: "timeline"
  },
  {
    id: "calendar",
    name: "Calendar",
    icon: <Calendar className="h-4 w-4" />,
    view: "calendar"
  },
  {
    id: "notes",
    name: "Notes",
    icon: <FileText className="h-4 w-4" />,
    view: "notes"
  },
  {
    id: "whiteboard",
    name: "Whiteboard",
    icon: <Kanban className="h-4 w-4" />,
    view: "whiteboard"
  }
];

interface WorkspaceNavigationProps {
  className?: string;
}

export function WorkspaceNavigation({ className }: WorkspaceNavigationProps) {
  const pathname = usePathname();
  const { currentWorkspace } = useWorkspace();
  
  if (!currentWorkspace) return null;
  
  // Extract the current section from the path
  const getActiveSection = () => {
    if (!pathname.includes("/workspace/")) return "";
    
    const parts = pathname.split("/");
    const workspaceIdIndex = parts.findIndex(part => part === "workspace") + 2;
    if (workspaceIdIndex >= parts.length) return "";
    
    return parts[workspaceIdIndex] || "";
  };
  
  const activeSection = getActiveSection();
  
  return (
    <nav className={cn("flex border-b px-4", className)}>
      <ul className="flex items-center space-x-4">
        {navigationItems.map((item) => {
          const isActive = activeSection === item.id;
          const href = currentWorkspace 
            ? `/workspace/${currentWorkspace.id}/${item.id}` 
            : "#";
            
          return (
            <li key={item.name}>
              <Button
                asChild
                variant="ghost"
                className={cn(
                  "h-14 gap-2 px-4",
                  isActive && "border-b-2 border-primary font-medium"
                )}
              >
                <Link href={href}>
                  {item.icon}
                  {item.name}
                </Link>
              </Button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}