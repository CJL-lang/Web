import type { DashboardMetric, InsightItem } from "../types/dashboard";

export const dashboardMetrics: DashboardMetric[] = [
  {
    id: "students",
    label: "学员总数",
    value: "1,286",
    caption: "本月新增 54 人，续课率保持稳定",
    trend: "up",
  },
  {
    id: "coaches",
    label: "教练总数",
    value: "46",
    caption: "全职 28 人，兼职 18 人",
    trend: "neutral",
  },
  {
    id: "revenue",
    label: "本月营收",
    value: "¥368,000",
    caption: "较上月增长 12.6%",
    trend: "up",
  },
];

export const dashboardInsights: InsightItem[] = [
  {
    id: "classes",
    title: "课程排期密度",
    value: "82%",
    description: "周末时段接近满额，适合后续增加高需求课程。",
  },
  {
    id: "retention",
    title: "复购观察",
    value: "67%",
    description: "老学员复购集中在 4-8 周窗口，可作为消息触达重点。",
  },
  {
    id: "leads",
    title: "潜在线索",
    value: "39",
    description: "高意向咨询主要来自体验课转正式课链路。",
  },
];
