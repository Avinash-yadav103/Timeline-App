export interface Event {
  id: string
  title: string
  description?: string
  startTime: Date | string
  endTime: Date | string
  category: string
  location?: string
  isRecurring: boolean
  recurrencePattern: "none" | "daily" | "weekly" | "monthly" | "custom"
}

export interface Notification {
  id: string
  title: string
  message: string
  time: Date | string
  category: string
  eventId: string
}

