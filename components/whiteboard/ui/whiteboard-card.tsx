"use client";

import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { WhiteboardData } from "@/types/whiteboard-types";

interface WhiteboardCardProps {
  whiteboard: WhiteboardData;
  onDelete: (id: string) => void;
}

export function WhiteboardCard({ whiteboard, onDelete }: WhiteboardCardProps) {
  const router = useRouter();
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg truncate">{whiteboard.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={() => router.push(`/whiteboard/${whiteboard.id}`)}
              >
                <Pencil size={14} className="mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground"
                onClick={() => onDelete(whiteboard.id)}
              >
                <Trash2 size={14} className="mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <Link href={`/whiteboard/${whiteboard.id}`} passHref>
        <CardContent className="p-0 overflow-hidden">
          <div className="bg-muted aspect-video p-2">
            {whiteboard.thumbnail ? (
              <img 
                src={whiteboard.thumbnail} 
                alt={whiteboard.name} 
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No preview available
              </div>
            )}
          </div>
        </CardContent>
      </Link>
      
      <CardFooter className="p-4 pt-2 text-xs text-muted-foreground flex justify-between">
        <span>
          Updated {formatDistanceToNow(whiteboard.updatedAt, { addSuffix: true })}
        </span>
        <span>
          {whiteboard.elements.length} {whiteboard.elements.length === 1 ? 'element' : 'elements'}
        </span>
      </CardFooter>
    </Card>
  );
}