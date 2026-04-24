import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type {
  StudentProgressDimension,
  StudentProgressOverview,
  StudentProgressTrend,
} from "../../mocks/studentProfiles";

type ViewMode = "dimensions" | "trends";

interface StudentProgressOverviewProps {
  overview: StudentProgressOverview;
}

function scoreBarWidth(score: number) {
  return `${Math.max(0, Math.min(100, score * 10))}%`;
}

export function StudentProgressOverview({
  overview,
}: StudentProgressOverviewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("dimensions");
  const [activeDimensionId, setActiveDimensionId] = useState(
    overview.dimensions[0]?.id ?? "",
  );
  const [activeTrendId, setActiveTrendId] = useState(overview.trends[0]?.id ?? "");

  const radarData = useMemo(
    () =>
      overview.dimensions.map((dimension) => ({
        axis: dimension.title,
        value: dimension.score,
      })),
    [overview.dimensions],
  );

  const activeDimension =
    overview.dimensions.find((dimension) => dimension.id === activeDimensionId) ??
    overview.dimensions[0] ??
    null;
  const activeTrend =
    overview.trends.find((trend) => trend.id === activeTrendId) ??
    overview.trends[0] ??
    null;

  return (
    <div className="space-y-5">
      <div className="rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-alt)] p-4 md:p-5">
        <p className="m-0 text-sm leading-6 text-[var(--color-text-secondary)]">
          {overview.summary.lead}
        </p>
        <p className="mt-2 mb-0 text-sm leading-6 text-[var(--color-text-muted)]">
          {overview.summary.support}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {overview.metrics.map((metric) => (
          <article
            key={metric.id}
            className="rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-alt)] p-4"
          >
            <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              {metric.label}
            </p>
            <p className="mt-2 mb-0 text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
              {metric.value}
            </p>
            {metric.progress != null ? (
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--color-surface-soft)]">
                <div
                  className="h-full rounded-full bg-[var(--color-brand)]"
                  style={{ width: `${metric.progress}%` }}
                />
              </div>
            ) : null}
            {metric.helper ? (
              <p className="mt-3 mb-0 text-sm text-[var(--color-text-secondary)]">
                {metric.helper}
              </p>
            ) : null}
          </article>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface-alt)] p-1">
          {[
            { id: "dimensions", label: "能力画像" },
            { id: "trends", label: "最近变化" },
          ].map((option) => {
            const isActive = viewMode === option.id;
            return (
              <button
                key={option.id}
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-[var(--color-brand)] text-[var(--color-ink-strong)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                }`}
                onClick={() => setViewMode(option.id as ViewMode)}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        <span className="text-sm text-[var(--color-text-muted)]">
          {overview.summary.subtitle}
        </span>
      </div>

      {viewMode === "dimensions" ? (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <div className="rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-alt)] p-4 md:p-5">
            <div className="h-[320px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  data={radarData}
                  outerRadius="72%"
                >
                  <PolarGrid stroke="rgba(210, 199, 175, 0.12)" />
                  <PolarAngleAxis
                    dataKey="axis"
                    tick={{
                      fill: "var(--color-text-muted)",
                      fontSize: 11,
                    }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 10]}
                    stroke="rgba(210, 199, 175, 0.08)"
                    tick={{ fill: "var(--color-text-muted)", fontSize: 10 }}
                  />
                  <Radar
                    dataKey="value"
                    fill="rgba(236, 171, 19, 0.28)"
                    fillOpacity={0.85}
                    name="能力画像"
                    stroke="var(--color-brand)"
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <DimensionDetailsPanel
            activeDimension={activeDimension}
            dimensions={overview.dimensions}
            onSelect={setActiveDimensionId}
          />
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <div className="rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-alt)] p-4 md:p-5">
            {activeTrend ? (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                      最近变化
                    </p>
                    <h3 className="mt-2 mb-0 text-xl font-semibold text-[var(--color-text-primary)]">
                      {activeTrend.label}
                    </h3>
                  </div>
                  <span className="rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-soft)] px-3 py-1 text-sm font-medium text-[var(--color-brand)]">
                    {activeTrend.changeText}
                  </span>
                </div>
                <p className="mt-3 mb-0 text-sm leading-6 text-[var(--color-text-secondary)]">
                  {activeTrend.summary}
                </p>
                <div className="mt-5 h-[280px] w-full min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activeTrend.points}>
                      <defs>
                        <linearGradient
                          id="student-progress-trend-fill"
                          x1="0"
                          x2="0"
                          y1="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="rgba(236,171,19,0.36)"
                          />
                          <stop
                            offset="100%"
                            stopColor="rgba(236,171,19,0.02)"
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        stroke="rgba(210, 199, 175, 0.12)"
                        vertical={false}
                      />
                      <XAxis
                        axisLine={false}
                        dataKey="label"
                        tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
                        tickLine={false}
                      />
                      <YAxis
                        axisLine={false}
                        domain={[0, 10]}
                        tick={{ fill: "var(--color-text-muted)", fontSize: 11 }}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 16,
                          border: "1px solid rgba(210, 199, 175, 0.14)",
                          background: "rgba(21, 16, 9, 0.94)",
                        }}
                        formatter={(value) => [
                          `${typeof value === "number" || typeof value === "string" ? value : "—"} 分`,
                          "得分",
                        ]}
                        labelStyle={{ color: "rgba(235, 225, 205, 0.72)" }}
                      />
                      <Area
                        dataKey="value"
                        fill="url(#student-progress-trend-fill)"
                        stroke="var(--color-brand)"
                        strokeWidth={2}
                        type="monotone"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : null}
          </div>

          <TrendListPanel
            activeTrend={activeTrend}
            onSelect={setActiveTrendId}
            trends={overview.trends}
          />
        </div>
      )}
    </div>
  );
}

function DimensionDetailsPanel({
  activeDimension,
  dimensions,
  onSelect,
}: {
  activeDimension: StudentProgressDimension | null;
  dimensions: StudentProgressDimension[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
        {dimensions.map((dimension) => {
          const isActive = dimension.id === activeDimension?.id;
          return (
            <button
              key={dimension.id}
              type="button"
              className={`rounded-[20px] border p-4 text-left transition ${
                isActive
                  ? "border-[var(--color-brand)] bg-[color:rgba(236,171,19,0.12)]"
                  : "border-[var(--color-border-subtle)] bg-[var(--color-surface-alt)] hover:border-[var(--color-border-strong)]"
              }`}
              onClick={() => onSelect(dimension.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="m-0 text-sm font-semibold text-[var(--color-text-primary)]">
                    {dimension.title}
                  </p>
                  <p className="mt-1 mb-0 text-xs text-[var(--color-text-muted)]">
                    {dimension.summary}
                  </p>
                </div>
                <span className="text-base font-semibold text-[var(--color-brand)]">
                  {dimension.score.toFixed(1)}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {activeDimension ? (
        <div className="rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-alt)] p-4 md:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                细项拆解
              </p>
              <h3 className="mt-2 mb-0 text-xl font-semibold text-[var(--color-text-primary)]">
                {activeDimension.title}
              </h3>
            </div>
            <span className="rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-soft)] px-3 py-1 text-sm font-medium text-[var(--color-brand)]">
              {activeDimension.score.toFixed(1)} 分
            </span>
          </div>
          <p className="mt-3 mb-0 text-sm leading-6 text-[var(--color-text-secondary)]">
            {activeDimension.summary}
          </p>

          <div className="mt-5 space-y-3">
            {activeDimension.details.map((detail) => (
              <div key={detail.id} className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-[var(--color-text-primary)]">
                    {detail.label}
                  </span>
                  <span className="font-medium text-[var(--color-text-secondary)]">
                    {detail.score} 分
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface-soft)]">
                  <div
                    className="h-full rounded-full bg-[var(--color-brand)]"
                    style={{ width: scoreBarWidth(detail.score) }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function TrendListPanel({
  activeTrend,
  onSelect,
  trends,
}: {
  activeTrend: StudentProgressTrend | null;
  onSelect: (id: string) => void;
  trends: StudentProgressTrend[];
}) {
  return (
    <div className="space-y-3">
      {trends.map((trend) => {
        const isActive = trend.id === activeTrend?.id;
        return (
          <button
            key={trend.id}
            type="button"
            className={`w-full rounded-[22px] border p-4 text-left transition ${
              isActive
                ? "border-[var(--color-brand)] bg-[color:rgba(236,171,19,0.12)]"
                : "border-[var(--color-border-subtle)] bg-[var(--color-surface-alt)] hover:border-[var(--color-border-strong)]"
            }`}
            onClick={() => onSelect(trend.id)}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="m-0 text-sm font-semibold text-[var(--color-text-primary)]">
                  {trend.label}
                </p>
                <p className="mt-2 mb-0 text-xs leading-5 text-[var(--color-text-muted)]">
                  {trend.summary}
                </p>
              </div>
              <span className="text-sm font-semibold text-[var(--color-brand)]">
                {trend.changeText}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
