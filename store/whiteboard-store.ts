"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { DrawingElement, WhiteboardData } from "@/types/whiteboard-types";

interface WhiteboardStore {
  whiteboards: WhiteboardData[];
  currentWhiteboard: WhiteboardData | null;
  history: Array<DrawingElement[]>;
  historyIndex: number;
  
  // Whiteboard management
  createWhiteboard: (name: string) => WhiteboardData;
  getWhiteboard: (id: string) => WhiteboardData | undefined;
  updateWhiteboard: (id: string, updates: Partial<WhiteboardData>) => void;
  deleteWhiteboard: (id: string) => void;
  setCurrentWhiteboard: (id: string | null) => void;
  
  // Canvas operations
  addElement: (element: DrawingElement) => void;
  updateElement: (id: string, updates: Partial<DrawingElement>) => void;
  deleteElement: (id: string) => void;
  clearCanvas: () => void;
  
  // History management
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
}

export const useWhiteboardStore = create<WhiteboardStore>()(
  persist(
    (set, get) => ({
      whiteboards: [],
      currentWhiteboard: null,
      history: [],
      historyIndex: -1,
      
      createWhiteboard: (name) => {
        const newWhiteboard: WhiteboardData = {
          id: uuidv4(),
          name,
          elements: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          owner: "current-user", // In a real app, this would come from auth
        };
        
        set((state) => ({
          whiteboards: [...state.whiteboards, newWhiteboard],
          currentWhiteboard: newWhiteboard,
          history: [[]],
          historyIndex: 0,
        }));
        
        return newWhiteboard;
      },
      
      getWhiteboard: (id) => {
        return get().whiteboards.find(wb => wb.id === id);
      },
      
      updateWhiteboard: (id, updates) => {
        set((state) => ({
          whiteboards: state.whiteboards.map(wb => 
            wb.id === id ? { ...wb, ...updates, updatedAt: new Date() } : wb
          ),
          currentWhiteboard: state.currentWhiteboard?.id === id 
            ? { ...state.currentWhiteboard, ...updates, updatedAt: new Date() } 
            : state.currentWhiteboard
        }));
      },
      
      deleteWhiteboard: (id) => {
        set((state) => ({
          whiteboards: state.whiteboards.filter(wb => wb.id !== id),
          currentWhiteboard: state.currentWhiteboard?.id === id ? null : state.currentWhiteboard,
        }));
      },
      
      setCurrentWhiteboard: (id) => {
        if (id === null) {
          set({ currentWhiteboard: null, history: [], historyIndex: -1 });
          return;
        }
        
        const whiteboard = get().whiteboards.find(wb => wb.id === id);
        if (whiteboard) {
          set({ 
            currentWhiteboard: whiteboard,
            history: [whiteboard.elements || []],
            historyIndex: 0
          });
        }
      },
      
      addElement: (element) => {
        const { currentWhiteboard } = get();
        if (!currentWhiteboard) return;
        
        // Create a new array with the existing elements and the new one
        const newElements = [...(currentWhiteboard.elements || []), element];
        
        set((state) => {
          // Update the whiteboard with the new elements
          const updatedWhiteboard = {
            ...state.currentWhiteboard!,
            elements: newElements,
            updatedAt: new Date()
          };
          
          return {
            currentWhiteboard: updatedWhiteboard,
            whiteboards: state.whiteboards.map(wb => 
              wb.id === updatedWhiteboard.id ? updatedWhiteboard : wb
            )
          };
        });
        
        // Save this state to history for undo/redo
        get().saveToHistory();
      },
      
      updateElement: (id, updates) => {
        const { currentWhiteboard } = get();
        if (!currentWhiteboard || !currentWhiteboard.elements) return;
        
        const newElements = currentWhiteboard.elements.map(el => 
          el.id === id ? { ...el, ...updates } : el
        );
        
        set((state) => {
          const updatedWhiteboard = {
            ...state.currentWhiteboard!,
            elements: newElements,
            updatedAt: new Date()
          };
          
          return {
            currentWhiteboard: updatedWhiteboard,
            whiteboards: state.whiteboards.map(wb => 
              wb.id === updatedWhiteboard.id ? updatedWhiteboard : wb
            )
          };
        });
        
        get().saveToHistory();
      },
      
      deleteElement: (id) => {
        const { currentWhiteboard } = get();
        if (!currentWhiteboard || !currentWhiteboard.elements) return;
        
        const newElements = currentWhiteboard.elements.filter(el => el.id !== id);
        
        set((state) => {
          const updatedWhiteboard = {
            ...state.currentWhiteboard!,
            elements: newElements,
            updatedAt: new Date()
          };
          
          return {
            currentWhiteboard: updatedWhiteboard,
            whiteboards: state.whiteboards.map(wb => 
              wb.id === updatedWhiteboard.id ? updatedWhiteboard : wb
            )
          };
        });
        
        get().saveToHistory();
      },
      
      clearCanvas: () => {
        const { currentWhiteboard } = get();
        if (!currentWhiteboard) return;
        
        set((state) => {
          const updatedWhiteboard = {
            ...state.currentWhiteboard!,
            elements: [],
            updatedAt: new Date()
          };
          
          return {
            currentWhiteboard: updatedWhiteboard,
            whiteboards: state.whiteboards.map(wb => 
              wb.id === updatedWhiteboard.id ? updatedWhiteboard : wb
            )
          };
        });
        
        get().saveToHistory();
      },
      
      saveToHistory: () => {
        const { currentWhiteboard, history, historyIndex } = get();
        if (!currentWhiteboard) return;
        
        // Remove any future history after the current index
        const newHistory = history.slice(0, historyIndex + 1);
        
        // Add current state to history
        newHistory.push([...(currentWhiteboard.elements || [])]);
        
        set({
          history: newHistory,
          historyIndex: newHistory.length - 1
        });
      },
      
      undo: () => {
        const { historyIndex, history, currentWhiteboard } = get();
        if (!currentWhiteboard || historyIndex <= 0) return;
        
        const newIndex = historyIndex - 1;
        const elements = history[newIndex] || [];
        
        set((state) => {
          const updatedWhiteboard = {
            ...state.currentWhiteboard!,
            elements: [...elements],
            updatedAt: new Date()
          };
          
          return {
            historyIndex: newIndex,
            currentWhiteboard: updatedWhiteboard,
            whiteboards: state.whiteboards.map(wb => 
              wb.id === updatedWhiteboard.id ? updatedWhiteboard : wb
            )
          };
        });
      },
      
      redo: () => {
        const { historyIndex, history, currentWhiteboard } = get();
        if (!currentWhiteboard || historyIndex >= history.length - 1) return;
        
        const newIndex = historyIndex + 1;
        const elements = history[newIndex] || [];
        
        set((state) => {
          const updatedWhiteboard = {
            ...state.currentWhiteboard!,
            elements: [...elements],
            updatedAt: new Date()
          };
          
          return {
            historyIndex: newIndex,
            currentWhiteboard: updatedWhiteboard,
            whiteboards: state.whiteboards.map(wb => 
              wb.id === updatedWhiteboard.id ? updatedWhiteboard : wb
            )
          };
        });
      },
    }),
    {
      name: 'whiteboard-storage',
      // Only persist the whiteboards array, not the current state
      partialize: (state) => ({ whiteboards: state.whiteboards }),
    }
  )
);