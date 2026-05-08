import { ChevronRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import { PageHeader } from "../../components/ui/PageHeader";
import { useAdminData } from "../../context/AdminDataContext";
import { normalizeEnrollmentStatus } from "../../mocks/students";
import { cn } from "../../utils/cn";

const FILTER_ALL = "__all__";

/** 与 mocks/students 中学员 status 取值一致 */
const STUDENT_STATUS_FILTERS = ["正式学员", "已过期"] as const;

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export function StudentsListPage() {
  const { students } = useAdminData();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(FILTER_ALL);
  const [coachFilter, setCoachFilter] = useState(FILTER_ALL);

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
          <Link className="c-button-link-primary" to="/students/new">
            新建学员
          </Link>
        }
        eyebrow="Students"
        title="学员管理"
      />

      <div
        className="c-resource-list__toolbar"
        role="search"
        aria-label="搜索与筛选学员"
      >
        <div className="c-resource-list__search-wrap">
          <Search aria-hidden className="c-resource-list__search-icon" />
          <input
            autoComplete="off"
            className="c-field-input c-resource-list__search-field"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索姓名、编号、课程包、教练或状态"
            type="search"
            value={query}
          />
        </div>

        <div className="c-resource-list__filters">
          <label className="c-resource-list__filter-field">
            <span className="c-resource-list__filter-label">状态</span>
            <select
              className="c-field-input c-resource-list__filter-select"
              onChange={(e) => setStatusFilter(e.target.value)}
              value={statusFilter}
            >
              <option value={FILTER_ALL}>全部状态</option>
              {STUDENT_STATUS_FILTERS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="c-resource-list__filter-field">
            <span className="c-resource-list__filter-label">教练</span>
            <select
              className="c-field-input c-resource-list__filter-select"
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
          <p className="c-resource-list__empty">
            没有符合条件的学员，请调整搜索或筛选条件。
          </p>
        ) : (
          <ul className="c-resource-list__list">
            {filtered.map((student) => (
              <li key={student.id}>
                <NavLink
                  className={({ isPending }) =>
                    cn(
                      "group c-resource-list__row",
                      isPending && "c-resource-list__row--pending"
                    )
                  }
                  to={student.id}
                >
                  <div className="c-resource-list__title-block">
                    <p className="c-resource-list__title">{student.name}</p>
                    <p className="c-resource-list__subtitle">
                      {student.id} · {student.packageName}
                    </p>
                  </div>
                  <div className="c-resource-list__stat">
                    <p className="c-resource-list__stat-label">状态</p>
                    <p className="c-resource-list__stat-value">
                      {normalizeEnrollmentStatus(student.status)}
                    </p>
                  </div>
                  <div className="c-resource-list__stat c-resource-list__stat--fixed">
                    <p className="c-resource-list__stat-label">教练</p>
                    <p className="c-resource-list__stat-value--plain">
                      {student.coach}
                    </p>
                  </div>
                  <ChevronRight
                    aria-hidden
                    className="c-resource-list__chevron"
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
