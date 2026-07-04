import axios from "axios";
import type {
  Analytics,
  BrainTask,
  CompanyDocument,
  Message,
  User,
} from "../types";

const API_BASE_URL = "http://localhost:8000";

// Fallback Mock Data for UI features without backend tables
export const mockTasks: BrainTask[] = [
  {
    id: "task-1",
    title: "Generate onboarding guide",
    description: "Create a department-specific new hire brief from HR and IT docs.",
    owner: "People Ops",
    status: "Running",
    priority: "High",
    dueDate: "Today",
  },
  {
    id: "task-2",
    title: "Summarize Q3 revenue risks",
    description: "Scan finance notes and highlight risk themes for the exec staff.",
    owner: "Finance",
    status: "Pending",
    priority: "Medium",
    dueDate: "Tomorrow",
  },
  {
    id: "task-3",
    title: "Extract support escalation themes",
    description: "Cluster support tickets and draft recommended playbook changes.",
    owner: "CX Ops",
    status: "Completed",
    priority: "High",
    dueDate: "Jul 1",
  },
];

export const mockMessages: Message[] = [
  {
    id: "msg-1",
    role: "assistant",
    content:
      "Good morning. I have indexed company sources and can answer with citations from HR, Sales, Product, Support, and Finance.",
    createdAt: "9:00 AM",
  },
];

export const mockUsers: User[] = [
  {
    id: "usr-1",
    name: "Priya Sharma",
    email: "priya@company.ai",
    role: "Admin",
    department: "Product",
    status: "Active",
    lastActive: "2 min ago",
  },
  {
    id: "usr-2",
    name: "Marcus Lee",
    email: "marcus@company.ai",
    role: "Editor",
    department: "Sales",
    status: "Active",
    lastActive: "18 min ago",
  },
  {
    id: "usr-3",
    name: "Anika Rao",
    email: "anika@company.ai",
    role: "Viewer",
    department: "Legal",
    status: "Invited",
    lastActive: "Pending",
  },
];

// Helper to format file size
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

// Convert Backend Document model to Frontend CompanyDocument structure
function mapDocument(doc: any): CompanyDocument {
  const extension = (doc.file_type || "txt").toUpperCase();
  return {
    id: String(doc.id),
    name: doc.filename,
    type: extension as any,
    owner: "Admin", // default since uploader info is not joined
    size: formatBytes(doc.file_size),
    uploadedAt: new Date(doc.created_at).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: doc.is_processed ? "Indexed" : "Processing",
    progress: doc.is_processed ? 100 : 60,
    source: "Upload",
  };
}

// 1. Ingestion: Upload a document
export async function uploadDocument(file: File, department?: string): Promise<CompanyDocument> {
  const formData = new FormData();
  formData.append("file", file);
  if (department && department !== "public") {
    formData.append("department", department);
  }

  const response = await axios.post(`${API_BASE_URL}/documents/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return mapDocument(response.data);
}

// 2. RAG Pipeline: Submit query
export async function askBrain(prompt: string): Promise<Message> {
  const response = await axios.post(`${API_BASE_URL}/query`, {
    question: prompt,
  });

  const data = response.data;
  return {
    id: `msg-${Date.now()}`,
    role: "assistant",
    content: data.response,
    createdAt: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    sources: data.citations ? data.citations.map((c: any) => c.filename) : [],
  };
}

// 3. Analytics Dashboard metrics mapping
export async function getAnalytics(): Promise<Analytics> {
  try {
    const response = await axios.get(`${API_BASE_URL}/analytics/dashboard`);
    const data = response.data;

    // Generate recent activity items dynamically from backend analytics
    const activity: any[] = [];
    if (data.knowledge_gaps && data.knowledge_gaps.length > 0) {
      data.knowledge_gaps.slice(0, 3).forEach((gap: string, i: number) => {
        activity.push({
          id: `act-gap-${i}`,
          title: "Knowledge Gap Identified",
          description: `Low confidence RAG query: "${gap}"`,
          time: "Recent",
        });
      });
    }

    if (data.unused_documents && data.unused_documents.length > 0) {
      data.unused_documents.slice(0, 2).forEach((doc: string, i: number) => {
        activity.push({
          id: `act-doc-${i}`,
          title: "Unutilized Document",
          description: `"${doc}" has not been cited yet.`,
          time: "Insight",
        });
      });
    }

    // Default activity fallback if empty
    if (activity.length === 0) {
      activity.push({
        id: "act-default",
        title: "All Systems Operational",
        description: "RAG pipeline synchronizing files and graphs normally.",
        time: "Now",
      });
    }

    // Map source mix from uploads by department
    const sourceMix = Object.entries(data.uploads_by_department).map(([name, value]) => ({
      name,
      value: Number(value),
    }));

    if (sourceMix.length === 0) {
      sourceMix.push({ name: "No Sources", value: 1 });
    }

    return {
      metrics: [
        {
          label: "Queries",
          value: String(data.total_questions),
          change: "+12% overall",
          trend: data.total_questions > 0 ? "up" : "flat",
        },
        {
          label: "Uploads",
          value: String(data.total_uploads),
          change: `${sourceMix.length} depts`,
          trend: "up",
        },
        {
          label: "Avg Latency",
          value: `${Math.round(data.avg_response_time_ms)}ms`,
          change: "Under target",
          trend: "down",
        },
        {
          label: "Active Agents",
          value: "12",
          change: "Stable",
          trend: "flat",
        },
      ],
      usageTrend: [
        { name: "Mon", queries: Math.max(0, data.total_questions - 4), uploads: Math.max(0, data.total_uploads - 2), users: 80 },
        { name: "Tue", queries: Math.max(0, data.total_questions - 2), uploads: Math.max(0, data.total_uploads - 1), users: 95 },
        { name: "Wed", queries: data.total_questions, uploads: data.total_uploads, users: 110 },
      ],
      sourceMix,
      activity,
    };
  } catch (error) {
    console.error("Failed to fetch analytics from backend, returning mock layout fallback:", error);
    // Fallback in case backend is offline
    return {
      metrics: [
        { label: "Queries", value: "0", change: "Offline", trend: "flat" },
        { label: "Uploads", value: "0", change: "Offline", trend: "flat" },
        { label: "Avg Latency", value: "0ms", change: "Offline", trend: "flat" },
        { label: "Active Agents", value: "0", change: "Offline", trend: "flat" },
      ],
      usageTrend: [],
      sourceMix: [{ name: "Offline", value: 1 }],
      activity: [
        {
          id: "offline-1",
          title: "Backend Connection Error",
          description: "Make sure backend server is running on http://localhost:8000.",
          time: "Warning",
        },
      ],
    };
  }
}

// 4. Ingestion: Retrieve all uploaded documents
export async function getDocuments(): Promise<CompanyDocument[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/documents`);
    return response.data.map(mapDocument);
  } catch (error) {
    console.error("Failed to fetch documents, returning offline empty list:", error);
    return [];
  }
}

// 5. Ingestion: Delete an uploaded document
export async function deleteDocument(id: string): Promise<void> {
  await axios.delete(`${API_BASE_URL}/documents/${id}`);
}
