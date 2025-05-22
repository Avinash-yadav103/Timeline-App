"use client"

import * as React from "react"
import { v4 as uuidv4 } from "uuid"
import type { 
  Whiteboard, 
  WhiteboardElement, 
  WhiteboardTool, 
  Point 
} from "@/types"

type HistoryState = {
  past: WhiteboardElement[][];
  present: WhiteboardElement[];
  future: WhiteboardElement[][];
}

interface WhiteboardContextType {
  whiteboards: Whiteboard[];
  currentWhiteboard: Whiteboard | null;
  currentTool: WhiteboardTool;
  selectedElementIds: string[];
  isDrawing: boolean;
  currentColor: string;
  strokeWidth: number;
  history: HistoryState;
  zoom: number;
  
  // Whiteboard management
  createWhiteboard: (whiteboard: Omit<Whiteboard, "id" | "created" | "updated">) => Whiteboard;
  updateWhiteboard: (whiteboard: Whiteboard) => void;
  deleteWhiteboard: (id: string) => void;
  setCurrentWhiteboard: (id: string) => void;
  
  // Tool & state management
  setCurrentTool: (tool: WhiteboardTool) => void;
  setCurrentColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  setIsDrawing: (isDrawing: boolean) => void;
  setSelectedElementIds: (ids: string[]) => void;
  setZoom: (zoom: number) => void;
  
  // Element operations
  addElement: (element: Omit<WhiteboardElement, "id">) => void;
  updateElement: (element: WhiteboardElement) => void;
  deleteElements: (ids: string[]) => void;
  duplicateElements: (ids: string[]) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  
  // History operations
  undo: () => void;
  redo: () => void;
  saveCurrentState: () => void;
}

const initialHistoryState: HistoryState = {
  past: [],
  present: [],
  future: []
}

const WhiteboardContext = React.createContext<WhiteboardContextType | undefined>(undefined)

// Sample whiteboard for testing
const sampleWhiteboard: Whiteboard = {
  id: "1",
  name: "Project Brainstorm",
  description: "Ideas for our new project",
  elements: [],
  created: new Date(),
  updated: new Date(),
  tags: ["brainstorm", "project"],
  width: 1920,
  height: 1080,
  backgroundColor: "#ffffff"
}

