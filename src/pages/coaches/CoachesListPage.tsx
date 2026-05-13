import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import { PageHeader } from "../../components/ui/PageHeader";
import { ResourceListColumnHead } from "../../components/ui/ResourceListColumnHead";
import { useAdminData } from "../../context/AdminDataContext";
import { coachSessionStatusPillClass } from "../../utils/bizStatusPills";
import { cn } from "../../utils/cn";

const FILTER_ALL = "__all__";

const SESSION_STATUS_FILTERS = ["上课中", "空闲"] as const;

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export function CoachesListPage() {
  const { coaches, students } = useAdminData();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(FILTER_ALL);

  const studentCountByCoachName = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of students) {
      map.set(s.coach, (map.get(s.coach) ?? 0) + 1);
    }
    return map;
  }, [students]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return coaches.filter((coach) => {
      if (statusFilter !== FILTER_ALL && coach.sessionStatus !== statusFilter) {
        return false;
      }
      if (!q) {
        return true;
      }
      const haystack = normalize(
        `${coach.name} ${coach.id} ${coach.status} ${coach.focus} ${coach.title} ${coach.tagline} ${coach.phone} ${coach.sessionStatus} ${coach.specialties.join(" ")}`
      );
      return haystack.includes(q);
    });
  }, [coaches, query, statusFilter]);

  return (
    <>
      <PageHeader
        actions={
          <Link className="c-button-link-primary" to="/coaches/new">
            新建教练
          </Link>
        }
        eyebrow="Coaches"
        title="教练管理"
      />

      <div
        className="c-resource-list__toolbar"
        role="search"
        aria-label="搜索与筛选教练"
      >
        <div className="c-resource-list__search-wrap">
          <Search aria-hidden className="c-resource-list__search-icon" />
          <input
            autoComplete="off"
            className="c-field-input c-resource-list__search-field"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索姓名、编号、状态或主攻方向"
            type="search"
            value={query}
          />
        </div>

        <div className="c-resource-list__filters">
          <div className="c-resource-list__filter-field">
            <select
              aria-label="状态"
              className="c-field-input c-resource-list__filter-select"
              onChange={(e) => setStatusFilter(e.target.value)}
              value={statusFilter}
            >
              <option value={FILTER_ALL}>全部状态</option>
              {SESSION_STATUS_FILTERS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <section aria-label="教练列表">
        {filtered.length === 0 ? (
          <p className="c-resource-list__empty">
            没有符合条件的教练，请调整搜索或筛选条件。
          </p>
        ) : (
          <>
            <ResourceListColumnHead
              columns={[
                { key: "primary", variant: "primary", label: "教练" },
                {
                  key: "session",
                  variant: "stat",
                  label: "状态",
                  className:
                    "c-resource-list__stat--coach-col c-resource-list__stat--col",
                },
                {
                  key: "students",
                  variant: "stat",
                  label: "带教学员",
                  className: "c-resource-list__stat--col",
                },
              ]}
            />
            <ul className="c-resource-list__list">
              {filtered.map((coach) => {
                const studentCount =
                  studentCountByCoachName.get(coach.name) ?? 0;
                return (
                  <li key={coach.id}>
                    <NavLink
                      className={({ isPending }) =>
                        cn(
                          "c-resource-list__row",
                          isPending && "c-resource-list__row--pending"
                        )
                      }
                      to={coach.id}
                    >
                      <div className="c-resource-list__title-block">
                        <p className="c-resource-list__title">{coach.name}</p>
                        <p className="c-resource-list__subtitle">
                          {coach.id} · {coach.title}
                        </p>
                      </div>
                      <div className="c-resource-list__stat c-resource-list__stat--coach-col c-resource-list__stat--col c-resource-list__stat--value-only">
                        <p className="c-resource-list__stat-value">
                          <span
                            className={cn(
                              "c-order-status",
                              coachSessionStatusPillClass(
                                coach.sessionStatus,
                              ),
                            )}
                          >
                            {coach.sessionStatus}
                          </span>
                        </p>
                      </div>
                      <div className="c-resource-list__stat c-resource-list__stat--col c-resource-list__stat--value-only">
                        <p className="c-resource-list__stat-value--plain">
                          {studentCount} 人
                        </p>
                      </div>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>
    </>
  );
}
