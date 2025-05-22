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
    addElement
  } = useWhiteboardStore();
  
  const containerRef = useRef<HTMLDivElement>(null);
  
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
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  } = useCanvas({
    onAddElement: (element) => {
      addElement(element);
    }
  });
  
  // Resize handler
  useEffect(() => {
    const resizeCanvas = () => {
      if (containerRef.current && canvasRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        
        // Redraw elements after resize
        renderElements();
      }
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [canvasRef, currentWhiteboard]);
  
  // Render all elements on the canvas
  const renderElements = () => {
    if (!canvasRef.current || !currentWhiteboard) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    currentWhiteboard.elements.forEach(element => {
      drawElement(ctx, element);
    });
  };
  
  // Draw a single element
  const drawElement = (ctx: CanvasRenderingContext2D, element: DrawingElement) => {
    const { points, style, type } = element;
    if (points.length < 2) return;
    
    ctx.strokeStyle = style.strokeColor;
    ctx.lineWidth = style.strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = style.opacity;
    
    switch (type) {
      case 'path':
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
        break;
      
      case 'line':
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
        ctx.stroke();
        break;
      
      case 'rectangle':
        const [start, end] = [points[0], points[points.length - 1]];
        const width = end.x - start.x;
        const height = end.y - start.y;
        
        ctx.beginPath();
        ctx.rect(start.x, start.y, width, height);
        ctx.stroke();
        if (style.fillColor) {
          ctx.fillStyle = style.fillColor;
          ctx.fill();
        }
        break;
      
      case 'ellipse':
        const [center, radiusPoint] = [points[0], points[points.length - 1]];
        const radiusX = Math.abs(radiusPoint.x - center.x);
        const radiusY = Math.abs(radiusPoint.y - center.y);
        
        ctx.beginPath();
        ctx.ellipse(center.x, center.y, radiusX, radiusY, 0, 0, 2 * Math.PI);
        ctx.stroke();
        if (style.fillColor) {
          ctx.fillStyle = style.fillColor;
          ctx.fill();
        }
        break;
      
      case 'text':
        if (element.text) {
          ctx.font = `${style.strokeWidth * 5}px sans-serif`;
          ctx.fillStyle = style.strokeColor;
          ctx.fillText(element.text, points[0].x, points[0].y);
        }
        break;
    }
  };
  
  // Redraw whenever elements change
  useEffect(() => {
    renderElements();
  }, [currentWhiteboard?.elements]);
  
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