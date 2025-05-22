import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ToolbarItemProps {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  tooltip?: string;
  disabled?: boolean;
}

export function ToolbarItem({
  children,
  selected,
  onClick,
  tooltip,
  disabled
}: ToolbarItemProps) {
  const button = (
    <Button
      variant={selected ? "default" : "outline"}
      size="icon"
      className={cn("size-8", selected && "bg-primary text-primary-foreground")}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
  
  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {button}
        </TooltipTrigger>
        <TooltipContent side="right">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    );
  }
  
  return button;
}