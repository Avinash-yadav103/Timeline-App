export interface TimelineItem {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  color: string;
  category: string;
  description?: string;
}

export interface TimelineProject {
  id: string;
  name: string;
  description?: string;
  items: TimelineItem[];
  created: Date;
  updated: Date;
  owner: string;
  workspaceId: string; // Include workspace ID
}

export type TimelineView = "day" | "week" | "month" | "quarter" | "year";