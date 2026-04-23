import type { LucideIcon } from "lucide-react";
import { Plus, Search } from "lucide-react";

import { Button } from "./Button";
import { EmptyState } from "./EmptyState";
import { SectionCard } from "./SectionCard";

interface FeaturePlaceholderProps {
  badge: string;
  description: string;
  emptyDescription: string;
  emptyTitle: string;
  icon: LucideIcon;
  title: string;
}

export function FeaturePlaceholder({
  badge,
  description,
  emptyDescription,
  emptyTitle,
  icon,
  title,
}: FeaturePlaceholderProps) {
  return (
    <SectionCard
      action={
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="secondary">
            <span className="inline-flex items-center gap-2">
              <Search size={16} />
              筛选位预留
            </span>
          </Button>
          <Button variant="ghost">
            <span className="inline-flex items-center gap-2">
              <Plus size={16} />
              新增能力预留
            </span>
          </Button>
        </div>
      }
      description={description}
      title={title}
    >
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-3">
          {["列表筛选", "状态统计", "批量操作"].map((item) => (
            <div
              key={item}
              className="rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-soft)] px-5 py-4"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                预留模块
              </p>
              <p className="mt-3 text-base font-semibold text-[var(--color-text-primary)]">
                {item}
              </p>
            </div>
          ))}
        </div>

        <EmptyState
          badge={badge}
          description={emptyDescription}
          icon={icon}
          title={emptyTitle}
        />
      </div>
    </SectionCard>
  );
}
