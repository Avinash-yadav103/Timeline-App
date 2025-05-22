import React from "react";
import { Slider } from "@/components/ui/slider";

interface StrokeWidthSelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function StrokeWidthSelector({
  value,
  onChange,
  min = 1,
  max = 20,
  step = 1
}: StrokeWidthSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Slider
          value={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={([val]) => onChange(val)}
          className="w-32"
        />
        <div className="text-xs ml-2 min-w-8 text-center">
          {value}px
        </div>
      </div>
      {/* Preview */}
      <div className="h-6 rounded border border-border overflow-hidden flex items-center justify-center">
        <div 
          className="rounded-full bg-black"
          style={{
            width: `${Math.min(value * 3, 100)}%`,
            height: `${Math.min(value * 3, 100)}%`,
            maxHeight: 20,
            maxWidth: 100
          }}
        />
      </div>
    </div>
  );
}