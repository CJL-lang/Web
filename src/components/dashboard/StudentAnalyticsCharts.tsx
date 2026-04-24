import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { SectionCard } from "../ui/SectionCard";
import type {
  StudentAgeBucket,
  StudentAttendanceTrendPoint,
  StudentGenderRatioItem,
  StudentLevelKey,
  StudentLevelTrendPoint,
} from "../../types/dashboard";

interface DashboardTooltipContentProps {
  active?: boolean;
  label?: string;
  payload?: Array<{
    name?: string;
    value?: number | string;
  }>;
}

interface StudentAgeDistributionChartProps {
  data: StudentAgeBucket[];
}

interface StudentGenderRatioChartProps {
  data: StudentGenderRatioItem[];
}

interface StudentLevelTrendChartProps {
  data: StudentLevelTrendPoint[];
}

interface StudentAverageLevelPoint {
  label: string;
  averageLevel: number;
}

interface StudentAttendanceChartProps {
  data: StudentAttendanceTrendPoint[];
}

const levelKeys: StudentLevelKey[] = [
  "L1",
  "L2",
  "L3",
  "L4",
  "L5",
  "L6",
  "L7",
  "L8",
  "L9",
];

function levelTrendToAverageSeries(
  rows: StudentLevelTrendPoint[],
): StudentAverageLevelPoint[] {
  return rows.map((row) => {
    let weighted = 0;
    let total = 0;
    for (const key of levelKeys) {
      const count = row[key];
      weighted += count * Number(key.slice(1));
      total += count;
    }
    const averageLevel =
      total > 0 ? Math.round((weighted / total) * 100) / 100 : 0;
    return {
      label: row.label,
      averageLevel,
    };
  });
}

function DashboardTooltipContent({
  active,
  label,
  payload,
}: DashboardTooltipContentProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="c-dashboard-tooltip">
      {label ? <p className="c-dashboard-tooltip__title">{label}</p> : null}
      <div className="c-dashboard-tooltip__list">
        {payload.map((item) => (
          <div
            key={`${item.name ?? "item"}-${item.value ?? "value"}`}
            className="c-dashboard-tooltip__item"
          >
            <span>{item.name}</span>
            <span className="c-dashboard-tooltip__value">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StudentAgeDistributionChart({
  data,
}: StudentAgeDistributionChartProps) {
  return (
    <SectionCard title="学员年龄分布">
      <div className="c-dashboard-chart">
        <div className="c-dashboard-chart__frame c-dashboard-chart__frame--md">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={10}>
              <CartesianGrid
                stroke="rgba(210, 199, 175, 0.08)"
                vertical={false}
              />
              <XAxis
                axisLine={false}
                dataKey="label"
                tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
                tickLine={false}
              />
              <Tooltip content={<DashboardTooltipContent />} />
              <Bar
                dataKey="male"
                fill="var(--dashboard-series-age-male)"
                name="男学员"
                radius={[10, 10, 0, 0]}
              />
              <Bar
                dataKey="female"
                fill="var(--dashboard-series-age-female)"
                name="女学员"
                radius={[10, 10, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </SectionCard>
  );
}

export function StudentGenderRatioChart({
  data,
}: StudentGenderRatioChartProps) {
  return (
    <SectionCard title="学员性别比">
      <div className="c-dashboard-chart">
        <div className="c-dashboard-chart__frame c-dashboard-chart__frame--sm">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                cx="50%"
                cy="50%"
                data={data}
                dataKey="value"
                innerRadius={68}
                nameKey="label"
                outerRadius={92}
                paddingAngle={3}
              >
                {data.map((item) => (
                  <Cell
                    key={item.id}
                    fill={`var(--dashboard-series-gender-${item.id})`}
                  />
                ))}
              </Pie>
              <Tooltip content={<DashboardTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div
          className="c-dashboard-gender-legend"
          aria-label="性别图例"
        >
          {data.map((item) => (
            <div
              key={item.id}
              className={`c-dashboard-gender-legend__item c-dashboard-gender-legend__item--${item.id}`}
            >
              <span className="c-dashboard-gender-legend__swatch" />
              <span className="c-dashboard-gender-legend__label">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

export function StudentLevelTrendChart({
  data,
}: StudentLevelTrendChartProps) {
  const chartData = levelTrendToAverageSeries(data);

  return (
    <SectionCard title="学员平均等级走势">
      <div className="c-dashboard-chart">
        <div className="c-dashboard-chart__frame c-dashboard-chart__frame--lg">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                stroke="rgba(210, 199, 175, 0.08)"
                vertical={false}
              />
              <XAxis
                axisLine={false}
                dataKey="label"
                tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
                tickLine={false}
              />
              <YAxis
                allowDecimals
                axisLine={false}
                domain={["auto", "auto"]}
                tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
                tickFormatter={(v) => (typeof v === "number" ? v.toFixed(1) : v)}
                tickLine={false}
              />
              <Tooltip content={<DashboardTooltipContent />} />
              <Line
                dataKey="averageLevel"
                dot={false}
                name="平均等级"
                stroke="var(--dashboard-series-level-5)"
                strokeWidth={3}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </SectionCard>
  );
}

export function StudentAttendanceChart({
  data,
}: StudentAttendanceChartProps) {
  return (
    <SectionCard title="每天上课人数变化">
      <div className="c-dashboard-chart">
        <div className="c-dashboard-chart__frame c-dashboard-chart__frame--md">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid
                stroke="rgba(210, 199, 175, 0.08)"
                vertical={false}
              />
              <XAxis
                axisLine={false}
                dataKey="label"
                tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
                tickLine={false}
              />
              <Tooltip content={<DashboardTooltipContent />} />
              <Line
                dataKey="value"
                dot={false}
                name="到课学员"
                stroke="var(--dashboard-series-attendance)"
                strokeWidth={3}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </SectionCard>
  );
}
