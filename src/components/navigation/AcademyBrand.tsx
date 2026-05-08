import { useState } from "react";

import { cn } from "../../utils/cn";

interface AcademyBrandProps {
  compact?: boolean;
}

export function AcademyBrand({ compact = false }: AcademyBrandProps) {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <div className={cn("c-academy-brand", compact && "c-academy-brand--compact")}>
      <div
        className={cn(
          "c-academy-brand__figure",
          compact ? "c-academy-brand__figure--sm" : "c-academy-brand__figure--lg"
        )}
      >
        {!logoFailed ? (
          <picture>
            <source
              type="image/webp"
              srcSet="/logo.webp 1x, /logo-256.webp 2x"
            />
            <img
              alt="高尔夫学院 LOGO"
              className="c-academy-brand__img"
              decoding="async"
              onError={() => setLogoFailed(true)}
              src="/academy-logo.svg"
            />
          </picture>
        ) : (
          <span
            className={cn(
              "c-academy-brand__fallback",
              compact ? "c-academy-brand__fallback--sm" : "c-academy-brand__fallback--lg"
            )}
          >
            GA
          </span>
        )}
      </div>
      {!compact ? (
        <div className="c-academy-brand__titles">
          <p className="c-academy-brand__eyebrow">Golf Academy</p>
          <h1 className="c-academy-brand__heading">高尔夫学院后台</h1>
        </div>
      ) : null}
    </div>
  );
}
