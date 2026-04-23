import type { LucideIcon } from "lucide-react";

import { EmptyState } from "./EmptyState";
import { PageHeader } from "./PageHeader";
import { SectionCard } from "./SectionCard";

interface PageScaffoldProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  badge: string;
  modules: string[];
  emptyTitle: string;
  emptyDescription: string;
}

export function PageScaffold({
  badge,
  description,
  emptyDescription,
  emptyTitle,
  eyebrow,
  icon,
  modules,
  title,
}: PageScaffoldProps) {
  return (
    <div className="space-y-5 md:space-y-6">
      <PageHeader
        description={description}
        eyebrow={eyebrow}
        title={title}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((item) => (
          <div
            key={item}
            className="rounded-[26px] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-soft)] md:p-5"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
              Module
            </p>
            <p className="mt-3 text-base font-semibold text-[var(--color-text-primary)]">
              {item}
            </p>
          </div>
        ))}
      </div>

      <SectionCard
        description="这一页暂时先保留统一骨架，后续可以继续在当前布局体系上接真实业务模块。"
        title="页面骨架"
      >
        <EmptyState
          badge={badge}
          description={emptyDescription}
          icon={icon}
          title={emptyTitle}
        />
      </SectionCard>
    </div>
  );
}
