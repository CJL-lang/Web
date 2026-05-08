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
    <div className="c-empty-state">
      {badge ? (
        <span className="c-empty-state__badge">{badge}</span>
      ) : null}
      <div className="c-empty-state__icon-wrap">
        <Icon size={24} />
      </div>
      <div className="c-empty-state__body">
        <h3 className="c-empty-state__title">{title}</h3>
        <p className="c-empty-state__description">{description}</p>
      </div>
    </div>
  );
}
