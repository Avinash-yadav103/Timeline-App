"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useWhiteboardStore } from "@/store/whiteboard-store";
import { WhiteboardCanvas } from "./canvas/whiteboard-canvas";
import { WhiteboardToolbar } from "./toolbar/whiteboard-toolbar";
import { WhiteboardHeader } from "./ui/whiteboard-header";
import type { Tool, DrawingStyle } from "@/types/whiteboard-types";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WhiteboardTemplatesDialog } from "./ui/whiteboard-templates-dialog";

interface WhiteboardEditorProps {
  id?: string;
}

export function WhiteboardEditor({ id }: WhiteboardEditorProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { 
    createWhiteboard, 
    getWhiteboard, 
    updateWhiteboard,
    currentWhiteboard 
  } = useWhiteboardStore();
  
  const [currentTool, setCurrentTool] = useState<Tool>("pen");
  const [currentStyle, setCurrentStyle] = useState<DrawingStyle>({
    strokeColor: "#000000",
    strokeWidth: 2,
    opacity: 1
  });
  const [name, setName] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);
  
  // Initialize whiteboard
  useEffect(() => {
    if (id) {
      // Existing whiteboard
      const whiteboard = getWhiteboard(id);
      if (whiteboard) {
        setName(whiteboard.name);
      } else {
        // Whiteboard not found, redirect to create new
        router.push("/whiteboard/new");
      }
    } else {
      // New whiteboard - show templates dialog
      setShowTemplates(true);
    }
  }, [id, getWhiteboard, router]);
  
  const handleNameChange = useCallback((newName: string) => {
    setName(newName);
    if (currentWhiteboard) {
      updateWhiteboard(currentWhiteboard.id, { name: newName });
    }
  }, [currentWhiteboard, updateWhiteboard]);
  
  const handleSave = useCallback(() => {
    if (currentWhiteboard) {
      // In a real app, this might trigger a save to backend
      toast({
        title: "Whiteboard saved",
        description: `${currentWhiteboard.name} has been saved.`
      });
    }
  }, [currentWhiteboard, toast]);
  
  const handleExport = useCallback(() => {
    if (!currentWhiteboard) return;
    
    // Create a temporary canvas to render the whiteboard
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = 1920;
    canvas.height = 1080;
    
    // White background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Download the canvas as an image
    const link = document.createElement('a');
    link.download = `${currentWhiteboard.name.replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    toast({
      title: "Whiteboard exported",
      description: "Your whiteboard has been exported as a PNG file."
    });
  }, [currentWhiteboard, toast]);
  
  const handleCreateFromTemplate = useCallback((templateName: string) => {
    const newWhiteboard = createWhiteboard(templateName || "Untitled Whiteboard");
    router.replace(`/whiteboard/${newWhiteboard.id}`);
    setShowTemplates(false);
  }, [createWhiteboard, router]);
  
  const handleSkipTemplate = useCallback(() => {
    const newWhiteboard = createWhiteboard("Untitled Whiteboard");
    router.replace(`/whiteboard/${newWhiteboard.id}`);
    setShowTemplates(false);
  }, [createWhiteboard, router]);
  
  if (!currentWhiteboard && id) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading whiteboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex h-full w-full flex-col">
        <WhiteboardHeader 
          name={name} 
          onNameChange={handleNameChange} 
          onBack={() => router.push("/whiteboard")}
          onShare={() => toast({ title: "Share feature coming soon" })}
        />
        
        <div className="flex flex-1 overflow-hidden relative">
          <WhiteboardToolbar 
            currentTool={currentTool}
            setCurrentTool={setCurrentTool}
            strokeColor={currentStyle.strokeColor}
            setStrokeColor={(color) => setCurrentStyle(prev => ({ ...prev, strokeColor: color }))}
            strokeWidth={currentStyle.strokeWidth}
            setStrokeWidth={(width) => setCurrentStyle(prev => ({ ...prev, strokeWidth: width }))}
            onSave={handleSave}
            onExport={handleExport}
          />
          
          <div className="flex-1">
            {currentWhiteboard && (
              <WhiteboardCanvas whiteboardId={currentWhiteboard.id} />
            )}
          </div>
        </div>
        
        <WhiteboardTemplatesDialog 
          open={showTemplates}
          onOpenChange={setShowTemplates}
          onSelectTemplate={handleCreateFromTemplate}
          onSkip={handleSkipTemplate}
        />
        
        <Toaster />
      </div>
    </TooltipProvider>
  );
}