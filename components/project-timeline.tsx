"use client";

import * as React from "react";
import { useEffect } from "react";
import { format, differenceInDays, isSameMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TimelineItem } from "@/components/timeline-item";
import { useWorkspace } from "@/hooks/use-workspace";
import { Timeline } from "@/components/timeline/timeline";
import { useTimelineStore } from "@/store/timeline-store";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface ProjectTimelineProps {
  projectId?: string;
}

export function ProjectTimeline({ projectId }: ProjectTimelineProps) {
  const { setCurrentProject, createProject, projects } = useTimelineStore();
  const { getProject, getProjectTasks } = useWorkspace();
  const project = getProject(projectId);
  const tasks = getProjectTasks(projectId);

  useEffect(() => {
    if (projectId) {
      setCurrentProject(projectId);
    } else if (projects.length > 0) {
      setCurrentProject(projects[0].id);
    }
  }, [projectId, projects, setCurrentProject]);

  const handleCreateProject = () => {
    const project = createProject("New Project");
    setCurrentProject(project.id);
  };

  // Date range calculation logic
  const [timelineStart, timelineEnd] = React.useMemo(() => {
    if (!tasks.length) return [new Date(), new Date()];

    const start = new Date(
      Math.min(...tasks.map((t) => new Date(t.startDate).getTime()))
    );
    const end = new Date(
      Math.max(...tasks.map((t) => new Date(t.endDate).getTime()))
    );
    return [start, end];
  }, [tasks]);

  // Month labels for timeline header
  const months = React.useMemo(() => {
    const result = [];
    let currentDate = new Date(timelineStart);

    while (currentDate <= timelineEnd) {
      if (
        result.length === 0 ||
        !isSameMonth(currentDate, result[result.length - 1].date)
      ) {
        result.push({
          date: new Date(currentDate),
          label: format(currentDate, "MMM yyyy"),
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return result;
  }, [timelineStart, timelineEnd]);

  // Group tasks by category
  const tasksByCategory = React.useMemo(() => {
    return tasks.reduce((acc, task) => {
      if (!acc[task.category]) {
        acc[task.category] = [];
      }
      acc[task.category].push(task);
      return acc;
    }, {} as Record<string, typeof tasks>);
  }, [tasks]);

  if (projects.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">No Projects</h2>
          <p className="text-muted-foreground mb-4">
            Create your first project to start planning
          </p>
          <Button onClick={handleCreateProject}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        </div>
      </div>
    );
  }

  if (!project) return <div>Project not found</div>;

  const totalDays = differenceInDays(timelineEnd, timelineStart) + 1;
  const dayWidth = 32; // pixels per day

  return (
    <div className="flex flex-col h-full w-full">
      <h2 className="text-2xl font-semibold p-4">Project Plan Timeline</h2>

      <ScrollArea className="h-full w-full" orientation="both">
        <div
          style={{ width: `${totalDays * dayWidth + 200}px`, minWidth: "100%" }}
          className="relative"
        >
          {/* Timeline header - months */}
          <div className="flex border-b border-border sticky top-0 bg-background z-10">
            <div className="w-[200px] flex-shrink-0 border-r border-border p-2">
              <span className="font-medium">Categories</span>
            </div>
            <div className="flex">
              {months.map((month, i) => {
                const daysInMonth = new Date(
                  month.date.getFullYear(),
                  month.date.getMonth() + 1,
                  0
                ).getDate();

                return (
                  <div
                    key={i}
                    className="border-r border-border p-2 font-medium"
                    style={{ width: `${daysInMonth * dayWidth}px` }}
                  >
                    {month.label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Timeline content */}
          <div className="flex">
            {/* Category column */}
            <div className="w-[200px] flex-shrink-0">
              {Object.keys(tasksByCategory).map((category, i) => (
                <div
                  key={category}
                  className={cn(
                    "h-20 p-2 border-b border-r border-border flex items-center",
                    i % 2 === 0 ? "bg-muted/30" : "bg-background"
                  )}
                >
                  <span className="font-medium">{category}</span>
                </div>
              ))}
            </div>

            {/* Timeline grid and items */}
            <div className="relative">
              {Object.entries(tasksByCategory).map(
                ([category, tasks], rowIndex) => (
                  <div
                    key={category}
                    className={cn(
                      "h-20 border-b border-border relative",
                      rowIndex % 2 === 0 ? "bg-muted/30" : "bg-background"
                    )}
                    style={{ width: `${totalDays * dayWidth}px` }}
                  >
                    {tasks.map((task) => (
                      <TimelineItem
                        key={task.id}
                        task={task}
                        timelineStart={timelineStart}
                        dayWidth={dayWidth}
                      />
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}