"use client";

import React from "react";
import { 
  Square, 
  Circle, 
  Pencil, 
  Type, 
  MousePointer, 
  Image as ImageIcon, 
  Eraser,
  Minus,
  Undo2,
  Redo2,
  Trash2,
  Download,
  Save,
  Hand
} from "lucide-react";
import { useWhiteboardStore } from "@/store/whiteboard-store";
import { ColorPalette } from "./color-palette";
import { StrokeWidthSelector } from "./stroke-width-selector";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ToolbarItem } from "./toolbar-item";
import type { Tool } from "@/types/whiteboard-types";
import { Separator } from "@/components/ui/separator";

interface WhiteboardToolbarProps {
  currentTool: Tool;
  setCurrentTool: (tool: Tool) => void;
  strokeColor: string;
  setStrokeColor: (color: string) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  onSave?: () => void;
  onExport?: () => void;
  className?: string;
}

export function WhiteboardToolbar({
  currentTool,
  setCurrentTool,
  strokeColor,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth,
  onSave,
  onExport,
  className
}: WhiteboardToolbarProps) {
  const { undo, redo, clearCanvas } = useWhiteboardStore();
  
  const tools = [
    { id: "select" as Tool, icon: <MousePointer size={16} />, label: "Select" },
    { id: "hand" as Tool, icon: <Hand size={16} />, label: "Hand Tool" },
    { id: "pen" as Tool, icon: <Pencil size={16} />, label: "Pen" },
    { id: "line" as Tool, icon: <Minus size={16} />, label: "Line" },
    { id: "rectangle" as Tool, icon: <Square size={16} />, label: "Rectangle" },
    { id: "ellipse" as Tool, icon: <Circle size={16} />, label: "Ellipse" },
    { id: "text" as Tool, icon: <Type size={16} />, label: "Text" },
    { id: "eraser" as Tool, icon: <Eraser size={16} />, label: "Eraser" },
    { id: "image" as Tool, icon: <ImageIcon size={16} />, label: "Image" },
  ];
  
  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 p-2 rounded-lg shadow-md bg-background border border-border">
      {/* Drawing tools */}
      <div className="grid grid-cols-1 gap-1">
        {tools.map((tool) => (
          <ToolbarItem
            key={tool.id}
            selected={currentTool === tool.id}
            onClick={() => setCurrentTool(tool.id)}
            tooltip={tool.label}
          >
            {tool.icon}
          </ToolbarItem>
        ))}
      </div>
      
      <Separator className="my-2" />
      
      {/* Color picker */}
      <div className="flex flex-col gap-1">
        <div className="text-xs text-muted-foreground">Color</div>
        <ColorPalette
          currentColor={strokeColor}
          onSelectColor={setStrokeColor}
        />
      </div>
      
      <Separator className="my-2" />
      
      {/* Stroke width */}
      <div className="flex flex-col gap-1">
        <div className="text-xs text-muted-foreground">Stroke Width</div>
        <StrokeWidthSelector
          value={strokeWidth}
          onChange={setStrokeWidth}
        />
      </div>
      
      <Separator className="my-2" />
      
      {/* Actions */}
      <div className="flex flex-col gap-1">
        <div className="text-xs text-muted-foreground">Actions</div>
        <div className="grid grid-cols-2 gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => undo()}
              >
                <Undo2 size={14} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Undo</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => redo()}
              >
                <Redo2 size={14} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Redo</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => clearCanvas()}
              >
                <Trash2 size={14} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Clear Canvas</TooltipContent>
          </Tooltip>
          
          {onSave && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={onSave}
                >
                  <Save size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Save</TooltipContent>
            </Tooltip>
          )}
          
          {onExport && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  onClick={onExport}
                >
                  <Download size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Export</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
}