import { ChevronRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import { PageHeader } from "../../components/ui/PageHeader";
import { useAdminData } from "../../context/AdminDataContext";
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
          <Link
            className={cn(
              "inline-flex min-h-11 items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]/60",
              "bg-[var(--color-brand)] text-[var(--color-ink-strong)] shadow-[0_14px_30px_rgba(236,171,19,0.22)] hover:bg-[var(--color-brand-strong)]"
            )}
            to="/coaches/new"
          >
            新建教练
          </Link>
        }
        eyebrow="Coaches"
        title="教练管理"
      />

      <div
        className="flex flex-col gap-3 rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-soft)] p-4 md:flex-row md:flex-wrap md:items-end md:gap-4"
        role="search"
        aria-label="搜索与筛选教练"
      >
        <div className="relative min-w-0 flex-1 md:min-w-[240px]">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]"
          />
          <input
            autoComplete="off"
            className="c-field-input w-full pl-10"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索姓名、编号、状态或主攻方向"
            type="search"
            value={query}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-3">
          <label className="flex min-w-0 flex-col gap-1 sm:min-w-[9.5rem]">
            <span className="text-xs font-medium text-[var(--color-text-muted)]">
              状态
            </span>
            <select
              className="c-field-input cursor-pointer"
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
          </label>
        </div>
      </div>

      <section aria-label="教练列表">
        {filtered.length === 0 ? (
          <p className="m-0 rounded-[24px] border border-dashed border-[var(--color-border-subtle)] bg-[var(--color-surface-soft)] px-4 py-10 text-center text-sm text-[var(--color-text-secondary)]">
            没有符合条件的教练，请调整搜索或筛选条件。
          </p>
        ) : (
          <ul className="m-0 list-none space-y-3 p-0">
            {filtered.map((coach) => {
              const studentCount = studentCountByCoachName.get(coach.name) ?? 0;
              return (
                <li key={coach.id}>
                  <NavLink
                    className={({ isPending }) =>
                      cn(
                        "group flex min-h-[4.5rem] items-center gap-4 rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-soft)] px-4 py-4 transition duration-200",
                        "hover:border-[color-mix(in_srgb,var(--color-border-strong)_80%,transparent)] hover:bg-[var(--color-surface-alt)]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]/55",
                        isPending && "opacity-60"
                      )
                    }
                    to={coach.id}
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="text-base font-semibold text-[var(--color-text-primary)]">
                        {coach.name}
                      </p>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        {coach.id} · {coach.title}
                      </p>
                    </div>
                    <div className="hidden shrink-0 text-right sm:block sm:max-w-[7.5rem]">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                        状态
                      </p>
                      <p className="mt-1 text-sm font-medium text-[var(--color-text-primary)]">
                        {coach.sessionStatus}
                      </p>
                    </div>
                    <div className="hidden text-right md:block md:min-w-[5.5rem]">
                      <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                        带教学员
                      </p>
                      <p className="mt-1 text-sm text-[var(--color-text-primary)]">
                        {studentCount} 人
                      </p>
                    </div>
                    <ChevronRight
                      aria-hidden
                      className="h-5 w-5 shrink-0 text-[var(--color-text-muted)] transition group-hover:text-[var(--color-brand)]"
                    />
                  </NavLink>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
