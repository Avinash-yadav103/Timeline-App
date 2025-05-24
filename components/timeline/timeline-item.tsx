"use client";

import * as React from "react";
import { TimelineItem as TimelineItemType } from "@/types/timeline-types";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface TimelineItemProps {
  item: TimelineItemType & {
    startOffset: number;
    duration: number;
  };
  startOffset: number;
  duration: number;
  totalColumns: number;
}

export function TimelineItem({ 
  item, 
  startOffset, 
  duration, 
  totalColumns 
}: TimelineItemProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  
  const left = `${(startOffset / totalColumns) * 100}%`;
  const width = `${(duration / totalColumns) * 100}%`;
  
  return (
    <>
      <div
        className="absolute rounded-md p-2 text-sm cursor-pointer hover:ring-2 hover:ring-inset hover:ring-primary"
        style={{
          left,
          width,
          backgroundColor: item.color || '#3b82f6',
          color: '#fff',
          top: '8px',
          height: '40px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
        onClick={() => setIsDialogOpen(true)}
      >
        {item.title}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{item.title}</DialogTitle>
            <DialogDescription>
              {format(item.startDate, "PPP")} - {format(item.endDate, "PPP")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <span className="font-semibold">Category:</span> {item.category}
            </div>
            
            {item.description && (
              <div>
                <span className="font-semibold">Description:</span>
                <p className="mt-1">{item.description}</p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
            <Button>Edit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}