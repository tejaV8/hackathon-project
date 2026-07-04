import {
  Home,
  MessageSquare,
  Bot,
  FileText,
  Share2,
  CheckSquare,
  BarChart3,
  Shield,
} from "lucide-react";

export const sidebarItems = [
  {
    title: "Home",
    icon: Home,
    path: "/home",
  },
  {
    title: "Ask Brain",
    icon: MessageSquare,
    path: "/brain",
  },
  {
    title: "Documents",
    icon: FileText,
    path: "/documents",
  },
  {
    title: "Knowledge Graph",
    icon: Share2,
    path: "/knowledge",
  },
  {
    title: "Tasks",
    icon: CheckSquare,
    path: "/tasks",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    path: "/analytics",
  },
  {
    title: "Admin",
    icon: Shield,
    path: "/admin",
  },
];