import type {
  Analytics,
  BrainTask,
  CompanyDocument,
  Message,
  User,
} from "../types";

const wait = (ms = 450) => new Promise((resolve) => window.setTimeout(resolve, ms));

export const mockDocuments: CompanyDocument[] = [
  {
    id: "doc-1",
    name: "Q3 Revenue Operating Plan.pdf",
    type: "PDF",
    owner: "Finance",
    size: "18.4 MB",
    uploadedAt: "Today, 9:42 AM",
    status: "Indexed",
    progress: 100,
    source: "Google Drive",
  },
  {
    id: "doc-2",
    name: "Enterprise Security Playbook.docx",
    type: "DOCX",
    owner: "Security",
    size: "7.1 MB",
    uploadedAt: "Yesterday",
    status: "Indexed",
    progress: 100,
    source: "Notion",
  },
  {
    id: "doc-3",
    name: "Customer Support Escalations.csv",
    type: "CSV",
    owner: "CX Ops",
    size: "2.6 MB",
    uploadedAt: "Jul 2",
    status: "Processing",
    progress: 68,
    source: "Upload",
  },
  {
    id: "doc-4",
    name: "Product Roadmap FY27.pptx",
    type: "PPTX",
    owner: "Product",
    size: "31.8 MB",
    uploadedAt: "Jun 29",
    status: "Indexed",
    progress: 100,
    source: "SharePoint",
  },
];

export const mockMessages: Message[] = [
  {
    id: "msg-1",
    role: "assistant",
    content:
      "Good morning. I have indexed 184 company sources and can answer with citations from HR, Sales, Product, Support, and Finance.",
    createdAt: "9:00 AM",
  },
  {
    id: "msg-2",
    role: "user",
    content: "What changed in the enterprise security playbook?",
    createdAt: "9:03 AM",
  },
  {
    id: "msg-3",
    role: "assistant",
    content:
      "The main changes are mandatory device posture checks, a 24-hour incident acknowledgement SLA, and a new quarterly access review for privileged systems.",
    createdAt: "9:04 AM",
    sources: ["Enterprise Security Playbook.docx", "SOC2 Evidence Tracker"],
  },
];

export const mockAnalytics: Analytics = {
  metrics: [
    { label: "Queries", value: "12.8K", change: "+24%", trend: "up" },
    { label: "Uploads", value: "428", change: "+18%", trend: "up" },
    { label: "Active Users", value: "286", change: "+9%", trend: "up" },
    { label: "Knowledge Sources", value: "34", change: "Stable", trend: "flat" },
  ],
  usageTrend: [
    { name: "Mon", queries: 820, uploads: 28, users: 140 },
    { name: "Tue", queries: 960, uploads: 35, users: 168 },
    { name: "Wed", queries: 1220, uploads: 42, users: 194 },
    { name: "Thu", queries: 1380, uploads: 38, users: 212 },
    { name: "Fri", queries: 1610, uploads: 51, users: 236 },
    { name: "Sat", queries: 1040, uploads: 24, users: 176 },
    { name: "Sun", queries: 910, uploads: 18, users: 152 },
  ],
  sourceMix: [
    { name: "Docs", value: 38 },
    { name: "Slack", value: 24 },
    { name: "Notion", value: 18 },
    { name: "Jira", value: 12 },
    { name: "Drive", value: 8 },
  ],
  activity: [
    {
      id: "act-1",
      title: "Sales digest generated",
      description: "Weekly pipeline movement summarized for leadership.",
      time: "12 min ago",
    },
    {
      id: "act-2",
      title: "New source connected",
      description: "Product roadmap workspace synced from Notion.",
      time: "44 min ago",
    },
    {
      id: "act-3",
      title: "Policy anomaly detected",
      description: "Two HR documents contain conflicting remote work guidance.",
      time: "2 hr ago",
    },
  ],
};

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

export async function uploadDocument(file: File): Promise<CompanyDocument> {
  await wait(700);

  const extension = file.name.split(".").pop()?.toUpperCase() ?? "TXT";
  const type = ["PDF", "DOCX", "TXT", "CSV", "PPTX"].includes(extension)
    ? (extension as CompanyDocument["type"])
    : "TXT";

  return {
    id: `doc-${Date.now()}`,
    name: file.name,
    type,
    owner: "You",
    size: `${Math.max(file.size / 1024 / 1024, 0.1).toFixed(1)} MB`,
    uploadedAt: "Just now",
    status: "Processing",
    progress: 42,
    source: "Upload",
  };
}

export async function askBrain(prompt: string): Promise<Message> {
  await wait(850);

  return {
    id: `msg-${Date.now()}`,
    role: "assistant",
    content: `I searched across policies, roadmap notes, and operating plans. The short answer: ${prompt.toLowerCase().includes("risk") ? "the highest risk area is cross-functional dependency drift, especially around launch readiness." : "the strongest source-backed answer is in the latest indexed company documents."}`,
    createdAt: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
    sources: ["Q3 Revenue Operating Plan.pdf", "Product Roadmap FY27.pptx"],
  };
}

export async function getAnalytics(): Promise<Analytics> {
  await wait(350);
  return mockAnalytics;
}

export async function getDocuments(): Promise<CompanyDocument[]> {
  await wait(300);
  return mockDocuments;
}
