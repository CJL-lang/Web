import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";

import type { DashboardMetric } from "../../types/dashboard";

const trendIconMap = {
  down: ArrowDownRight,
  neutral: ArrowRight,
  up: ArrowUpRight,
};

const trendToneMap = {
  down: "text-[var(--color-danger)]",
  neutral: "text-[var(--color-text-secondary)]",
  up: "text-[var(--color-success)]",
};

interface StatCardProps {
  metric: DashboardMetric;
}

export function StatCard({ metric }: StatCardProps) {
  const TrendIcon = trendIconMap[metric.trend];

  return (
    <article className="rounded-[26px] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-soft)] md:p-5 lg:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm text-[var(--color-text-muted)]">{metric.label}</p>
          <p className="text-[1.9rem] font-semibold tracking-tight text-[var(--color-text-primary)] md:text-[2.15rem]">
            {metric.value}
          </p>
        </div>
        <div className={trendToneMap[metric.trend]}>
          <TrendIcon size={20} />
        </div>
      </div>
      <p className="mt-6 text-sm leading-6 text-[var(--color-text-secondary)]">
        {metric.caption}
      </p>
    </article>
  );
}
