"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ColorPaletteProps {
  selectedColor: string
  onSelectColor: (color: string) => void
}

export function ColorPalette({ selectedColor, onSelectColor }: ColorPaletteProps) {
  // Common colors
  const colors = [
    { value: "#000000", label: "Black" },
    { value: "#FFFFFF", label: "White" },
    { value: "#FF0000", label: "Red" },
    { value: "#00FF00", label: "Green" },
    { value: "#0000FF", label: "Blue" },
    { value: "#FFFF00", label: "Yellow" },
    { value: "#FF00FF", label: "Magenta" },
    { value: "#00FFFF", label: "Cyan" },
    { value: "#FFA500", label: "Orange" },
    { value: "#800080", label: "Purple" },
    { value: "#A52A2A", label: "Brown" },
    { value: "#808080", label: "Gray" }
  ]
  
  // Custom color input ref
  const customColorRef = React.useRef<HTMLInputElement>(null)

  // Basic colors for quick access
  const quickColors = [
    "#000000", "#FF0000", "#0000FF", "#00FF00", "#FFFF00"
  ]
  
  return (
    <div className="flex flex-col items-center gap-1 px-1">
      <p className="text-xs text-muted-foreground w-full mb-1">Color</p>
      
      {/* Color preview */}
      <div 
        className="w-8 h-8 rounded border border-border mb-1"
        style={{ backgroundColor: selectedColor }}
      />
      
      {/* Quick color buttons */}
      <div className="flex flex-wrap justify-center gap-1">
        {quickColors.map(color => (
          <button
            key={color}
            className={cn(
              "w-4 h-4 rounded-full border",
              selectedColor === color && "ring-2 ring-primary"
            )}
            style={{ backgroundColor: color }}
            onClick={() => onSelectColor(color)}
          />
        ))}
      </div>
      
      {/* More colors dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full h-7 text-xs mt-1"
          >
            More Colors
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <div className="p-2 grid grid-cols-4 gap-1">
            {colors.map(color => (
              <button
                key={color.value}
                className={cn(
                  "w-8 h-8 rounded relative",
                  color.value === "#FFFFFF" && "border border-border"
                )}
                style={{ backgroundColor: color.value }}
                onClick={() => onSelectColor(color.value)}
                title={color.label}
              >
                {selectedColor === color.value && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Check 
                      size={16} 
                      className={color.value === "#FFFFFF" ? "text-black" : "text-white"} 
                    />
                  </span>
                )}
              </button>
            ))}
          </div>
          
          <div className="p-2 border-t">
            <p className="text-xs mb-1">Custom Color</p>
            <div className="flex items-center gap-2">
              <input
                ref={customColorRef}
                type="color"
                value={selectedColor}
                onChange={(e) => onSelectColor(e.target.value)}
                className="w-8 h-8 cursor-pointer"
              />
              <input
                type="text"
                value={selectedColor.toUpperCase()}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^#([0-9A-F]{3}){1,2}$/i.test(value)) {
                    onSelectColor(value);
                    if (customColorRef.current) {
                      customColorRef.current.value = value;
                    }
                  }
                }}
                className="flex-1 h-8 px-2 border rounded bg-transparent"
              />
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}