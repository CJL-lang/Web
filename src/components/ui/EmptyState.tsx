import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
}

export function EmptyState({
  badge,
  description,
  icon: Icon,
  title,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-72 flex-col items-start justify-center gap-4 rounded-[28px] border border-dashed border-[var(--color-border-subtle)] bg-[var(--color-surface-soft)] p-8">
      {badge ? (
        <span className="rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-alt)] px-3 py-1 text-xs font-medium tracking-[0.18em] text-[var(--color-brand)] uppercase">
          {badge}
        </span>
      ) : null}
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-surface-alt)] text-[var(--color-brand)]">
        <Icon size={24} />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
          {title}
        </h3>
        <p className="max-w-[56ch] text-sm leading-7 text-[var(--color-text-secondary)]">
          {description}
        </p>
      </div>
    </div>
  );
}
