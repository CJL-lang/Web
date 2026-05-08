import type { StudentBadges } from "../../mocks/studentProfiles";
import { cn } from "../../utils/cn";

interface StudentBadgeWallProps {
  badges: StudentBadges;
}

const FEATURED_TONES = [
  "c-badge-wall__featured-card--tone-a",
  "c-badge-wall__featured-card--tone-b",
] as const;

export function StudentBadgeWall({ badges }: StudentBadgeWallProps) {
  const { badgeWall, featuredMedals } = badges;
  const hasContent = featuredMedals.length > 0 || badgeWall.length > 0;

  if (!hasContent) {
    return (
      <p className="c-badge-wall__empty">
        暂无勋章记录。
      </p>
    );
  }

  return (
    <div className="c-badge-wall">
      {featuredMedals.length > 0 ? (
        <div className="c-badge-wall__featured-grid">
          {featuredMedals.map((medal, index) => (
            <article
              key={medal.id}
              className={cn(
                "c-badge-wall__featured-card",
                FEATURED_TONES[index % FEATURED_TONES.length]
              )}
            >
              <div className="c-badge-wall__featured-row">
                <img
                  alt=""
                  aria-hidden
                  className="c-badge-wall__icon-img"
                  loading="lazy"
                  src="/logo-256.webp"
                />
                <div className="c-badge-wall__featured-copy">
                  <p className="c-badge-wall__featured-kicker">已获得勋章</p>
                  <p className="c-badge-wall__featured-title">{medal.label}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {badgeWall.length > 0 ? (
        <section
          className="c-badge-wall__skills-panel"
          aria-labelledby="student-badge-wall-skills-heading"
        >
          <div className="c-badge-wall__skills-panel-head">
            <h3
              id="student-badge-wall-skills-heading"
              className="c-badge-wall__skills-panel-title"
            >
              技能等级明细
            </h3>
            <span className="c-badge-wall__skills-panel-count">
              {badgeWall.length} 项
            </span>
          </div>

          <div className="c-badge-wall__table-scroll">
            <table className="c-badge-wall__table">
              <thead>
                <tr>
                  <th scope="col" className="c-badge-wall__th">
                    技能项目
                  </th>
                  <th scope="col" className="c-badge-wall__th c-badge-wall__th--narrow">
                    当前等级
                  </th>
                  <th scope="col" className="c-badge-wall__th c-badge-wall__th--narrow">
                    等级区间
                  </th>
                </tr>
              </thead>
              <tbody>
                {badgeWall.map((badge) => (
                  <tr key={badge.id} className="c-badge-wall__tr">
                    <td className="c-badge-wall__td c-badge-wall__td--skill">
                      {badge.label}
                    </td>
                    <td className="c-badge-wall__td c-badge-wall__td--rank">
                      <span className="c-badge-wall__rank-chip">{badge.rank}</span>
                    </td>
                    <td className="c-badge-wall__td c-badge-wall__td--scale">
                      <span className="c-badge-wall__scale-chip">
                        {badge.levelScale}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  );
}
