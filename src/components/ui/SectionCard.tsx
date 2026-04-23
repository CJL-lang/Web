import type { ReactNode } from "react";

import { cn } from "../../utils/cn";

interface SectionCardProps {
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
  title,
}: SectionCardProps) {
  return (
    <section className={cn("c-section-card", className)}>
      <div className="c-section-card__header">
        <div className="c-section-card__intro">
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
