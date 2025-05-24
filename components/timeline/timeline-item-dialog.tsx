"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTimelineStore } from "@/store/timeline-store";
import { TimelineItem } from "@/types/timeline-types";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface TimelineItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  existingItem?: TimelineItem;
}

export function TimelineItemDialog({
  open,
  onOpenChange,
  projectId,
  existingItem
}: TimelineItemDialogProps) {
  const { addItem, updateItem } = useTimelineStore();
  
  const [formData, setFormData] = useState<{
    title: string;
    startDate: Date;
    endDate: Date;
    color: string;
    category: string;
    description: string;
  }>(existingItem ? {
    title: existingItem.title,
    startDate: existingItem.startDate,
    endDate: existingItem.endDate,
    color: existingItem.color,
    category: existingItem.category,
    description: existingItem.description || "",
  } : {
    title: "",
    startDate: new Date(),
    endDate: new Date(),
    color: "#3b82f6",
    category: "Task",
    description: "",
  });
  
  const handleSubmit = () => {
    if (existingItem) {
      updateItem(projectId, existingItem.id, formData);
    } else {
      addItem(projectId, formData);
    }
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{existingItem ? "Edit" : "Add"} Timeline Item</DialogTitle>
          <DialogDescription>
            {existingItem 
              ? "Update the details of this timeline item." 
              : "Add a new item to your timeline."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Item title"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? (
                      format(formData.startDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => setFormData(prev => ({ 
                      ...prev, 
                      startDate: date || new Date(),
                      // Ensure end date is not before start date
                      endDate: date && date > prev.endDate ? date : prev.endDate
                    }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? (
                      format(formData.endDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => date && setFormData(prev => ({ 
                      ...prev, 
                      endDate: date 
                    }))}
                    disabled={(date) => date < formData.startDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Category"
              />
            </div>
            
            <div>
              <Label htmlFor="color">Color</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-16 p-1 h-10"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  placeholder="#HEX"
                />
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description"
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>
            {existingItem ? "Update" : "Add"} Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}