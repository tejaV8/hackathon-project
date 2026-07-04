import {
  Home,
  MessageSquare,
  FileText,
  Share2,
  CheckSquare,
  BarChart3,
  Shield,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SidebarItem {
  title: string;
  icon: LucideIcon;
  path: string;
}

export const sidebarItems: SidebarItem[] = [
  {
    title: "Home",
    icon: Home,
    path: "/home",
  },
  {
    title: "Ask Brain",
    icon: MessageSquare,
    path: "/askbrain",
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
