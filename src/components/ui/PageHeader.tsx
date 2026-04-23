import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({
  actions,
  description,
  eyebrow,
  title,
}: PageHeaderProps) {
  return (
    <header className="c-page-header">
      <div className="c-page-header__intro">
        {eyebrow ? <p className="c-page-header__eyebrow">{eyebrow}</p> : null}
        <div className="c-page-header__title-block">
          <h1 className="c-page-header__title">{title}</h1>
          {description ? (
            <p className="c-page-header__description">{description}</p>
          ) : null}
        </div>
      </div>
      {actions ? (
        <div className="c-page-header__actions">{actions}</div>
      ) : null}
    </header>
  );
}
