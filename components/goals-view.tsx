"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Calendar as CalendarIcon,  // Update this line to use Lucide's Calendar icon
  Check,
  CheckCircle,
  Clock,
  Filter,
  PlusCircle,
  Search,
  Tag,
  Timer,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow, isToday, isThisWeek, isThisMonth } from "date-fns";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

// Type definitions
type GoalPeriod = "daily" | "weekly" | "monthly" | "quarterly" | "yearly";

type GoalStatus = "not-started" | "in-progress" | "done" | "cancelled";

interface GoalTag {
  id: string;
  name: string;
}

interface Goal {
  id: string;
  name: string;
  description?: string;
  owner: string;
  status: GoalStatus;
  dueDate: Date;
  priority: string;
  team: string;
  period: GoalPeriod;
  createdAt: Date;
  updatedAt: Date;
  tags: GoalTag[];
  enableNotifications: boolean;
  enableTimer?: boolean;
  timerDuration?: number; // in minutes
  progress?: number;
  successMetrics?: string;
}

// Goal status options
const statusOptions = [
  { label: "Not started", value: "not-started", color: "bg-gray-500/80", icon: <Clock className="h-3 w-3 mr-1" /> },
  { label: "In progress", value: "in-progress", color: "bg-blue-500/80", icon: <Timer className="h-3 w-3 mr-1" /> },
  { label: "Done", value: "done", color: "bg-green-500/80", icon: <CheckCircle className="h-3 w-3 mr-1" /> },
  { label: "Cancelled", value: "cancelled", color: "bg-red-500/80", icon: <Clock className="h-3 w-3 mr-1" /> },
];

// Priority options
const priorityOptions = [
  { label: "High", value: "high", color: "bg-red-500/80" },
  { label: "Medium", value: "medium", color: "bg-orange-500/80" },
  { label: "Low", value: "low", color: "bg-yellow-500/80" },
];

// Team options
const teamOptions = [
  { label: "Business Development", value: "business-dev" },
  { label: "Account Management", value: "account-management" },
  { label: "Engineering", value: "engineering" },
  { label: "Marketing", value: "marketing" },
  { label: "Design", value: "design" },
];

// Sample tags
const sampleTags = [
  { id: "1", name: "feature" },
  { id: "2", name: "bug" },
  { id: "3", name: "improvement" },
  { id: "4", name: "documentation" },
  { id: "5", name: "urgent" },
];

// Sample data
const initialGoals: Goal[] = [
  {
    id: "1",
    name: "Increase sales by 20%",
    description: "Focus on key growth metrics to increase revenue by 20% over previous quarter",
    owner: "John Doe",
    status: "in-progress",
    dueDate: new Date("2025-02-26"),
    priority: "high",
    team: "business-dev",
    period: "quarterly",
    createdAt: new Date("2024-11-01"),
    updatedAt: new Date("2024-12-15"),
    tags: [sampleTags[0], sampleTags[4]],
    enableNotifications: true,
    progress: 45,
    successMetrics: "Achieve $1.2M in new revenue by end of Q1"
  },
  {
    id: "2",
    name: "Launch 3 new products",
    description: "Complete development and launch of 3 new product lines by Q2",
    owner: "Jane Smith",
    status: "not-started",
    dueDate: new Date("2025-04-16"),
    priority: "medium",
    team: "account-management",
    period: "monthly",
    createdAt: new Date("2024-12-01"),
    updatedAt: new Date("2024-12-01"),
    tags: [sampleTags[0]],
    enableNotifications: false,
    progress: 0,
    successMetrics: "Successfully deploy 3 new products to production with 95% customer satisfaction"
  },
  {
    id: "3",
    name: "Acquire 20K new users",
    description: "Marketing campaign to drive user acquisition",
    owner: "Alex Johnson",
    status: "done",
    dueDate: new Date("2025-02-03"),
    priority: "medium",
    team: "business-dev",
    period: "quarterly",
    createdAt: new Date("2024-10-15"),
    updatedAt: new Date("2025-02-03"),
    tags: [sampleTags[2]],
    enableNotifications: false,
    progress: 100,
    successMetrics: "Reach 20,000 new active users with 30% retention rate after 30 days"
  },
];

