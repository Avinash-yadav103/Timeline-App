"use client"

import * as React from "react"
import { 
  Pointer, 
  Pencil, 
  Square, 
  Circle, 
  Type, 
  Eraser, 
  Image, 
  Hand, 
  Minus, 
  Undo2, 
  Redo2, 
  Trash2, 
  Copy,
  Download,
  Save
} from "lucide-react"
import { useWhiteboard } from "@/hooks/use-whiteboard"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { ColorPalette } from "./color-palette"

export function WhiteboardToolbar() {
  const { 
    currentTool, 
    setCurrentTool,
    currentColor,
    setCurrentColor,
    strokeWidth,
    setStrokeWidth,
    selectedElementIds,
    deleteElements,
    duplicateElements,
    zoom,
    setZoom,
    undo,
    redo,
    history
  } = useWhiteboard()
  
  const tools = [
    { id: "select", icon: <Pointer size={16} />, label: "Selection Tool" },
    { id: "pen", icon: <Pencil size={16} />, label: "Pen Tool" },
    { id: "line", icon: <Minus size={16} />, label: "Line Tool" },
    { id: "rectangle", icon: <Square size={16} />, label: "Rectangle Tool" },
    { id: "ellipse", icon: <Circle size={16} />, label: "Ellipse Tool" },
    { id: "text", icon: <Type size={16} />, label: "Text Tool" },
    { id: "eraser", icon: <Eraser size={16} />, label: "Eraser Tool" },
    { id: "image", icon: <Image size={16} />, label: "Image Tool" },
    { id: "hand", icon: <Hand size={16} />, label: "Hand Tool (Pan)" }
  ] as const
  
  const downloadWhiteboard = () => {
    // Implementation for downloading whiteboard as image would go here
    alert("Download functionality would be implemented here")
  }
  
  const saveWhiteboard = () => {
    // Implementation for saving whiteboard would go here
    alert("Save functionality would be implemented here")
  }
  
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-col p-2 border-r border-border h-full bg-background">
        {/* Drawing Tools */}
        <div className="flex flex-col gap-1">
          {tools.map(tool => (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={currentTool === tool.id ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setCurrentTool(tool.id)}
                  className="w-10 h-10"
                >
                  {tool.icon}
                  <span className="sr-only">{tool.label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{tool.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
        
        <Separator className="my-2" />
        
        {/* Color Palette */}
        <ColorPalette 
          selectedColor={currentColor} 
          onSelectColor={setCurrentColor} 
        />
        
        <Separator className="my-2" />
        
        {/* Stroke Width */}
        <div className="px-2 py-1">
          <p className="text-xs text-muted-foreground mb-1">Stroke Width</p>
          <Slider
            value={[strokeWidth]}
            min={1}
            max={20}
            step={1}
            onValueChange={(value) => setStrokeWidth(value[0])}
            className="w-full"
          />
        </div>
        
        <Separator className="my-2" />
        
        {/* Action buttons */}
        <div className="flex flex-col gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => undo()}
                disabled={history.past.length === 0}
                className="w-10 h-10"
              >
                <Undo2 size={16} />
                <span className="sr-only">Undo</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Undo</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => redo()}
                disabled={history.future.length === 0}
                className="w-10 h-10"
              >
                <Redo2 size={16} />
                <span className="sr-only">Redo</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Redo</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        <Separator className="my-2" />
        
        {/* Element operations */}
        <div className="flex flex-col gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => duplicateElements(selectedElementIds)}
                disabled={selectedElementIds.length === 0}
                className="w-10 h-10"
              >
                <Copy size={16} />
                <span className="sr-only">Duplicate</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Duplicate</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteElements(selectedElementIds)}
                disabled={selectedElementIds.length === 0}
                className="w-10 h-10"
              >
                <Trash2 size={16} />
                <span className="sr-only">Delete</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        {/* Spacer to push save/download to bottom */}
        <div className="flex-1" />
        
        <Separator className="my-2" />
        
        {/* Zoom controls */}
        <div className="px-2 py-1">
          <p className="text-xs text-muted-foreground mb-1">Zoom: {Math.round(zoom * 100)}%</p>
          <Slider
            value={[zoom * 100]}
            min={25}
            max={200}
            step={5}
            onValueChange={(value) => setZoom(value[0] / 100)}
            className="w-full"
          />
        </div>
        
        <Separator className="my-2" />
        
        {/* Save & Export */}
        <div className="flex flex-col gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={saveWhiteboard}
                className="w-10 h-10"
              >
                <Save size={16} />
                <span className="sr-only">Save</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Save Whiteboard</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={downloadWhiteboard}
                className="w-10 h-10"
              >
                <Download size={16} />
                <span className="sr-only">Download</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Download as Image</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}