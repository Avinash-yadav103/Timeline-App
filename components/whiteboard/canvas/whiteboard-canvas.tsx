"use client";

import React, { useEffect, useRef } from "react";
import { useWhiteboardStore } from "@/store/whiteboard-store";
import { useCanvas } from "@/hooks/whiteboard/use-canvas";
import type { DrawingElement } from "@/types/whiteboard-types";
import { cn } from "@/lib/utils";

interface WhiteboardCanvasProps {
  whiteboardId: string;
  className?: string;
}

export function WhiteboardCanvas({ whiteboardId, className }: WhiteboardCanvasProps) {
  const { 
    currentWhiteboard,
    setCurrentWhiteboard,
    addElement,
    updateWhiteboard
  } = useWhiteboardStore();
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Load whiteboard data on component mount
  useEffect(() => {
    if (whiteboardId) {
      setCurrentWhiteboard(whiteboardId);
    }
    
    return () => setCurrentWhiteboard(null);
  }, [whiteboardId, setCurrentWhiteboard]);
  
  const {
    canvasRef,
    currentTool,
    currentStyle,
    drawnElements,
    setDrawnElements,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  } = useCanvas({
    onAddElement: (element) => {
      addElement(element);
    }
  });
  
  // Sync store elements with local state
  useEffect(() => {
    if (currentWhiteboard && currentWhiteboard.elements) {
      setDrawnElements(currentWhiteboard.elements);
    }
  }, [currentWhiteboard, setDrawnElements]);
  
  // Resize handler
  useEffect(() => {
    const resizeCanvas = () => {
      if (containerRef.current && canvasRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initial sizing
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [canvasRef]);
  
  // Set cursor based on tool
  const getCursor = () => {
    switch (currentTool) {
      case 'pen': return 'crosshair';
      case 'eraser': return 'url("data:image/svg+xml,%3Csvg width=\'24\' height=\'24\' viewBox=\'0 0 24 24\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'12\' cy=\'12\' r=\'10\' stroke=\'black\' stroke-width=\'2\'/%3E%3Ccircle cx=\'12\' cy=\'12\' r=\'6\' fill=\'white\'/%3E%3C/svg%3E") 12 12, auto';
      case 'select': return 'pointer';
      case 'text': return 'text';
      default: return 'crosshair';
    }
  };

  return (
    <div 
      className={cn("relative h-full w-full overflow-hidden bg-white", className)} 
      ref={containerRef}
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 h-full w-full"
        style={{ cursor: getCursor() }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
}