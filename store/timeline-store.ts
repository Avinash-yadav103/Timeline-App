"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { TimelineProject, TimelineItem, TimelineView } from "@/types/timeline-types";

interface TimelineStore {
  projects: TimelineProject[];
  currentProject: TimelineProject | null;
  timelineView: TimelineView;
  
  // Project management
  createProject: (name: string, description?: string) => TimelineProject;
  getProject: (id: string) => TimelineProject | undefined;
  updateProject: (id: string, updates: Partial<TimelineProject>) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (id: string | null) => void;
  
  // Timeline item management
  addItem: (projectId: string, item: Omit<TimelineItem, "id">) => void;
  updateItem: (projectId: string, itemId: string, updates: Partial<TimelineItem>) => void;
  deleteItem: (projectId: string, itemId: string) => void;
  
  // View management
  setTimelineView: (view: TimelineView) => void;
}

export const useTimelineStore = create<TimelineStore>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProject: null,
      timelineView: "month",
      
      createProject: (name, description) => {
        // Get current workspace from URL
        let workspaceId = "";
        if (typeof window !== "undefined") {
          const path = window.location.pathname;
          const match = path.match(/\/workspace\/([^\/]+)/);
          workspaceId = match ? match[1] : "";
        }
        
        const newProject: TimelineProject = {
          id: uuidv4(),
          name,
          description,
          items: [],
          created: new Date(),
          updated: new Date(),
          owner: "current-user", // In a real app, this would come from auth
          workspaceId, // Add the workspace ID from the URL
        };
        
        set((state) => ({
          projects: [...state.projects, newProject],
          currentProject: newProject,
        }));
        
        return newProject;
      },
      
      getProject: (id) => {
        return get().projects.find(project => project.id === id);
      },
      
      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map(project => 
            project.id === id ? { ...project, ...updates, updated: new Date() } : project
          ),
          currentProject: state.currentProject?.id === id 
            ? { ...state.currentProject, ...updates, updated: new Date() } 
            : state.currentProject
        }));
      },
      
      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter(project => project.id !== id),
          currentProject: state.currentProject?.id === id ? null : state.currentProject,
        }));
      },
      
      setCurrentProject: (id) => {
        if (id === null) {
          set({ currentProject: null });
          return;
        }
        
        const project = get().projects.find(p => p.id === id);
        if (project) {
          set({ currentProject: project });
        }
      },
      
      addItem: (projectId, itemData) => {
        const project = get().projects.find(p => p.id === projectId);
        if (!project) return;
        
        const newItem: TimelineItem = {
          id: uuidv4(),
          ...itemData
        };
        
        set((state) => ({
          projects: state.projects.map(p => 
            p.id === projectId 
              ? { 
                  ...p, 
                  items: [...p.items, newItem], 
                  updated: new Date() 
                } 
              : p
          ),
          currentProject: state.currentProject?.id === projectId
            ? {
                ...state.currentProject,
                items: [...state.currentProject.items, newItem],
                updated: new Date()
              }
            : state.currentProject
        }));
      },
      
      updateItem: (projectId, itemId, updates) => {
        set((state) => ({
          projects: state.projects.map(p => 
            p.id === projectId 
              ? { 
                  ...p, 
                  items: p.items.map(item => 
                    item.id === itemId 
                      ? { ...item, ...updates } 
                      : item
                  ),
                  updated: new Date() 
                } 
              : p
          ),
          currentProject: state.currentProject?.id === projectId
            ? {
                ...state.currentProject,
                items: state.currentProject.items.map(item =>
                  item.id === itemId
                    ? { ...item, ...updates }
                    : item
                ),
                updated: new Date()
              }
            : state.currentProject
        }));
      },
      
      deleteItem: (projectId, itemId) => {
        set((state) => ({
          projects: state.projects.map(p => 
            p.id === projectId 
              ? { 
                  ...p, 
                  items: p.items.filter(item => item.id !== itemId),
                  updated: new Date() 
                } 
              : p
          ),
          currentProject: state.currentProject?.id === projectId
            ? {
                ...state.currentProject,
                items: state.currentProject.items.filter(item => item.id !== itemId),
                updated: new Date()
              }
            : state.currentProject
        }));
      },
      
      setTimelineView: (view) => {
        set({ timelineView: view });
      },
    }),
    {
      name: 'timeline-storage',
      partialize: (state) => ({ projects: state.projects }),
    }
  )
);