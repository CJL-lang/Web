import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BellRing,
  CheckCheck,
  ClipboardList,
  Package,
  Settings,
  UserRoundCog,
  Users,
} from "lucide-react";

export interface NavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export const navigationItems: NavigationItem[] = [
  {
    label: "统计",
    path: "/dashboard",
    icon: BarChart3,
  },
  {
    label: "发布消息",
    path: "/messages",
    icon: BellRing,
  },
  {
    label: "学员管理",
    path: "/students",
    icon: Users,
  },
  {
    label: "教练管理",
    path: "/coaches",
    icon: UserRoundCog,
  },
  {
    label: "套餐管理",
    path: "/packages",
    icon: Package,
  },
  {
    label: "订单管理",
    path: "/orders",
    icon: ClipboardList,
  },
  {
    label: "批准申请",
    path: "/approvals",
    icon: CheckCheck,
  },
  {
    label: "设置",
    path: "/settings",
    icon: Settings,
  },
];
