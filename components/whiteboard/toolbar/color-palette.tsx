import React from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ColorPaletteProps {
  currentColor: string;
  onSelectColor: (color: string) => void;
}

const predefinedColors = [
  "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
  "#FFFF00", "#FF00FF", "#00FFFF", "#FF9900", "#9900FF",
  "#999999", "#555555", "#8B4513", "#006400", "#4B0082"
];

export function ColorPalette({ currentColor, onSelectColor }: ColorPaletteProps) {
  return (
    <div className="grid grid-cols-5 gap-1">
      {predefinedColors.map((color) => (
        <Tooltip key={color}>
          <TooltipTrigger asChild>
            <button
              type="button"
              className={cn(
                "size-5 rounded-full border border-border flex items-center justify-center transition-transform hover:scale-110",
                currentColor === color && "ring-2 ring-primary ring-offset-1"
              )}
              style={{ backgroundColor: color }}
              onClick={() => onSelectColor(color)}
            >
              {color === "#FFFFFF" && (
                <span className="text-xs text-gray-400">/</span>
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {color}
          </TooltipContent>
        </Tooltip>
      ))}
      
      {/* Custom color picker */}
      <div className="col-span-5 mt-1">
        <input
          type="color"
          value={currentColor}
          onChange={(e) => onSelectColor(e.target.value)}
          className="w-full h-6 cursor-pointer"
        />
      </div>
    </div>
  );
}