import type { ReactNode } from "react";

import { cn } from "../../utils/cn";

interface SectionCardProps {
  /** 标题上方极短说明，用于区分卡片内信息层级（如「预览 / 编辑」分区） */
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionCard({
  action,
  children,
  className,
  description,
  eyebrow,
  title,
}: SectionCardProps) {
  return (
    <section className={cn("c-section-card", className)}>
      <div className="c-section-card__header">
        <div className="c-section-card__intro">
          {eyebrow != null && eyebrow !== "" ? (
            <p className="c-section-card__eyebrow">{eyebrow}</p>
          ) : null}
          <h2 className="c-section-card__title">{title}</h2>
          {description != null && description !== "" ? (
            typeof description === "string" ? (
              <p className="c-section-card__desc">{description}</p>
            ) : (
              <div className="c-section-card__desc-slot">{description}</div>
            )
          ) : null}
        </div>
        {action ? <div className="c-section-card__action">{action}</div> : null}
      </div>
      <div className="c-section-card__body">{children}</div>
    </section>
  );
}
