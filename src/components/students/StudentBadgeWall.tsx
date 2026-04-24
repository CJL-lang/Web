import type { StudentBadges } from "../../mocks/studentProfiles";

interface StudentBadgeWallProps {
  badges: StudentBadges;
}

const featuredCardStyles = [
  "from-[color:rgba(236,171,19,0.22)] to-[color:rgba(124,92,28,0.1)]",
  "from-[color:rgba(120,148,255,0.18)] to-[color:rgba(87,102,153,0.08)]",
];

export function StudentBadgeWall({ badges }: StudentBadgeWallProps) {
  const { badgeWall, featuredMedals } = badges;
  const hasContent = featuredMedals.length > 0 || badgeWall.length > 0;

  if (!hasContent) {
    return (
      <p className="m-0 text-sm text-[var(--color-text-muted)]">
        暂无勋章记录。
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {featuredMedals.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {featuredMedals.map((medal, index) => (
            <article
              key={medal.id}
              className={`relative overflow-hidden rounded-[24px] border border-[var(--color-border-subtle)] bg-gradient-to-br p-4 ${
                featuredCardStyles[index % featuredCardStyles.length]
              }`}
            >
              <div className="absolute inset-x-4 top-0 h-px bg-[rgba(255,255,255,0.35)]" />
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] border border-[rgba(255,255,255,0.18)] bg-[rgba(22,18,10,0.24)] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                  <img
                    alt=""
                    aria-hidden
                    className="h-full w-full object-contain"
                    loading="lazy"
                    src="/logo-256.webp"
                  />
                </div>
                <div className="min-w-0">
                  <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    已获得勋章
                  </p>
                  <p className="mt-1 mb-0 text-base font-semibold text-[var(--color-text-primary)]">
                    {medal.label}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {badgeWall.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {badgeWall.map((badge) => (
            <article
              key={badge.id}
              className="rounded-[22px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-alt)] p-4 shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                    等级
                  </p>
                  <p className="m-0 text-2xl font-semibold tracking-tight text-[var(--color-brand)]">
                    {badge.rank}
                  </p>
                </div>
                <span className="rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-soft)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
                  {badge.levelScale}
                </span>
              </div>

              <p className="mt-4 mb-0 text-sm font-medium text-[var(--color-text-primary)]">
                {badge.label}
              </p>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
