export type Point = {
  x: number;
  y: number;
};

export type DrawingStyle = {
  strokeColor: string;
  strokeWidth: number;
  fillColor?: string;
  opacity: number;
};

export type DrawingElement = {
  id: string;
  type: "path" | "line" | "rectangle" | "ellipse" | "text" | "image";
  points: Point[];
  style: DrawingStyle;
  text?: string;
  imageData?: string;
};

export type WhiteboardData = {
  id: string;
  name: string;
  elements: DrawingElement[];
  createdAt: Date;
  updatedAt: Date;
  thumbnail?: string;
  collaborators?: string[];
  owner: string;
};

export type Tool = 
  | "select"
  | "pen"
  | "line"
  | "rectangle" 
  | "ellipse"
  | "text"
  | "eraser"
  | "image";

export type ToolOption = {
  id: Tool;
  name: string;
  icon: string;
};

export type WhiteboardAction = 
  | { type: 'add-element'; element: DrawingElement }
  | { type: 'update-element'; id: string; updates: Partial<DrawingElement> }
  | { type: 'delete-element'; id: string }
  | { type: 'clear-canvas' }
  | { type: 'set-elements'; elements: DrawingElement[] };