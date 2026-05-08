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
  description: string;
}

export const navigationItems: NavigationItem[] = [
  {
    label: "统计",
    path: "/dashboard",
    icon: BarChart3,
    description: "查看学院核心经营概况",
  },
  {
    label: "发布消息",
    path: "/messages",
    icon: BellRing,
    description: "向学生或教练发送运营消息",
  },
  {
    label: "学员管理",
    path: "/students",
    icon: Users,
    description: "管理学院学员信息与状态",
  },
  {
    label: "教练管理",
    path: "/coaches",
    icon: UserRoundCog,
    description: "管理教练档案与安排",
  },
  {
    label: "套餐管理",
    path: "/packages",
    icon: Package,
    description: "配置在售课程套餐与权益",
  },
  {
    label: "订单管理",
    path: "/orders",
    icon: ClipboardList,
    description: "查看与处理学员购课订单",
  },
  {
    label: "批准申请",
    path: "/approvals",
    icon: CheckCheck,
    description: "审批教练与学员的请假申请",
  },
  {
    label: "设置",
    path: "/settings",
    icon: Settings,
    description: "维护学院系统配置",
  },
];
