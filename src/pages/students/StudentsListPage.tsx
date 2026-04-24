import { ChevronRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import { PageHeader } from "../../components/ui/PageHeader";
import { useAdminData } from "../../context/AdminDataContext";
import { cn } from "../../utils/cn";

const FILTER_ALL = "__all__";

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export function StudentsListPage() {
  const { students } = useAdminData();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(FILTER_ALL);
  const [coachFilter, setCoachFilter] = useState(FILTER_ALL);

  const statusOptions = useMemo(() => {
    const set = new Set(students.map((s) => s.status));
    return Array.from(set).sort();
  }, [students]);

  const coachOptions = useMemo(() => {
    const set = new Set(students.map((s) => s.coach));
    return Array.from(set).sort();
  }, [students]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return students.filter((student) => {
      if (statusFilter !== FILTER_ALL && student.status !== statusFilter) {
        return false;
      }
      if (coachFilter !== FILTER_ALL && student.coach !== coachFilter) {
        return false;
      }
      if (!q) {
        return true;
      }
      const haystack = normalize(
        `${student.name} ${student.id} ${student.packageName} ${student.coach} ${student.status}`
      );
      return haystack.includes(q);
    });
  }, [coachFilter, query, statusFilter, students]);

  return (
    <>
      <PageHeader
        actions={
          <Link
            className={cn(
              "inline-flex min-h-11 items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]/60",
              "bg-[var(--color-brand)] text-[var(--color-ink-strong)] shadow-[0_14px_30px_rgba(236,171,19,0.22)] hover:bg-[var(--color-brand-strong)]"
            )}
            to="/students/new"
          >
            新建学员
          </Link>
        }
        eyebrow="Students"
        title="学员管理"
      />

      <div
        className="flex flex-col gap-3 rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-soft)] p-4 md:flex-row md:flex-wrap md:items-end md:gap-4"
        role="search"
        aria-label="搜索与筛选学员"
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
            placeholder="搜索姓名、编号、课程包、教练或状态"
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
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="flex min-w-0 flex-col gap-1 sm:min-w-[9.5rem]">
            <span className="text-xs font-medium text-[var(--color-text-muted)]">
              教练
            </span>
            <select
              className="c-field-input cursor-pointer"
              onChange={(e) => setCoachFilter(e.target.value)}
              value={coachFilter}
            >
              <option value={FILTER_ALL}>全部教练</option>
              {coachOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <section aria-label="学员列表">
        {filtered.length === 0 ? (
          <p className="m-0 rounded-[24px] border border-dashed border-[var(--color-border-subtle)] bg-[var(--color-surface-soft)] px-4 py-10 text-center text-sm text-[var(--color-text-secondary)]">
            没有符合条件的学员，请调整搜索或筛选条件。
          </p>
        ) : (
          <ul className="m-0 list-none space-y-3 p-0">
            {filtered.map((student) => (
              <li key={student.id}>
                <NavLink
                  className={({ isPending }) =>
                    cn(
                      "group flex min-h-[4.5rem] items-center gap-4 rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-soft)] px-4 py-4 transition duration-200",
                      "hover:border-[color-mix(in_srgb,var(--color-border-strong)_80%,transparent)] hover:bg-[var(--color-surface-alt)]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]/55",
                      isPending && "opacity-60"
                    )
                  }
                  to={student.id}
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-base font-semibold text-[var(--color-text-primary)]">
                      {student.name}
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {student.id} · {student.packageName}
                    </p>
                  </div>
                  <div className="hidden shrink-0 text-right sm:block">
                    <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                      状态
                    </p>
                    <p className="mt-1 text-sm font-medium text-[var(--color-text-primary)]">
                      {student.status}
                    </p>
                  </div>
                  <div className="hidden text-right md:block md:min-w-[5.5rem]">
                    <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                      教练
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-text-primary)]">
                      {student.coach}
                    </p>
                  </div>
                  <ChevronRight
                    aria-hidden
                    className="h-5 w-5 shrink-0 text-[var(--color-text-muted)] transition group-hover:text-[var(--color-brand)]"
                  />
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
