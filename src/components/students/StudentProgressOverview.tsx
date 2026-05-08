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
import { cn } from "../../utils/cn";

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
    <div className="c-student-progress">
      <div className="c-student-progress__summary-panel">
        <p className="c-student-progress__lead">{overview.summary.lead}</p>
        <p className="c-student-progress__support">{overview.summary.support}</p>
      </div>

      <div className="c-student-progress__metrics">
        {overview.metrics.map((metric) => (
          <article key={metric.id} className="c-student-progress__metric-card">
            <p className="c-student-progress__metric-label">{metric.label}</p>
            <p className="c-student-progress__metric-value">{metric.value}</p>
            {metric.progress != null ? (
              <div className="c-student-progress__metric-bar-track">
                <div
                  className="c-student-progress__metric-bar-fill"
                  style={{ width: `${metric.progress}%` }}
                />
              </div>
            ) : null}
            {metric.helper ? (
              <p className="c-student-progress__metric-helper">{metric.helper}</p>
            ) : null}
          </article>
        ))}
      </div>

      <div className="c-student-progress__mode-row">
        <div className="c-student-progress__segmented">
          {[
            { id: "dimensions", label: "能力画像" },
            { id: "trends", label: "最近变化" },
          ].map((option) => {
            const isActive = viewMode === option.id;
            return (
              <button
                key={option.id}
                type="button"
                className={cn(
                  "c-student-progress__segment-btn",
                  isActive
                    ? "c-student-progress__segment-btn--active"
                    : "c-student-progress__segment-btn--inactive"
                )}
                onClick={() => setViewMode(option.id as ViewMode)}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        <span className="c-student-progress__mode-caption">
          {overview.summary.subtitle}
        </span>
      </div>

      {viewMode === "dimensions" ? (
        <div className="c-student-progress__split">
          <div className="c-student-progress__chart-panel">
            <div className="c-student-progress__chart-fixed-h">
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
        <div className="c-student-progress__split">
          <div className="c-student-progress__chart-panel">
            {activeTrend ? (
              <>
                <div className="c-student-progress__trend-head">
                  <div>
                    <p className="c-student-progress__trend-kicker">最近变化</p>
                    <h3 className="c-student-progress__trend-title">
                      {activeTrend.label}
                    </h3>
                  </div>
                  <span className="c-student-progress__trend-badge">
                    {activeTrend.changeText}
                  </span>
                </div>
                <p className="c-student-progress__trend-summary">
                  {activeTrend.summary}
                </p>
                <div className="c-student-progress__chart-fixed-h--sm">
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
    <div className="c-student-progress__dim-stack">
      <div className="c-student-progress__dim-grid">
        {dimensions.map((dimension) => {
          const isActive = dimension.id === activeDimension?.id;
          return (
            <button
              key={dimension.id}
              type="button"
              className={cn(
                "c-student-progress__pill-btn",
                isActive
                  ? "c-student-progress__pill-btn--active"
                  : "c-student-progress__pill-btn--inactive"
              )}
              onClick={() => onSelect(dimension.id)}
            >
              <div className="c-student-progress__pill-row">
                <div>
                  <p className="c-student-progress__pill-label">{dimension.title}</p>
                  <p className="c-student-progress__pill-meta">{dimension.summary}</p>
                </div>
                <span className="c-student-progress__pill-score">
                  {dimension.score.toFixed(1)}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {activeDimension ? (
        <div className="c-student-progress__detail-panel">
          <div className="c-student-progress__detail-head">
            <div>
              <p className="c-student-progress__detail-kicker">细项拆解</p>
              <h3 className="c-student-progress__detail-title">
                {activeDimension.title}
              </h3>
            </div>
            <span className="c-student-progress__detail-badge">
              {activeDimension.score.toFixed(1)} 分
            </span>
          </div>
          <p className="c-student-progress__detail-copy">{activeDimension.summary}</p>

          <div className="c-student-progress__detail-rows">
            {activeDimension.details.map((detail) => (
              <div key={detail.id} className="c-student-progress__detail-row">
                <div className="c-student-progress__detail-row-head">
                  <span className="c-student-progress__detail-row-label">
                    {detail.label}
                  </span>
                  <span className="c-student-progress__detail-row-score">
                    {detail.score} 分
                  </span>
                </div>
                <div className="c-student-progress__detail-bar-track">
                  <div
                    className="c-student-progress__detail-bar-fill"
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
    <div className="c-student-progress__trend-list">
      {trends.map((trend) => {
        const isActive = trend.id === activeTrend?.id;
        return (
          <button
            key={trend.id}
            type="button"
            className={cn(
              "c-student-progress__pill-btn c-student-progress__pill-btn--wide",
              isActive
                ? "c-student-progress__pill-btn--active"
                : "c-student-progress__pill-btn--inactive"
            )}
            onClick={() => onSelect(trend.id)}
          >
            <div className="c-student-progress__pill-row">
              <div>
                <p className="c-student-progress__pill-label">{trend.label}</p>
                <p className="c-student-progress__pill-meta--loose">{trend.summary}</p>
              </div>
              <span className="c-student-progress__pill-delta">{trend.changeText}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
