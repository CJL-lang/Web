import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useAdminData } from "../../context/AdminDataContext";
import {
  COURSE_OPENING_GROUP_DISPLAY_STATUSES,
  getCourseOpeningGroupDisplayStatus,
  type CourseOpeningGroup,
} from "../../mocks/courseOpenings";
import { courseOpeningGroupStatusPillClass } from "../../utils/bizStatusPills";
import { cn } from "../../utils/cn";
import {
  FILTER_ALL,
  formatIsoMinute,
  normalize,
  sortCoachesForGroupSelect,
} from "./courseOpeningViewHelpers";

export function CourseOpeningGroupsPage() {
  const {
    coaches,
    courseOpeningGroups,
    orders,
    packages,
    reassignCourseOpeningGroupCoach,
    students,
  } = useAdminData();
  const [query, setQuery] = useState("");
  const [coachFilter, setCoachFilter] = useState(FILTER_ALL);
  const [packageFilter, setPackageFilter] = useState(FILTER_ALL);
  const [statusFilter, setStatusFilter] = useState(FILTER_ALL);

  const studentById = useMemo(
    () => new Map(students.map((student) => [student.id, student])),
    [students],
  );
  const packageById = useMemo(
    () => new Map(packages.map((item) => [item.id, item])),
    [packages],
  );
  const coachById = useMemo(
    () => new Map(coaches.map((coach) => [coach.id, coach])),
    [coaches],
  );
  const coachesForGroupSelect = useMemo(
    () => sortCoachesForGroupSelect(coaches),
    [coaches],
  );

  const visibleGroups = useMemo(() => {
    const q = normalize(query);

    return courseOpeningGroups
      .filter((group) => {
        if (coachFilter !== FILTER_ALL && group.coachId !== coachFilter) {
          return false;
        }
        if (packageFilter !== FILTER_ALL && group.packageId !== packageFilter) {
          return false;
        }
        const displayStatus = getCourseOpeningGroupDisplayStatus(group, packages);
        if (statusFilter !== FILTER_ALL && displayStatus !== statusFilter) {
          return false;
        }
        if (!q) {
          return true;
        }

        const coach = coachById.get(group.coachId);
        const pkg = packageById.get(group.packageId);
        const orderTexts = group.orderIds.flatMap((orderId) => {
          const order = orders.find((item) => item.id === orderId);
          const student = order ? studentById.get(order.studentId) : undefined;
          return [orderId, order?.studentId ?? "", student?.name ?? ""];
        });

        const haystack = normalize(
          [
            group.id,
            displayStatus,
            coach?.id ?? group.coachId,
            coach?.name ?? "",
            pkg?.id ?? group.packageId,
            pkg?.name ?? "",
            ...orderTexts,
          ].join(" "),
        );
        return haystack.includes(q);
      })
      .sort((a, b) => b.openedAt.localeCompare(a.openedAt));
  }, [
    coachById,
    coachFilter,
    courseOpeningGroups,
    orders,
    packageById,
    packageFilter,
    packages,
    query,
    statusFilter,
    studentById,
  ]);

  const renderCoachSelectForGroup = (group: CourseOpeningGroup) => {
    const currentCoach = coachById.get(group.coachId);

    return (
      <select
        aria-label={`调整 ${group.id} 的教练`}
        className="c-field-input c-course-openings-group__coach-select"
        value={group.coachId}
        onChange={(event) => {
          const nextCoach = coachById.get(event.target.value);
          if (!nextCoach || nextCoach.status !== "在职") {
            return;
          }
          reassignCourseOpeningGroupCoach(group.id, nextCoach.id);
        }}
      >
        {!currentCoach ? (
          <option value={group.coachId}>未知教练</option>
        ) : null}
        {coachesForGroupSelect.map((item) => {
          const canPick =
            item.status === "在职" || item.id === group.coachId;
          const label =
            item.status === "在职"
              ? item.name
              : `${item.name}（${item.status}）`;
          return (
            <option key={item.id} disabled={!canPick} value={item.id}>
              {label}
            </option>
          );
        })}
      </select>
    );
  };

  return (
    <section aria-label="开课组列表">
      <div
        className="c-resource-list__toolbar"
        role="search"
        aria-label="搜索与筛选开课组"
      >
        <div className="c-resource-list__search-wrap">
          <Search aria-hidden className="c-resource-list__search-icon" />
          <input
            autoComplete="off"
            className="c-field-input c-resource-list__search-field"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索组号、学员、订单号、教练或套餐"
            type="search"
            value={query}
          />
        </div>

        <div className="c-resource-list__filters">
          <div className="c-resource-list__filter-field">
            <select
              aria-label="教练"
              className="c-field-input c-resource-list__filter-select"
              onChange={(event) => setCoachFilter(event.target.value)}
              value={coachFilter}
            >
              <option value={FILTER_ALL}>全部教练</option>
              {coaches.map((coach) => (
                <option key={coach.id} value={coach.id}>
                  {coach.name}
                </option>
              ))}
            </select>
          </div>

          <div className="c-resource-list__filter-field">
            <select
              aria-label="套餐"
              className="c-field-input c-resource-list__filter-select"
              onChange={(event) => setPackageFilter(event.target.value)}
              value={packageFilter}
            >
              <option value={FILTER_ALL}>全部套餐</option>
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name}
                </option>
              ))}
            </select>
          </div>

          <div className="c-resource-list__filter-field">
            <select
              aria-label="开课组状态"
              className="c-field-input c-resource-list__filter-select"
              onChange={(event) => setStatusFilter(event.target.value)}
              value={statusFilter}
            >
              <option value={FILTER_ALL}>全部状态</option>
              {COURSE_OPENING_GROUP_DISPLAY_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {visibleGroups.length === 0 ? (
        <p className="c-resource-list__empty mt-5 md:mt-6">
          没有符合条件的开课组，请调整搜索或筛选条件。
        </p>
      ) : (
        <div className="mt-5 md:mt-6">
          <ul className="c-course-openings-group-list">
          {visibleGroups.map((group) => {
            const coach = coachById.get(group.coachId);
            const pkg = packageById.get(group.packageId);
            const capacity = pkg?.coachStudentRatio ?? group.orderIds.length;
            const displayStatus = getCourseOpeningGroupDisplayStatus(
              group,
              packages,
            );

            return (
              <li key={group.id} className="c-course-openings-group">
                <div className="c-course-openings-group__header">
                  <div className="min-w-0 flex-1">
                    <Link
                      className="c-course-openings-group__row-link"
                      to={`/course-openings/groups/${encodeURIComponent(group.id)}`}
                      aria-label={`查看开课组 ${group.id} 详情`}
                    >
                      <h3 className="c-course-openings-group__title">
                        {group.id}
                      </h3>
                      <p className="c-course-openings-group__subtitle">
                        {coach?.name ?? "未知教练"} · {pkg?.name ?? "未知套餐"} ·{" "}
                        {group.orderIds.length}/{capacity} 人 ·{" "}
                        {formatIsoMinute(group.openedAt)}
                      </p>
                    </Link>
                  </div>
                  <div className="c-course-openings-group__actions">
                    <span
                      className={cn(
                        "c-order-status",
                        courseOpeningGroupStatusPillClass(displayStatus),
                      )}
                    >
                      {displayStatus}
                    </span>
                    {renderCoachSelectForGroup(group)}
                  </div>
                </div>
                <ul className="c-course-openings-group__orders">
                  {group.orderIds.map((orderId) => {
                    const order = orders.find((item) => item.id === orderId);
                    const student = order
                      ? studentById.get(order.studentId)
                      : undefined;

                    return (
                      <li key={orderId} className="c-course-openings-group__order">
                        <span className="c-course-openings-group__order-title">
                          {student?.name ?? "未知学员"}
                        </span>
                        <Link
                          className="c-course-openings-group__order-meta"
                          state={{ returnTo: "/course-openings/groups" }}
                          to={`/orders/${encodeURIComponent(orderId)}`}
                        >
                          {orderId}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
          </ul>
        </div>
      )}
    </section>
  );
}
