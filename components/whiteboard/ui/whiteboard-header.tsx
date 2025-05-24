import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Share2 } from "lucide-react";

interface WhiteboardHeaderProps {
  name: string;
  onNameChange: (name: string) => void;
  onBack: () => void;
  onShare?: () => void;
}

export function WhiteboardHeader({ name, onNameChange, onBack, onShare }: WhiteboardHeaderProps) {
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(name);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNameChange(tempName);
    setEditing(false);
  };
  
  return (
    <div className="flex items-center justify-between border-b border-border p-4 bg-background">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft size={16} />
        </Button>
        
        {editing ? (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="h-9 w-64"
              autoFocus
            />
            <Button type="submit" size="sm">Save</Button>
            <Button 
              type="button" 
              size="sm" 
              variant="outline" 
              onClick={() => {
                setTempName(name);
                setEditing(false);
              }}
            >
              Cancel
            </Button>
          </form>
        ) : (
          <h1 
            className="text-xl font-semibold cursor-pointer hover:underline" 
            onClick={() => {
              setTempName(name);
              setEditing(true);
            }}
          >
            {name || "Untitled Whiteboard"}
          </h1>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {onShare && (
          <Button variant="outline" size="sm" onClick={onShare}>
            <Share2 size={14} className="mr-2" />
            Share
          </Button>
        )}
      </div>
    </div>
  );
}