import type { ComponentType } from "react";
import {
  BarChart3,
  Bot,
  FileCode2,
  LayoutDashboard,
  PlayCircle,
  Settings,
  ShieldQuestion,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  href: string;
}

export interface NavItem {
  title: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  children?: NavSubItem[];
}

export const primaryNav: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    title: "Bot Engine",
    href: "/bot-engine/outbound",
    icon: Bot,
    children: [
      { title: "Outbound", href: "/bot-engine/outbound" },
      { title: "Inbound", href: "/bot-engine/inbound" },
    ],
  },
  {
    title: "Workflow",
    href: "/workflow",
    icon: FileCode2,
    children: [
      { title: "Danh sách Workflow", href: "/workflow" },
      { title: "Tạo Workflow", href: "/workflow/new" },
    ],
  },
  {
    title: "Báo cáo",
    href: "/report/overview",
    icon: BarChart3,
    children: [
      { title: "Tổng quan", href: "/report/overview" },
      { title: "Inbound", href: "/report/inbound" },
      { title: "Outbound", href: "/report/outbound" },
      { title: "Agent", href: "/report/agent-analysis" },
      { title: "Giám sát lỗi", href: "/report/error-monitor" },
    ],
  },
  { title: "Preview/Test", href: "/preview/playground", icon: PlayCircle },
  {
    title: "Knowledge Base",
    href: "/kb/list",
    icon: ShieldQuestion,
    children: [
      { title: "Danh sách KB", href: "/kb/list" },
      { title: "KB Fallback", href: "/kb/fallback" },
      { title: "Truy vết sử dụng", href: "/kb/usage" },
    ],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    children: [
      { title: "STT/TTS", href: "/settings/stt-tts" },
      { title: "DS Người dùng", href: "/settings/users" },
      { title: "API", href: "/settings/api" },
      { title: "Agent", href: "/settings/agent" },
      { title: "Fallback", href: "/settings/fallback" },
      { title: "Quản lý đầu số", href: "/settings/phone-numbers" },
      { title: "Quản lý extension", href: "/settings/extensions" },
      { title: "Phân quyền", href: "/settings/roles" },
    ],
  },
];
