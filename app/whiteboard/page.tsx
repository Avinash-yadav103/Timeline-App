"use client"

import { useState } from "react"
import Link from "next/link"
import { useWhiteboard } from "@/hooks/use-whiteboard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Grid, List, Edit, Eye, Trash } from "lucide-react"
import { WhiteboardDashboard } from "@/components/whiteboard/whiteboard-dashboard"

export default function WhiteboardListPage() {
  const { whiteboards, createWhiteboard, deleteWhiteboard } = useWhiteboard()
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [newWhiteboardData, setNewWhiteboardData] = useState({
    name: "",
    description: ""
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  // Filter whiteboards based on search query
  const filteredWhiteboards = whiteboards.filter(wb => 
    wb.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (wb.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  )
  
  // Handle new whiteboard creation
  const handleCreateWhiteboard = () => {
    createWhiteboard({
      name: newWhiteboardData.name,
      description: newWhiteboardData.description,
      elements: [],
      tags: [],
      width: 1920,
      height: 1080,
      backgroundColor: "#ffffff"
    })
    
    setNewWhiteboardData({
      name: "",
      description: ""
    })
    
    setIsDialogOpen(false)
  }
  
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Whiteboards</h1>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search whiteboards..."
              className="pl-10 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center border rounded-md overflow-hidden">
            <Button 
              variant={viewMode === "grid" ? "secondary" : "ghost"} 
              size="icon" 
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button 
              variant={viewMode === "list" ? "secondary" : "ghost"} 
              size="icon" 
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Whiteboard
        </Button>
      </div>
      
      <div>
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWhiteboards.map(whiteboard => (
              <Card key={whiteboard.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{whiteboard.name}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">{whiteboard.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <Link href={`/whiteboard/${whiteboard.id}`} className="text-blue-500 hover:underline">
                      View Whiteboard
                    </Link>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => console.log("Edit", whiteboard.id)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteWhiteboard(whiteboard.id)}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-muted">
            {filteredWhiteboards.map(whiteboard => (
              <div key={whiteboard.id} className="py-4 flex items-center justify-between">
                <div>
                  <Link href={`/whiteboard/${whiteboard.id}`} className="text-blue-500 hover:underline font-semibold">
                    {whiteboard.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">{whiteboard.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => console.log("Edit", whiteboard.id)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => deleteWhiteboard(whiteboard.id)}
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="primary">
            <Plus className="mr-2 h-4 w-4" />
            New Whiteboard
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new whiteboard</DialogTitle>
            <DialogDescription>
              Enter the details for your new whiteboard.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-2">
            <div>
              <Label htmlFor="whiteboard-name">Name</Label>
              <Input 
                id="whiteboard-name" 
                placeholder="Enter whiteboard name" 
                value={newWhiteboardData.name}
                onChange={(e) => setNewWhiteboardData({ ...newWhiteboardData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="whiteboard-description">Description</Label>
              <Textarea 
                id="whiteboard-description" 
                placeholder="Enter whiteboard description" 
                value={newWhiteboardData.description}
                onChange={(e) => setNewWhiteboardData({ ...newWhiteboardData, description: e.target.value })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateWhiteboard}>
              Create Whiteboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <WhiteboardDashboard />
    </div>
  )
}