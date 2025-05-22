"use client"

import { WhiteboardCanvas } from "@/components/whiteboard/canvas/whiteboard-canvas"
import { WhiteboardToolbar } from "@/components/whiteboard/ui/toolbar"
import { useWhiteboard } from "@/hooks/use-whiteboard"
import { useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function WhiteboardEditPage() {
  const { whiteboards, setCurrentWhiteboard, currentWhiteboard } = useWhiteboard()
  const params = useParams()
  const whiteboardId = params.id as string
  
  useEffect(() => {
    setCurrentWhiteboard(whiteboardId)
  }, [whiteboardId, setCurrentWhiteboard])
  
  if (!currentWhiteboard) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Whiteboard not found</h2>
          <p className="text-muted-foreground mb-4">The whiteboard you are looking for does not exist</p>
          <Link href="/whiteboard">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Whiteboards
            </Button>
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex h-full">
      {/* Toolbar */}
      <WhiteboardToolbar />
      
      {/* Canvas */}
      <div className="flex-1 overflow-hidden">
        <div className="h-14 border-b border-border px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/whiteboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">{currentWhiteboard.name}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">Share</Button>
            <Button size="sm">Save</Button>
          </div>
        </div>
        
        <div className="h-[calc(100%-3.5rem)] bg-gray-100 dark:bg-gray-900">
          <WhiteboardCanvas />
        </div>
      </div>
    </div>
  )
}