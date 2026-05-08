import { useState } from "react";

import {
  StudentAgeDistributionChart,
  StudentAttendanceChart,
  StudentGenderRatioChart,
  StudentLevelTrendChart,
} from "../../components/dashboard/StudentAnalyticsCharts";
import { StudentOverviewPanel } from "../../components/dashboard/StudentOverviewPanel";
import { studentStatsByRange } from "../../mocks/dashboard";
import type { DashboardTimeRange } from "../../types/dashboard";

/** 汇总与年龄 / 性别分布固定使用当前「近30天」口径，与各图表独立的周期互不联动。 */
const BASE_RANGE: DashboardTimeRange = "30d";

export function DashboardStudentsPage() {
  const base = studentStatsByRange[BASE_RANGE];
  const [levelRange, setLevelRange] = useState<DashboardTimeRange>("30d");
  const [attendanceRange, setAttendanceRange] =
    useState<DashboardTimeRange>("30d");

  return (
    <div className="c-student-dashboard">
      <StudentOverviewPanel summary={base.summary} />

      <div className="c-student-dashboard__grid">
        <StudentAgeDistributionChart data={base.ageBuckets} />
        <StudentGenderRatioChart data={base.genderRatio} />
      </div>

      <StudentLevelTrendChart
        data={studentStatsByRange[levelRange].levelTrend}
        onTimeRangeChange={setLevelRange}
        timeRange={levelRange}
      />
      <StudentAttendanceChart
        data={studentStatsByRange[attendanceRange].attendanceTrend}
        onTimeRangeChange={setAttendanceRange}
        timeRange={attendanceRange}
      />
    </div>
  );
}