export function WhiteboardProvider({ children }: { children: React.ReactNode }) {
  const [whiteboards, setWhiteboards] = React.useState<Whiteboard[]>([sampleWhiteboard]);
  const [currentWhiteboard, setCurrentWhiteboardState] = React.useState<Whiteboard | null>(null);
  const [currentTool, setCurrentTool] = React.useState<WhiteboardTool>("select");
  const [selectedElementIds, setSelectedElementIds] = React.useState<string[]>([]);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [currentColor, setCurrentColor] = React.useState("#000000");
  const [strokeWidth, setStrokeWidth] = React.useState(2);
  const [zoom, setZoom] = React.useState(1);
  const [history, setHistory] = React.useState<HistoryState>(initialHistoryState);

  // Initialize with the sample whiteboard
  React.useEffect(() => {
    if (whiteboards.length > 0 && !currentWhiteboard) {
      setCurrentWhiteboardState(whiteboards[0]);
      setHistory({
        past: [],
        present: whiteboards[0].elements,
        future: []
      });
    }
  }, [whiteboards, currentWhiteboard]);

  // Set current whiteboard
  const setCurrentWhiteboard = (id: string) => {
    const whiteboard = whiteboards.find(wb => wb.id === id);
    if (whiteboard) {
      setCurrentWhiteboardState(whiteboard);
      setHistory({
        past: [],
        present: whiteboard.elements,
        future: []
      });
      setSelectedElementIds([]);
    }
  };

  // Save current state to history
  const saveCurrentState = () => {
    if (!currentWhiteboard) return;
    
    setHistory(prev => ({
      past: [...prev.past, prev.present],
      present: currentWhiteboard.elements,
      future: []
    }));
  };

  // Undo
  const undo = () => {
    if (history.past.length === 0 || !currentWhiteboard) return;
    
    const newPresent = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, history.past.length - 1);
    
    setHistory({
      past: newPast,
      present: newPresent,
      future: [history.present, ...history.future]
    });
    
    setCurrentWhiteboardState({
      ...currentWhiteboard,
      elements: newPresent,
      updated: new Date()
    });
  };

  // Redo
  const redo = () => {
    if (history.future.length === 0 || !currentWhiteboard) return;
    
    const newPresent = history.future[0];
    const newFuture = history.future.slice(1);
    
    setHistory({
      past: [...history.past, history.present],
      present: newPresent,
      future: newFuture
    });
    
    setCurrentWhiteboardState({
      ...currentWhiteboard,
      elements: newPresent,
      updated: new Date()
    });
  };

  // Create a new whiteboard
  const createWhiteboard = (whiteboard: Omit<Whiteboard, "id" | "created" | "updated">) => {
    const newWhiteboard: Whiteboard = {
      ...whiteboard,
      id: uuidv4(),
      created: new Date(),
      updated: new Date()
    };
    
    setWhiteboards(prev => [...prev, newWhiteboard]);
    return newWhiteboard;
  };

  // Update a whiteboard
  const updateWhiteboard = (whiteboard: Whiteboard) => {
    setWhiteboards(prev => 
      prev.map(wb => 
        wb.id === whiteboard.id 
          ? { ...whiteboard, updated: new Date() } 
          : wb
      )
    );
    
    if (currentWhiteboard?.id === whiteboard.id) {
      setCurrentWhiteboardState({ ...whiteboard, updated: new Date() });
    }
  };

  // Delete a whiteboard
  const deleteWhiteboard = (id: string) => {
    setWhiteboards(prev => prev.filter(wb => wb.id !== id));
    
    if (currentWhiteboard?.id === id) {
      const remainingWhiteboards = whiteboards.filter(wb => wb.id !== id);
      setCurrentWhiteboardState(remainingWhiteboards.length > 0 ? remainingWhiteboards[0] : null);
    }
  };

  // Add an element to the current whiteboard
  const addElement = (element: Omit<WhiteboardElement, "id">) => {
    if (!currentWhiteboard) return;
    
    const newElement: WhiteboardElement = {
      ...element,
      id: uuidv4()
    };
    
    const updatedElements = [...currentWhiteboard.elements, newElement];
    
    setCurrentWhiteboardState({
      ...currentWhiteboard,
      elements: updatedElements,
      updated: new Date()
    });
    
    setWhiteboards(prev =>
      prev.map(wb =>
        wb.id === currentWhiteboard.id
          ? { ...wb, elements: updatedElements, updated: new Date() }
          : wb
      )
    );
    
    // Update history
    setHistory(prev => ({
      past: [...prev.past, prev.present],
      present: updatedElements,
      future: []
    }));
  };

  // Update an element in the current whiteboard
  const updateElement = (element: WhiteboardElement) => {
    if (!currentWhiteboard) return;
    
    const updatedElements = currentWhiteboard.elements.map(el =>
      el.id === element.id ? element : el
    );
    
    setCurrentWhiteboardState({
      ...currentWhiteboard,
      elements: updatedElements,
      updated: new Date()
    });
    
    setWhiteboards(prev =>
      prev.map(wb =>
        wb.id === currentWhiteboard.id
          ? { ...wb, elements: updatedElements, updated: new Date() }
          : wb
      )
    );
    
    // Update history (only if not drawing to avoid too many history states)
    if (!isDrawing) {
      setHistory(prev => ({
        past: [...prev.past, prev.present],
        present: updatedElements,
        future: []
      }));
    }
  };

  // Delete elements from the current whiteboard
  const deleteElements = (ids: string[]) => {
    if (!currentWhiteboard) return;
    
    const updatedElements = currentWhiteboard.elements.filter(
      el => !ids.includes(el.id)
    );
    
    setCurrentWhiteboardState({
      ...currentWhiteboard,
      elements: updatedElements,
      updated: new Date()
    });
    
    setWhiteboards(prev =>
      prev.map(wb =>
        wb.id === currentWhiteboard.id
          ? { ...wb, elements: updatedElements, updated: new Date() }
          : wb
      )
    );
    
    setSelectedElementIds([]);
    
    // Update history
    setHistory(prev => ({
      past: [...prev.past, prev.present],
      present: updatedElements,
      future: []
    }));
  };

  // Duplicate elements
  const duplicateElements = (ids: string[]) => {
    if (!currentWhiteboard) return;
    
    const elementsToDuplicate = currentWhiteboard.elements.filter(el => 
      ids.includes(el.id)
    );
    
    const duplicatedElements = elementsToDuplicate.map(el => ({
      ...el,
      id: uuidv4(),
      x: el.x + 20, // Offset slightly
      y: el.y + 20
    }));
    
    const updatedElements = [...currentWhiteboard.elements, ...duplicatedElements];
    
    setCurrentWhiteboardState({
      ...currentWhiteboard,
      elements: updatedElements,
      updated: new Date()
    });
    
    setWhiteboards(prev =>
      prev.map(wb =>
        wb.id === currentWhiteboard.id
          ? { ...wb, elements: updatedElements, updated: new Date() }
          : wb
      )
    );
    
    setSelectedElementIds(duplicatedElements.map(el => el.id));
    
    // Update history
    setHistory(prev => ({
      past: [...prev.past, prev.present],
      present: updatedElements,
      future: []
    }));
  };

  // Layer operations
  const bringForward = (id: string) => {
    if (!currentWhiteboard) return;
    
    const elements = [...currentWhiteboard.elements];
    const index = elements.findIndex(el => el.id === id);
    if (index === -1 || index === elements.length - 1) return;
    
    // Swap with next element
    [elements[index], elements[index + 1]] = [elements[index + 1], elements[index]];
    
    setCurrentWhiteboardState({
      ...currentWhiteboard,
      elements,
      updated: new Date()
    });
    
    setWhiteboards(prev =>
      prev.map(wb =>
        wb.id === currentWhiteboard.id
          ? { ...wb, elements, updated: new Date() }
          : wb
      )
    );
    
    // Update history
    setHistory(prev => ({
      past: [...prev.past, prev.present],
      present: elements,
      future: []
    }));
  };

  const sendBackward = (id: string) => {
    if (!currentWhiteboard) return;
    
    const elements = [...currentWhiteboard.elements];
    const index = elements.findIndex(el => el.id === id);
    if (index <= 0) return;
    
    // Swap with previous element
    [elements[index], elements[index - 1]] = [elements[index - 1], elements[index]];
    
    setCurrentWhiteboardState({
      ...currentWhiteboard,
      elements,
      updated: new Date()
    });
    
    setWhiteboards(prev =>
      prev.map(wb =>
        wb.id === currentWhiteboard.id
          ? { ...wb, elements, updated: new Date() }
          : wb
      )
    );
    
    // Update history
    setHistory(prev => ({
      past: [...prev.past, prev.present],
      present: elements,
      future: []
    }));
  };

  const bringToFront = (id: string) => {
    if (!currentWhiteboard) return;
    
    const elements = [...currentWhiteboard.elements];
    const index = elements.findIndex(el => el.id === id);
    if (index === -1 || index === elements.length - 1) return;
    
    // Move to end (top)
    const element = elements.splice(index, 1)[0];
    elements.push(element);
    
    setCurrentWhiteboardState({
      ...currentWhiteboard,
      elements,
      updated: new Date()
    });
    
    setWhiteboards(prev =>
      prev.map(wb =>
        wb.id === currentWhiteboard.id
          ? { ...wb, elements, updated: new Date() }
          : wb
      )
    );
    
    // Update history
    setHistory(prev => ({
      past: [...prev.past, prev.present],
      present: elements,
      future: []
    }));
  };

  const sendToBack = (id: string) => {
    if (!currentWhiteboard) return;
    
    const elements = [...currentWhiteboard.elements];
    const index = elements.findIndex(el => el.id === id);
    if (index <= 0) return;
    
    // Move to beginning (bottom)
    const element = elements.splice(index, 1)[0];
    elements.unshift(element);
    
    setCurrentWhiteboardState({
      ...currentWhiteboard,
      elements,
      updated: new Date()
    });
    
    setWhiteboards(prev =>
      prev.map(wb =>
        wb.id === currentWhiteboard.id
          ? { ...wb, elements, updated: new Date() }
          : wb
      )
    );
    
    // Update history
    setHistory(prev => ({
      past: [...prev.past, prev.present],
      present: elements,
      future: []
    }));
  };

  // Context value
  const contextValue: WhiteboardContextType = {
    whiteboards,
    currentWhiteboard,
    currentTool,
    selectedElementIds,
    isDrawing,
    currentColor,
    strokeWidth,
    history,
    zoom,
    
    // Functions
    createWhiteboard,
    updateWhiteboard,
    deleteWhiteboard,
    setCurrentWhiteboard,
    setCurrentTool,
    setCurrentColor,
    setStrokeWidth,
    setIsDrawing,
    setSelectedElementIds,
    setZoom,
    addElement,
    updateElement,
    deleteElements,
    duplicateElements,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    undo,
    redo,
    saveCurrentState
  };

  return (
    <WhiteboardContext.Provider value={contextValue}>
      {children}
    </WhiteboardContext.Provider>
  );
}

export function useWhiteboard() {
  const context = React.useContext(WhiteboardContext);
  
  if (context === undefined) {
    throw new Error("useWhiteboard must be used within a WhiteboardProvider");
  }
  
  return context;
}