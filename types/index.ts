export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: Date | number;
  endTime: Date | number;
  category: string;
  location?: string;
  isRecurring: boolean;
  recurrencePattern?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: Date;
  category: string;
  eventId: string;
}

// New workspace types
export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  tasks: string[]; // task IDs
  color: string;
  members: string[];
}

export interface TimelineItem {
  id: string;
  projectId: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  category: string;
  color: string;
  status: "not-started" | "in-progress" | "completed";
  dependencies?: string[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  created: Date;
  updated: Date;
  tags: string[];
}

export type Point = {
  x: number;
  y: number;
};

export type WhiteboardElementType = 
  | "pen" 
  | "line" 
  | "rectangle" 
  | "ellipse" 
  | "text" 
  | "image";

export interface WhiteboardElement {
  id: string;
  type: WhiteboardElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  points?: Point[]; // For pen and line
  content?: string; // For text
  style: {
    strokeColor: string;
    fillColor: string;
    strokeWidth: number;
    opacity: number;
    fontSize?: number;
    fontFamily?: string;
  };
  rotation?: number;
  layer: number;
}

export interface Whiteboard {
  id: string;
  name: string;
  description?: string;
  elements: WhiteboardElement[];
  thumbnail?: string;
  created: Date;
  updated: Date;
  createdBy?: string;
  tags: string[];
  width: number;
  height: number;
  backgroundColor: string;
}

export type WhiteboardTool = 
  | "select" 
  | "pen" 
  | "line" 
  | "rectangle" 
  | "ellipse" 
  | "text" 
  | "eraser" 
  | "hand" // For panning
  | "image";

