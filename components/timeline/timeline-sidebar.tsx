"use client";

import * as React from "react";
import { useState } from "react";
import { useTimelineStore } from "@/store/timeline-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TimelineSidebarProps {
  workspaceId: string;
}

export function TimelineSidebar({ workspaceId }: TimelineSidebarProps) {
  const { 
    projects, 
    createProject, 
    setCurrentProject, 
    currentProject, 
    currentWorkspaceId 
  } = useTimelineStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    name: "",
    description: ""
  });
  
  // Filter projects for current workspace
  const workspaceProjects = projects.filter(
    project => project.workspaceId === workspaceId
  );
  
  const filteredProjects = workspaceProjects.filter(project => 
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (project.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCreateProject = () => {
    if (newProjectData.name.trim()) {
      createProject(newProjectData.name, newProjectData.description);
      setNewProjectData({ name: "", description: "" });
      setIsDialogOpen(false);
    }
  };
  
  return (
    <div className="w-64 border-r p-4 flex flex-col h-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Projects</h2>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      <Button 
        className="mb-4 flex items-center justify-center gap-2" 
        onClick={() => setIsDialogOpen(true)}
      >
        <PlusCircle className="h-4 w-4" />
        New Project
      </Button>
      
      <div className="overflow-auto flex-1">
        {filteredProjects.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No projects found.
          </p>
        ) : (
          <div className="space-y-1">
            {filteredProjects.map(project => (
              <Button
                key={project.id}
                variant={currentProject?.id === project.id ? "secondary" : "ghost"}
                className="w-full justify-start text-left"
                onClick={() => setCurrentProject(project.id)}
              >
                {project.name}
              </Button>
            ))}
          </div>
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new project</DialogTitle>
            <DialogDescription>
              Add a new project to your timeline workspace.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="project-name">Name</Label>
              <Input
                id="project-name"
                value={newProjectData.name}
                onChange={(e) => setNewProjectData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Project name"
              />
            </div>
            <div>
              <Label htmlFor="project-description">Description (optional)</Label>
              <Textarea
                id="project-description"
                value={newProjectData.description}
                onChange={(e) => setNewProjectData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Project description"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateProject}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}