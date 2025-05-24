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
  const [drawnElements, setDrawnElements] = useState<DrawingElement[]>([]);
  
  // Clear the canvas and redraw all elements
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);
  
  // Render a single element on the canvas
  const drawElement = useCallback((ctx: CanvasRenderingContext2D, element: DrawingElement) => {
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
  }, []);
  
  // Render all elements on the canvas
  const renderElements = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    clearCanvas();
    
    // Draw all saved elements
    drawnElements.forEach(element => {
      drawElement(ctx, element);
    });
    
    // Draw current element being created
    if (isDrawing && points.length > 0) {
      const tempElement: DrawingElement = {
        id: 'temp',
        type: currentTool as any,
        points: [...points],
        style: { ...currentStyle }
      };
      drawElement(ctx, tempElement);
    }
  }, [clearCanvas, drawnElements, drawElement, isDrawing, points, currentTool, currentStyle]);
  
  // Re-render canvas whenever elements change
  useEffect(() => {
    renderElements();
  }, [renderElements, drawnElements, isDrawing, points]);
  
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
  }, [isDrawing]);
  
  // Handle mouse up events
  const handleMouseUp = useCallback(() => {
    if (!isDrawing || points.length < 2) {
      setIsDrawing(false);
      setPoints([]);
      return;
    }
    
    // Create new element with a unique ID
    const newElement: DrawingElement = {
      id: uuidv4(),
      type: currentTool as any,
      points: [...points],
      style: { ...currentStyle },
    };
    
    // Update local state
    setDrawnElements(prev => [...prev, newElement]);
    
    // Notify parent component
    if (onAddElement) {
      onAddElement(newElement);
    }
    
    setIsDrawing(false);
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
    drawnElements,
    setDrawnElements,
    setCurrentTool,
    setCurrentStyle,
    clearCanvas,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    renderElements
  };
}