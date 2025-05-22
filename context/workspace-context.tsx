"use client"

import * as React from "react"
import { v4 as uuidv4 } from "uuid"
import type { Project, TimelineItem, Note, Whiteboard } from "@/types"

interface WorkspaceContextType {
  projects: Project[]
  tasks: TimelineItem[]
  notes: Note[]
  whiteboards: Whiteboard[]
  currentProject: string | null
  currentView: "timeline" | "calendar" | "notes" | "whiteboard"
  getProject: (id: string) => Project | undefined
  getProjectTasks: (projectId: string) => TimelineItem[]
  addProject: (project: Omit<Project, "id">) => void
  updateProject: (project: Project) => void
  deleteProject: (id: string) => void
  addTask: (task: Omit<TimelineItem, "id">) => void
  updateTask: (task: TimelineItem) => void
  deleteTask: (id: string) => void
  setCurrentProject: (id: string | null) => void
  setCurrentView: (view: "timeline" | "calendar" | "notes" | "whiteboard") => void
}

const WorkspaceContext = React.createContext<WorkspaceContextType | undefined>(undefined)

// Sample project data based on the image
const sampleProjects: Project[] = [
  {
    id: "1",
    name: "Project Plan Timeline",
    description: "Main implementation project with multiple phases",
    startDate: new Date("2014-07-01"),
    endDate: new Date("2014-10-30"),
    tasks: [],
    color: "#4CAF50",
    members: ["user1", "user2"]
  }
]

// Sample tasks data based on the image
const sampleTasks: TimelineItem[] = [
  // First row - red items (Database)
  {
    id: "task1",
    projectId: "1",
    title: "Create Database",
    description: "Initial database setup",
    startDate: new Date("2014-07-17"),
    endDate: new Date("2014-07-17"),
    category: "Database",
    color: "#F44336",
    status: "completed"
  },
  {
    id: "task2",
    projectId: "1",
    title: "Modify Data Tables",
    description: "Update existing database structure",
    startDate: new Date("2014-07-18"),
    endDate: new Date("2014-07-20"),
    category: "Database",
    color: "#F44336",
    status: "completed"
  },
  
  // Second row - orange items (Import)
  {
    id: "task3",
    projectId: "1",
    title: "Import Test Data",
    description: "Load test data for development",
    startDate: new Date("2014-07-18"),
    endDate: new Date("2014-07-25"),
    category: "Import",
    color: "#FF9800",
    status: "completed"
  },
  {
    id: "task4",
    projectId: "1",
    title: "Data Import - Batch Processing",
    description: "Set up batch import processes",
    startDate: new Date("2014-07-23"),
    endDate: new Date("2014-08-08"),
    category: "Import",
    color: "#FF9800",
    status: "completed"
  },
  
  // Add other items from the image
  {
    id: "task5",
    projectId: "1",
    title: "Review and Finalize Design",
    description: "Final design review",
    startDate: new Date("2014-07-12"),
    endDate: new Date("2014-08-07"),
    category: "User Requirements",
    color: "#8BC34A",
    status: "completed"
  },
  
  {
    id: "task6",
    projectId: "1",
    title: "Role Management - DB Implementation",
    description: "Set up role-based security",
    startDate: new Date("2014-08-14"),
    endDate: new Date("2014-08-14"),
    category: "Role Management",
    color: "#607D8B",
    status: "completed"
  },
  
  {
    id: "task7",
    projectId: "1",
    title: "Role Management - Batch Processing",
    description: "Process role assignments in batch",
    startDate: new Date("2014-08-14"),
    endDate: new Date("2014-08-15"),
    category: "Role Management",
    color: "#607D8B",
    status: "completed"
  },
  
  {
    id: "task8",
    projectId: "1",
    title: "Data Import - Form Prototype",
    description: "Design import form UI",
    startDate: new Date("2014-08-10"),
    endDate: new Date("2014-08-13"),
    category: "Data Import",
    color: "#FF9800",
    status: "completed"
  },
  
  // Continue adding tasks from the image...
  {
    id: "task9",
    projectId: "1",
    title: "Data Import - Form Design",
    description: "Design UI for data import forms",
    startDate: new Date("2014-08-09"),
    endDate: new Date("2014-08-10"),
    category: "Data Import",
    color: "#FF9800",
    status: "completed"
  },
  
  {
    id: "task10",
    projectId: "1",
    title: "Role Management - Form Prototype",
    description: "Prototype form for role management",
    startDate: new Date("2014-08-16"),
    endDate: new Date("2014-08-17"),
    category: "Role Management",
    color: "#607D8B",
    status: "completed"
  },
  
  // Continue adding more tasks from the image...
]

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = React.useState<Project[]>(sampleProjects)
  const [tasks, setTasks] = React.useState<TimelineItem[]>(sampleTasks)
  const [notes, setNotes] = React.useState<Note[]>([])
  const [whiteboards, setWhiteboards] = React.useState<Whiteboard[]>([])
  const [currentProject, setCurrentProject] = React.useState<string | null>("1")
  const [currentView, setCurrentView] = React.useState<"timeline" | "calendar" | "notes" | "whiteboard">("timeline")
  
  const getProject = (id: string) => {
    return projects.find(project => project.id === id)
  }
  
  const getProjectTasks = (projectId: string) => {
    return tasks.filter(task => task.projectId === projectId)
  }
  
  const addProject = (project: Omit<Project, "id">) => {
    const newProject = {
      ...project,
      id: uuidv4()
    }
    setProjects(prev => [...prev, newProject])
  }
  
  const updateProject = (updatedProject: Project) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === updatedProject.id ? updatedProject : project
      )
    )
  }
  
  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id))
    // Also delete associated tasks
    setTasks(prev => prev.filter(task => task.projectId !== id))
  }
  
  const addTask = (task: Omit<TimelineItem, "id">) => {
    const newTask = {
      ...task,
      id: uuidv4()
    }
    setTasks(prev => [...prev, newTask])
  }
  
  const updateTask = (updatedTask: TimelineItem) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    )
  }
  
  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }
  
  return (
    <WorkspaceContext.Provider
      value={{
        projects,
        tasks,
        notes,
        whiteboards,
        currentProject,
        currentView,
        getProject,
        getProjectTasks,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        setCurrentProject,
        setCurrentView
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const context = React.useContext(WorkspaceContext)
  
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider")
  }
  
  return context
}