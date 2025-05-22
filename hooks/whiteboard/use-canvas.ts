"use client";

import { useRef, useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Point, Tool, DrawingStyle, DrawingElement } from '@/types/whiteboard-types';

interface UseCanvasProps {
  onAddElement?: (element: DrawingElement) => void;
}

export function useCanvas({ onAddElement }: UseCanvasProps = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<Tool>('pen');
  const [currentStyle, setCurrentStyle] = useState<DrawingStyle>({
    strokeColor: '#000000',
    strokeWidth: 2,
    opacity: 1
  });
  const [points, setPoints] = useState<Point[]>([]);
  
  // Clear the canvas and redraw all elements
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);
  
  // Handle mouse down events
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPoints([{ x, y }]);
  }, []);
  
  // Handle mouse move events
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setPoints(prev => [...prev, { x, y }]);
    
    // Draw current stroke
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.strokeStyle = currentStyle.strokeColor;
    ctx.lineWidth = currentStyle.strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = currentStyle.opacity;
    
    if (currentTool === 'pen') {
      const lastPoint = points[points.length - 1];
      if (!lastPoint) return;
      
      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (currentTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, currentStyle.strokeWidth * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
  }, [isDrawing, points, currentTool, currentStyle]);
  
  // Handle mouse up events
  const handleMouseUp = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    if (points.length < 2) return;
    
    // Create new element
    const newElement: DrawingElement = {
      id: uuidv4(),
      type: currentTool === 'eraser' ? 'path' : currentTool as any,
      points: [...points],
      style: { ...currentStyle },
    };
    
    if (onAddElement) {
      onAddElement(newElement);
    }
    
    setPoints([]);
  }, [isDrawing, points, currentTool, currentStyle, onAddElement]);
  
  // Handle mouse leave events
  const handleMouseLeave = useCallback(() => {
    if (isDrawing) {
      handleMouseUp();
    }
  }, [isDrawing, handleMouseUp]);
  
  return {
    canvasRef,
    currentTool,
    currentStyle,
    isDrawing,
    setCurrentTool,
    setCurrentStyle,
    clearCanvas,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  };
}