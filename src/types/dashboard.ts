export type TrendDirection = "up" | "down" | "neutral";
export type DashboardTimeRange = "30d" | "12m" | "term";
export type DashboardModuleKey = "students" | "coaches" | "revenue";
export type StudentGenderKey = "male" | "female";
export type StudentLevelKey =
  | "L1"
  | "L2"
  | "L3"
  | "L4"
  | "L5"
  | "L6"
  | "L7"
  | "L8"
  | "L9";

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

export interface DashboardTimeRangeOption {
  id: DashboardTimeRange;
  label: string;
}

export interface DashboardModuleTab {
  id: DashboardModuleKey;
  label: string;
  path: string;
}

export interface StudentSummarySnapshot {
  totalStudents: DashboardMetric;
  businessMetrics: DashboardMetric[];
}

export interface StudentAgeBucket {
  id: string;
  label: string;
  male: number;
  female: number;
}

export interface StudentGenderRatioItem {
  id: StudentGenderKey;
  label: string;
  value: number;
}

export interface StudentLevelTrendPoint {
  label: string;
  L1: number;
  L2: number;
  L3: number;
  L4: number;
  L5: number;
  L6: number;
  L7: number;
  L8: number;
  L9: number;
}

export interface StudentAttendanceTrendPoint {
  label: string;
  value: number;
}

export interface StudentStatsDataset {
  summary: StudentSummarySnapshot;
  ageBuckets: StudentAgeBucket[];
  genderRatio: StudentGenderRatioItem[];
  levelTrend: StudentLevelTrendPoint[];
  attendanceTrend: StudentAttendanceTrendPoint[];
}
