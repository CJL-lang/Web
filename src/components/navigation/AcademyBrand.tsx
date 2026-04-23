import { useState } from "react";

interface AcademyBrandProps {
  compact?: boolean;
}

export function AcademyBrand({ compact = false }: AcademyBrandProps) {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <div className={`flex items-center ${compact ? "gap-0" : "gap-3"}`}>
      <div
        className={`flex items-center justify-center overflow-hidden rounded-2xl ${
          compact ? "h-12 w-12" : "h-16 w-16"
        }`}
      >
        {!logoFailed ? (
          <picture>
            <source
              type="image/webp"
              srcSet="/logo.webp 1x, /logo-256.webp 2x"
            />
            <img
              alt="高尔夫学院 LOGO"
              className="h-full w-full object-contain p-0"
              decoding="async"
              onError={() => setLogoFailed(true)}
              src="/academy-logo.svg"
            />
          </picture>
        ) : (
          <span
            className={`font-semibold tracking-[0.2em] text-[var(--color-brand)] ${
              compact ? "text-sm" : "text-base"
            }`}
          >
            GA
          </span>
        )}
      </div>
      {!compact ? (
        <div className="space-y-1">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-[var(--color-brand)]">
            Golf Academy
          </p>
          <h1 className="text-base font-semibold text-[var(--color-text-primary)]">
            高尔夫学院后台
          </h1>
        </div>
      ) : null}
    </div>
  );
}
