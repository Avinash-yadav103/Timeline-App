"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import Image from "next/image";

interface WhiteboardTemplate {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
}

interface WhiteboardTemplatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (templateName: string) => void;
  onSkip: () => void;
}

const TEMPLATE_CATEGORIES = [
  "Brainstorming",
  "Project planning", 
  "Design and research",
  "Strategy",
  "Retrospective",
  "Games",
  "Workshops"
];

const TEMPLATES: WhiteboardTemplate[] = [
  {
    id: "affinity-diagram",
    name: "Affinity diagram",
    imageUrl: "/templates/affinity-diagram.png",
    category: "Brainstorming"
  },
  {
    id: "brainstorm",
    name: "Brainstorm",
    imageUrl: "/templates/brainstorm.png",
    category: "Brainstorming"
  },
  {
    id: "brainwriting",
    name: "Brainwriting",
    imageUrl: "/templates/brainwriting.png",
    category: "Brainstorming"
  },
  {
    id: "moodboard",
    name: "Moodboard",
    imageUrl: "/templates/moodboard.png",
    category: "Design and research"
  },
  {
    id: "topic-brainstorm",
    name: "Topic Brainstorm",
    imageUrl: "/templates/topic-brainstorm.png",
    category: "Brainstorming"
  },
  {
    id: "note-pack-multicolored",
    name: "Note pack - multicolored",
    imageUrl: "/templates/note-pack-multicolored.png",
    category: "Brainstorming"
  },
  {
    id: "note-pack-yellow",
    name: "Note pack - yellow",
    imageUrl: "/templates/note-pack-yellow.png",
    category: "Brainstorming"
  }
];

export function WhiteboardTemplatesDialog({
  open,
  onOpenChange,
  onSelectTemplate,
  onSkip
}: WhiteboardTemplatesDialogProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("Brainstorming");

  const filteredTemplates = TEMPLATES.filter(template => {
    const matchesCategory = template.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Templates</DialogTitle>
        </DialogHeader>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search all templates"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button 
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              onClick={() => setSearchQuery("")}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex flex-1 overflow-hidden mt-4 gap-4">
          {/* Sidebar */}
          <div className="w-48 border-r pr-4 overflow-auto">
            {TEMPLATE_CATEGORIES.map((category) => (
              <button
                key={category}
                className={`w-full text-left py-2 px-3 rounded-md ${
                  selectedCategory === category
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Templates */}
          <div className="flex-1 overflow-auto">
            <h2 className="text-xl font-semibold mb-4">{selectedCategory}</h2>
            <div className="grid grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="border rounded-md overflow-hidden cursor-pointer hover:border-primary"
                  onClick={() => onSelectTemplate(template.name)}
                >
                  <div className="aspect-video bg-accent/20 flex items-center justify-center">
                    {/* Replace with actual template images in production */}
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-muted-foreground">
                      {template.name}
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-sm font-medium">{template.name}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredTemplates.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No templates found.</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-between border-t pt-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="show-for-new"
              className="mr-2"
              defaultChecked
            />
            <label htmlFor="show-for-new" className="text-sm">
              Show for new whiteboards
            </label>
          </div>
          <Button onClick={onSkip} variant="outline">
            Skip
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}