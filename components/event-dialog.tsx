"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Calendar, Trash2 } from "lucide-react"
import { useCalendar } from "@/hooks/use-calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { TimePickerDemo } from "@/components/time-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { Event } from "@/types"

interface EventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EventDialog({ open, onOpenChange }: EventDialogProps) {
  const { selectedEvent, selectedDate, addEvent, updateEvent, deleteEvent } = useCalendar()

  const [formData, setFormData] = useState<Partial<Event>>({
    title: "",
    description: "",
    startTime: new Date(),
    endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
    category: "work",
    location: "",
    isRecurring: false,
    recurrencePattern: "none",
  })

  useEffect(() => {
    if (selectedEvent) {
      setFormData({
        ...selectedEvent,
        startTime: new Date(selectedEvent.startTime),
        endTime: new Date(selectedEvent.endTime),
      })
    } else if (selectedDate) {
      const endTime = new Date(selectedDate)
      endTime.setHours(endTime.getHours() + 1)

      setFormData({
        title: "",
        description: "",
        startTime: selectedDate,
        endTime: endTime,
        category: "work",
        location: "",
        isRecurring: false,
        recurrencePattern: "none",
      })
    }
  }, [selectedEvent, selectedDate])

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = () => {
    if (!formData.title) return

    if (selectedEvent) {
      updateEvent({
        ...formData,
        id: selectedEvent.id,
      } as Event)
    } else {
      addEvent(formData as Event)
    }

    onOpenChange(false)
  }

  const handleDelete = () => {
    if (selectedEvent) {
      deleteEvent(selectedEvent.id)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{selectedEvent ? "Edit Event" : "Create Event"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Event title"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Event description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {formData.startTime ? format(formData.startTime, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={formData.startTime}
                    onSelect={(date) => handleChange("startTime", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label>Start Time</Label>
              <TimePickerDemo value={formData.startTime} onChange={(date) => handleChange("startTime", date)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {formData.endTime ? format(formData.endTime, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={formData.endTime}
                    onSelect={(date) => handleChange("endTime", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label>End Time</Label>
              <TimePickerDemo value={formData.endTime} onChange={(date) => handleChange("endTime", date)} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Category</Label>
            <RadioGroup
              value={formData.category}
              onValueChange={(value) => handleChange("category", value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="work" id="work" />
                <Label htmlFor="work" className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                  Work
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="personal" id="personal" />
                <Label htmlFor="personal" className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                  Personal
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="reminder" id="reminder" />
                <Label htmlFor="reminder" className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
                  Reminder
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location || ""}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="Event location"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="recurring"
              checked={formData.isRecurring}
              onCheckedChange={(checked) => handleChange("isRecurring", checked)}
            />
            <Label htmlFor="recurring">Recurring Event</Label>
          </div>

          {formData.isRecurring && (
            <div className="grid gap-2">
              <Label>Recurrence Pattern</Label>
              <Select
                value={formData.recurrencePattern}
                onValueChange={(value) => handleChange("recurrencePattern", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pattern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-between">
          {selectedEvent && (
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>{selectedEvent ? "Update" : "Create"}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