// Custom Modal implementation
function GoalModal({
  open,
  onOpenChange,
  initialGoal,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialGoal?: Partial<Goal>;
  onSave: (goal: Partial<Goal>) => void;
}) {
  const [activeTab, setActiveTab] = useState("details");
  const modalRef = useRef<HTMLDivElement>(null);
  const [goal, setGoal] = useState<Partial<Goal>>(
    initialGoal || {
      name: "",
      description: "",
      owner: "",
      status: "not-started",
      dueDate: new Date(),
      priority: "medium",
      team: "",
      period: "weekly",
      tags: [],
      enableNotifications: false,
      enableTimer: false,
      timerDuration: 30,
      progress: 0,
      successMetrics: "",
    }
  );
  
  const [tagInput, setTagInput] = useState("");
  
  // Handle click outside to close modal
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Don't close if clicking on dropdown content or items
      const target = event.target as HTMLElement;
      if (target.closest('[role="menu"]') || 
          target.closest('[role="menuitem"]') ||
          target.closest('[role="radiogroup"]') ||
          target.closest('[role="dialog"]') ||
          target.closest('.popover-content')) {
        return;
      }
      
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onOpenChange(false);
      }
    }
    
    // Handle escape key to close modal
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = '';
    };
  }, [open, onOpenChange]);
  
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    const newTag = {
      id: Math.random().toString(36).substring(2),
      name: tagInput.trim(),
    };
    
    setGoal({
      ...goal,
      tags: [...(goal.tags || []), newTag],
    });
    
    setTagInput("");
  };
  
  const handleRemoveTag = (tagId: string) => {
    setGoal({
      ...goal,
      tags: (goal.tags || []).filter(tag => tag.id !== tagId),
    });
  };

  const handleSave = () => {
    onSave(goal);
    onOpenChange(false);
  };

  if (!open) return null;

  // Modal overlay styles
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex flex-col space-y-1.5">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="text-blue-500">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {initialGoal?.id ? "Edit goal" : "New goal"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {initialGoal?.id 
                ? "Edit your goal details, timeline, and metrics."
                : "Create a new goal and track your progress."}
            </p>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col gap-6">
            {/* Name Input */}
            <div>
              <Input
                className="text-xl font-medium border-none px-0 focus-visible:ring-0 focus-visible:outline-none w-full placeholder:text-muted-foreground/50"
                value={goal.name}
                onChange={(e) => setGoal({ ...goal, name: e.target.value })}
                placeholder="Goal name"
              />
            </div>
            
            {/* Main Tabs */}
            <Tabs defaultValue="details" className="w-full" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="success-metrics">Success Metrics</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>
              
              {/* Details Tab */}
              <TabsContent value="details" className="mt-4 space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-1.5 block">Description</Label>
                    <div className="relative">
                      <Textarea
                        className="min-h-32 resize-none"
                        placeholder="Write a clear, specific description of what you want to achieve"
                        value={goal.description || ""}
                        onChange={(e) => setGoal({ ...goal, description: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">Owner</Label>
                      <Input
                        value={goal.owner || ""}
                        onChange={(e) => setGoal({ ...goal, owner: e.target.value })}
                        placeholder="Assign an owner"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">Status</Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {goal.status && 
                            <>
                              <span className={`w-2 h-2 rounded-full mr-2 ${statusOptions.find(s => s.value === goal.status)?.color || "bg-gray-500"}`} />
                              {statusOptions.find(s => s.value === goal.status)?.label || "Select status"}
                            </>
                            }
                            {!goal.status && "Select status"}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenuRadioGroup value={goal.status} onValueChange={(value) => setGoal({ ...goal, status: value as GoalStatus })}>
                            {statusOptions.map((option) => (
                              <DropdownMenuRadioItem key={option.value} value={option.value} className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${option.color}`} />
                                {option.label}
                              </DropdownMenuRadioItem>
                            ))}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">Priority</Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {goal.priority && 
                            <>
                              <span className={`w-2 h-2 rounded-full mr-2 ${priorityOptions.find(p => p.value === goal.priority)?.color || ""}`} />
                              {priorityOptions.find(p => p.value === goal.priority)?.label || "Select priority"}
                            </>
                            }
                            {!goal.priority && "Select priority"}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenuRadioGroup value={goal.priority} onValueChange={(value) => setGoal({ ...goal, priority: value })}>
                            {priorityOptions.map((option) => (
                              <DropdownMenuRadioItem 
                                key={option.value} 
                                value={option.value} 
                                className="flex items-center gap-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span className={`w-2 h-2 rounded-full ${option.color}`} />
                                {option.label}
                              </DropdownMenuRadioItem>
                            ))}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">Team</Label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {goal.team && teamOptions.find(t => t.value === goal.team)?.label}
                            {!goal.team && "Select team"}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenuRadioGroup value={goal.team} onValueChange={(value) => setGoal({ ...goal, team: value })}>
                            {teamOptions.map((option) => (
                              <DropdownMenuRadioItem 
                                key={option.value} 
                                value={option.value}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {option.label}
                              </DropdownMenuRadioItem>
                            ))}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium mb-1.5 block">Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {goal.tags?.map((tag) => (
                        <Badge key={tag.id} variant="outline" className="flex items-center gap-1">
                          <Tag className="h-3 w-3 text-muted-foreground" />
                          #{tag.name}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-4 w-4 p-0 ml-1" 
                            onClick={() => handleRemoveTag(tag.id)}
                          >
                            &times;
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add tags..."
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                      />
                      <Button variant="outline" onClick={handleAddTag}>Add</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Success Metrics Tab */}
              <TabsContent value="success-metrics" className="mt-4 space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-1.5 block">How will you measure success?</Label>
                    <Textarea
                      className="min-h-32 resize-none"
                      placeholder="Define how you will measure progress and success"
                      value={goal.successMetrics || ""}
                      onChange={(e) => setGoal({ ...goal, successMetrics: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-sm font-medium">Current progress</Label>
                      <span className="text-sm text-muted-foreground">{goal.progress || 0}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                    <Input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={goal.progress || 0}
                      onChange={(e) => setGoal({ ...goal, progress: parseInt(e.target.value) })}
                      className="mt-2"
                    />
                  </div>
                </div>
              </TabsContent>
              
              {/* Timeline Tab */}
              <TabsContent value="timeline" className="mt-4 space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-1.5 block">Due date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !goal.dueDate && "text-muted-foreground"
                          )}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {goal.dueDate ? format(goal.dueDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" onClick={(e) => e.stopPropagation()}>
                        <CalendarComponent
                          mode="single"
                          selected={goal.dueDate}
                          onSelect={(date) => date && setGoal({ ...goal, dueDate: date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium mb-1.5 block">Goal period</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {goal.period === "daily" && "Daily"}
                          {goal.period === "weekly" && "Weekly"}
                          {goal.period === "monthly" && "Monthly"}
                          {goal.period === "quarterly" && "Quarterly"}
                          {goal.period === "yearly" && "Yearly"}
                          {!goal.period && "Select period"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuRadioGroup value={goal.period} onValueChange={(value) => setGoal({ ...goal, period: value as GoalPeriod })}>
                          <DropdownMenuRadioItem value="daily">Daily</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="weekly">Weekly</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="monthly">Monthly</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="quarterly">Quarterly</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="yearly">Yearly</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Enable notifications</Label>
                      <Switch 
                        checked={goal.enableNotifications || false}
                        onCheckedChange={(checked) => setGoal({ ...goal, enableNotifications: checked })}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Enable timer</Label>
                      <Switch 
                        checked={goal.enableTimer || false}
                        onCheckedChange={(checked) => setGoal({ ...goal, enableTimer: checked })}
                      />
                    </div>
                    
                    {goal.enableTimer && (
                      <div>
                        <Label className="text-sm font-medium mb-1.5 block">Timer duration (minutes)</Label>
                        <Input
                          type="number"
                          min={1}
                          value={goal.timerDuration || 30}
                          onChange={(e) => setGoal({ ...goal, timerDuration: parseInt(e.target.value) })}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {initialGoal?.id ? "Save changes" : "Create goal"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Main Goals View component
export function GoalsView() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState<"all" | GoalPeriod>("all");
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState<Goal | null>(null);
  
  // Filter goals by period and search query
  const filteredGoals = goals.filter((goal) => {
    // Filter by search query
    const matchesSearch = goal.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (goal.description?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by tab/period
    const matchesPeriod = currentTab === "all" || goal.period === currentTab;
    
    return matchesSearch && matchesPeriod;
  });

  const handleSaveGoal = (goalData: Partial<Goal>) => {
    if (goalToEdit) {
      // Update existing goal
      setGoals(goals.map(g => g.id === goalToEdit.id ? {...g, ...goalData, updatedAt: new Date()} : g));
      toast({
        title: "Goal updated",
        description: "Your goal has been updated successfully.",
      });
    } else {
      // Add new goal
      const newGoal: Goal = {
        id: Math.random().toString(36).substring(2),
        name: goalData.name || "Untitled Goal",  // Default to "Untitled Goal" if name is empty
        description: goalData.description || "",
        owner: goalData.owner || "",
        status: goalData.status || "not-started",
        dueDate: goalData.dueDate || new Date(),
        priority: goalData.priority || "medium",
        team: goalData.team || "",
        period: goalData.period || "weekly",
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: goalData.tags || [],
        enableNotifications: goalData.enableNotifications || false,
        enableTimer: goalData.enableTimer || false,
        timerDuration: goalData.timerDuration || 0,
        progress: goalData.progress || 0,
        successMetrics: goalData.successMetrics || "",
      };
      
      setGoals([...goals, newGoal]);
      toast({
        title: "Goal created",
        description: "Your new goal has been created successfully.",
      });
    }
    
    setGoalToEdit(null);
  };

  // Update goal status
  const updateGoalStatus = (id: string, status: GoalStatus) => {
    setGoals(
      goals.map((goal) =>
        goal.id === id ? { ...goal, status, updatedAt: new Date() } : goal
      )
    );
  };

  return (
    <div className="container p-6 space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="20" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h1 className="text-3xl font-bold">Goals Tracker</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search goals..."
                className="pl-10 w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsAddingGoal(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Goal
            </Button>
          </div>
        </div>
        
        <p className="text-muted-foreground">
          Align your team's objectives. Track progress seamlessly.
        </p>
      </div>
      
      {/* Tabs for filtering by period */}
      <Tabs defaultValue="all" className="w-full" value={currentTab} onValueChange={(value) => setCurrentTab(value as any)}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Goals</TabsTrigger>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
          </TabsList>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <Checkbox id="filter-completed" className="mr-2" />
                <label htmlFor="filter-completed">Hide completed</label>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Checkbox id="filter-overdue" className="mr-2" />
                <label htmlFor="filter-overdue">Show overdue</label>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="font-medium">By Priority</DropdownMenuItem>
              {priorityOptions.map((option) => (
                <DropdownMenuItem key={option.value}>
                  <Checkbox id={`filter-priority-${option.value}`} className="mr-2" />
                  <label htmlFor={`filter-priority-${option.value}`} className="flex items-center">
                    <span className={`w-2 h-2 rounded-full ${option.color} mr-2`} />
                    {option.label}
                  </label>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <TabsContent value="all" className="mt-4">
          <GoalsTable 
            goals={filteredGoals} 
            updateGoalStatus={updateGoalStatus}
            onEdit={(goal) => {
              setGoalToEdit(goal);
              setIsAddingGoal(true);
            }}
          />
        </TabsContent>
        
        <TabsContent value="daily" className="mt-4">
          <GoalsTable 
            goals={filteredGoals} 
            updateGoalStatus={updateGoalStatus}
            onEdit={(goal) => {
              setGoalToEdit(goal);
              setIsAddingGoal(true);
            }}
          />
        </TabsContent>
        
        <TabsContent value="weekly" className="mt-4">
          <GoalsTable 
            goals={filteredGoals} 
            updateGoalStatus={updateGoalStatus}
            onEdit={(goal) => {
              setGoalToEdit(goal);
              setIsAddingGoal(true);
            }}
          />
        </TabsContent>
        
        <TabsContent value="monthly" className="mt-4">
          <GoalsTable 
            goals={filteredGoals} 
            updateGoalStatus={updateGoalStatus}
            onEdit={(goal) => {
              setGoalToEdit(goal);
              setIsAddingGoal(true);
            }}
          />
        </TabsContent>
        
        <TabsContent value="quarterly" className="mt-4">
          <GoalsTable 
            goals={filteredGoals} 
            updateGoalStatus={updateGoalStatus}
            onEdit={(goal) => {
              setGoalToEdit(goal);
              setIsAddingGoal(true);
            }}
          />
        </TabsContent>
      </Tabs>
      
      {/* Goal Modal */}
      <GoalModal
        open={isAddingGoal}
        onOpenChange={(open) => {
          setIsAddingGoal(open);
          if (!open) {
            setGoalToEdit(null);
          }
        }}
        initialGoal={goalToEdit || undefined}
        onSave={handleSaveGoal}
      />
    </div>
  );
}

// Goals Table component
function GoalsTable({
  goals,
  updateGoalStatus,
  onEdit,
}: {
  goals: Goal[];
  updateGoalStatus: (id: string, status: GoalStatus) => void;
  onEdit: (goal: Goal) => void;
}) {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Goal name</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due date</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="w-10 text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {goals.map((goal) => (
            <TableRow 
              key={goal.id}
              className="cursor-pointer"
              onClick={() => onEdit(goal)}
            >
              <TableCell className="font-medium">{goal.name}</TableCell>
              <TableCell>{goal.owner}</TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Badge
                      className={cn(
                        "flex items-center gap-1 cursor-pointer",
                        goal.status === "in-progress" && "bg-blue-500/80",
                        goal.status === "done" && "bg-green-500/80",
                        goal.status === "not-started" && "bg-gray-500/80",
                        goal.status === "cancelled" && "bg-red-500/80"
                      )}
                    >
                      {statusOptions.find(s => s.value === goal.status)?.icon}
                      {goal.status === "in-progress"
                        ? "In progress"
                        : goal.status === "done"
                        ? "Done"
                        : goal.status === "cancelled"
                        ? "Cancelled"
                        : "Not started"}
                    </Badge>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                    {statusOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        className="cursor-pointer flex items-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateGoalStatus(goal.id, option.value as GoalStatus);
                        }}
                      >
                        <span className={`w-2 h-2 rounded-full ${option.color}`} />
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{format(goal.dueDate, "MMM dd, yyyy")}</span>
                  {isToday(goal.dueDate) && (
                    <span className="text-xs text-blue-500">Today</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  className={cn(
                    goal.priority === "high" && "bg-red-500/80",
                    goal.priority === "medium" && "bg-orange-500/80",
                    goal.priority === "low" && "bg-yellow-500/80",
                  )}
                >
                  {goal.priority === "high"
                    ? "High"
                    : goal.priority === "medium"
                    ? "Medium"
                    : "Low"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className="bg-slate-600">
                  {teamOptions.find((t) => t.value === goal.team)?.label || "Unassigned"}
                </Badge>
              </TableCell>
              <TableCell className="flex gap-1 justify-end">
                {goal.enableNotifications && (
                  <Bell className="h-4 w-4 text-muted-foreground" />
                )}
                {goal.tags && goal.tags.length > 0 && (
                  <Tag className="h-4 w-4 text-muted-foreground" />
                )}
              </TableCell>
            </TableRow>
          ))}
          
          {goals.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <svg className="w-8 h-8 mb-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="2" />
                    <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="mb-1">No goals found</p>
                  <p className="text-sm">Create a new goal or adjust your search filters.</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}