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

export interface Whiteboard {
  id: string;
  name: string;
  elements: WhiteboardElement[];
  created: Date;
  updated: Date;
}

export interface WhiteboardElement {
  id: string;
  type: "shape" | "text" | "image" | "line";
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  style?: Record<string, string>;
}

