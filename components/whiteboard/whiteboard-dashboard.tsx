"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useWhiteboardStore } from "@/store/whiteboard-store";
import { WhiteboardCard } from "./ui/whiteboard-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { TooltipProvider } from "@/components/ui/tooltip"; // Add this import

export function WhiteboardDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const { whiteboards, createWhiteboard, deleteWhiteboard } = useWhiteboardStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [whiteboardToDelete, setWhiteboardToDelete] = useState<string | null>(null);
  
  const filteredWhiteboards = whiteboards.filter(wb => 
    wb.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCreateWhiteboard = () => {
    const newWhiteboard = createWhiteboard("Untitled Whiteboard");
    router.push(`/whiteboard/${newWhiteboard.id}`);
  };
  
  const handleDeleteWhiteboard = () => {
    if (whiteboardToDelete) {
      const whiteboardName = whiteboards.find(wb => wb.id === whiteboardToDelete)?.name;
      deleteWhiteboard(whiteboardToDelete);
      setWhiteboardToDelete(null);
      
      toast({
        title: "Whiteboard deleted",
        description: `"${whiteboardName}" has been deleted.`,
      });
    }
  };
  
  return (
    <TooltipProvider>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Whiteboards</h1>
          <Button onClick={handleCreateWhiteboard}>
            <Plus size={16} className="mr-2" />
            New Whiteboard
          </Button>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search whiteboards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        {filteredWhiteboards.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold">No whiteboards found</h2>
            <p className="text-muted-foreground mt-2">
              {searchQuery 
                ? "Try a different search term or clear the search." 
                : "Create your first whiteboard to get started."}
            </p>
            {whiteboards.length === 0 && (
              <Button onClick={handleCreateWhiteboard} className="mt-4">
                <Plus size={16} className="mr-2" />
                Create Whiteboard
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredWhiteboards.map((whiteboard) => (
              <WhiteboardCard
                key={whiteboard.id}
                whiteboard={whiteboard}
                onDelete={(id) => setWhiteboardToDelete(id)}
              />
            ))}
          </div>
        )}
        
        <AlertDialog 
          open={!!whiteboardToDelete} 
          onOpenChange={(open) => !open && setWhiteboardToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the whiteboard
                and all of its contents.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteWhiteboard}
                className="bg-destructive hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}