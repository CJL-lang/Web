import { useOutletContext } from "react-router-dom";

import {
  StudentAgeDistributionChart,
  StudentAttendanceChart,
  StudentGenderRatioChart,
  StudentLevelTrendChart,
} from "../../components/dashboard/StudentAnalyticsCharts";
import { StudentOverviewPanel } from "../../components/dashboard/StudentOverviewPanel";
import { studentStatsByRange } from "../../mocks/dashboard";
import type { DashboardOutletContext } from "./DashboardPage";

export function DashboardStudentsPage() {
  const { timeRange } = useOutletContext<DashboardOutletContext>();
  const data = studentStatsByRange[timeRange];

  return (
    <div className="c-student-dashboard">
      <StudentOverviewPanel summary={data.summary} />

      <div className="c-student-dashboard__grid">
        <StudentAgeDistributionChart data={data.ageBuckets} />
        <StudentGenderRatioChart data={data.genderRatio} />
      </div>

      <StudentLevelTrendChart data={data.levelTrend} />
      <StudentAttendanceChart data={data.attendanceTrend} />
    </div>
  );
}
