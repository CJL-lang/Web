export type TrendDirection = "up" | "down" | "neutral";

export interface DashboardMetric {
  id: string;
  label: string;
  value: string;
  caption: string;
  trend: TrendDirection;
}

export interface InsightItem {
  id: string;
  title: string;
  description: string;
  value: string;
}
