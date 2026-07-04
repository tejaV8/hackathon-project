import type { LucideIcon } from "lucide-react";

export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  sources?: string[];
}

export type DocumentStatus = "Indexed" | "Processing" | "Failed";
export type DocumentType = "PDF" | "DOCX" | "TXT" | "CSV" | "PPTX";

export interface CompanyDocument {
  id: string;
  name: string;
  type: DocumentType;
  owner: string;
  size: string;
  uploadedAt: string;
  status: DocumentStatus;
  progress: number;
  source: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  department: string;
  status: "Active" | "Invited" | "Suspended";
  lastActive: string;
}

export interface AnalyticsMetric {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "flat";
}

export interface TrendPoint {
  name: string;
  queries: number;
  uploads: number;
  users: number;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
}

export interface Analytics {
  metrics: AnalyticsMetric[];
  usageTrend: TrendPoint[];
  sourceMix: Array<{ name: string; value: number }>;
  activity: ActivityItem[];
}

export type TaskStatus = "Pending" | "Running" | "Completed";
export type TaskPriority = "Low" | "Medium" | "High";

export interface BrainTask {
  id: string;
  title: string;
  description: string;
  owner: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
}

export interface QuickAction {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
}
