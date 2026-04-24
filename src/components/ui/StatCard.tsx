import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";

import type { DashboardMetric } from "../../types/dashboard";
import { cn } from "../../utils/cn";

const trendIconMap = {
  down: ArrowDownRight,
  neutral: ArrowRight,
  up: ArrowUpRight,
};

interface StatCardProps {
  metric: DashboardMetric;
  showCaption?: boolean;
  showTrend?: boolean;
}

export function StatCard({
  metric,
  showCaption = true,
  showTrend = true,
}: StatCardProps) {
  const TrendIcon = trendIconMap[metric.trend];

  return (
    <article
      className={cn(
        "c-stat-card",
        !showCaption && !showTrend && "c-stat-card--kpi"
      )}
    >
      <div
        className={cn(
          "c-stat-card__header",
          !showTrend && "c-stat-card__header--solo"
        )}
      >
        <div>
          <p className="c-stat-card__label">{metric.label}</p>
          <p className="c-stat-card__value">{metric.value}</p>
        </div>
        {showTrend ? (
          <div
            className={cn(
              "c-stat-card__trend",
              `c-stat-card__trend--${metric.trend}`
            )}
          >
            <TrendIcon size={20} />
          </div>
        ) : null}
      </div>
      {showCaption ? (
        <p className="c-stat-card__caption">{metric.caption}</p>
      ) : null}
    </article>
  );
}
