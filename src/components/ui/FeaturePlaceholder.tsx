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
        <div className="c-feature-placeholder__actions">
          <Button variant="secondary">
            <span className="c-feature-placeholder__btn-inner">
              <Search size={16} />
              筛选位预留
            </span>
          </Button>
          <Button variant="ghost">
            <span className="c-feature-placeholder__btn-inner">
              <Plus size={16} />
              新增能力预留
            </span>
          </Button>
        </div>
      }
      description={description}
      title={title}
    >
      <div className="c-feature-placeholder__stack">
        <div className="c-feature-placeholder__metric-grid">
          {["列表筛选", "状态统计", "批量操作"].map((item) => (
            <div key={item} className="c-feature-placeholder__metric-cell">
              <p className="c-feature-placeholder__metric-kicker">预留模块</p>
              <p className="c-feature-placeholder__metric-title">{item}</p>
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
