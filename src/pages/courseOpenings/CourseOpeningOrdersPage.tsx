import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { ResourceListColumnHead } from "../../components/ui/ResourceListColumnHead";
import { useAdminData } from "../../context/AdminDataContext";
import {
  ORDER_OPENING_STATUSES,
  findCourseOpeningGroupByOrderId,
  getOrderOpeningStatus,
  type OrderOpeningStatus,
} from "../../mocks/courseOpenings";
import type { OrderStatus } from "../../mocks/orders";
import { orderOpeningStatusPillClass } from "../../utils/bizStatusPills";
import { cn } from "../../utils/cn";
import { formatOrderDateTimeForDisplay } from "../../utils/orderDateTime";
import {
  FILTER_ALL,
  createOrderGroupMap,
  normalize,
} from "./courseOpeningViewHelpers";

const orderPaymentStatusClass: Record<OrderStatus, string> = {
  待完成: "c-order-status--pending",
  已完成: "c-order-status--success",
};

export function CourseOpeningOrdersPage() {
  const { coaches, courseOpeningGroups, orders, packages, students } =
    useAdminData();
  const [orderQuery, setOrderQuery] = useState("");
  const [orderOpeningFilter, setOrderOpeningFilter] = useState(FILTER_ALL);
  const [orderCoachFilter, setOrderCoachFilter] = useState(FILTER_ALL);
  const [orderPackageFilter, setOrderPackageFilter] = useState(FILTER_ALL);

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
  const orderGroupByOrderId = useMemo(
    () => createOrderGroupMap(courseOpeningGroups),
    [courseOpeningGroups],
  );

  const visibleOrders = useMemo(() => {
    const q = normalize(orderQuery);

    return orders
      .filter((order) => !order.closedAt)
      .filter((order) => order.status === "已完成")
      .filter((order) => {
        const group = orderGroupByOrderId.get(order.id);
        const openingStatus = getOrderOpeningStatus(
          order.id,
          courseOpeningGroups,
        );
        const coach = group ? coachById.get(group.coachId) : undefined;
        const pkg = packageById.get(order.packageId);
        const student = studentById.get(order.studentId);

        if (
          orderOpeningFilter !== FILTER_ALL &&
          openingStatus !== orderOpeningFilter
        ) {
          return false;
        }
        if (orderCoachFilter !== FILTER_ALL && group?.coachId !== orderCoachFilter) {
          return false;
        }
        if (
          orderPackageFilter !== FILTER_ALL &&
          order.packageId !== orderPackageFilter
        ) {
          return false;
        }
        if (!q) {
          return true;
        }

        const haystack = normalize(
          [
            order.id,
            order.status,
            openingStatus,
            student?.name ?? "",
            student?.id ?? order.studentId,
            pkg?.name ?? "",
            pkg?.id ?? order.packageId,
            coach?.name ?? "",
            coach?.id ?? "",
            group?.id ?? "",
          ].join(" "),
        );
        return haystack.includes(q);
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [
    coachById,
    courseOpeningGroups,
    orderCoachFilter,
    orderGroupByOrderId,
    orderOpeningFilter,
    orderPackageFilter,
    orderQuery,
    orders,
    packageById,
    studentById,
  ]);

  return (
    <section aria-label="订单开课状态">
      <div
        className="c-resource-list__toolbar"
        role="search"
        aria-label="搜索与筛选开课订单"
      >
        <div className="c-resource-list__search-wrap">
          <Search aria-hidden className="c-resource-list__search-icon" />
          <input
            autoComplete="off"
            className="c-field-input c-resource-list__search-field"
            onChange={(event) => setOrderQuery(event.target.value)}
            placeholder="搜索学员、订单号、套餐、教练或开课组"
            type="search"
            value={orderQuery}
          />
        </div>

        <div className="c-resource-list__filters">
          <div className="c-resource-list__filter-field">
            <select
              aria-label="开课状态"
              className="c-field-input c-resource-list__filter-select"
              onChange={(event) => setOrderOpeningFilter(event.target.value)}
              value={orderOpeningFilter}
            >
              <option value={FILTER_ALL}>全部开课状态</option>
              {ORDER_OPENING_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="c-resource-list__filter-field">
            <select
              aria-label="教练"
              className="c-field-input c-resource-list__filter-select"
              onChange={(event) => setOrderCoachFilter(event.target.value)}
              value={orderCoachFilter}
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
              onChange={(event) => setOrderPackageFilter(event.target.value)}
              value={orderPackageFilter}
            >
              <option value={FILTER_ALL}>全部套餐</option>
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {visibleOrders.length === 0 ? (
        <p className="c-resource-list__empty mt-5 md:mt-6">
          没有符合条件的订单，请调整搜索或筛选条件。
        </p>
      ) : (
        <div className="mt-5 md:mt-6">
          <ResourceListColumnHead
            className="c-course-openings-order-list__column-head"
            columns={[
              { key: "primary", variant: "primary", label: "订单" },
              {
                key: "pay",
                variant: "stat",
                label: "支付",
                className: "c-course-openings-order-list__stat",
              },
              {
                key: "opening",
                variant: "stat",
                label: "开课",
                className: "c-course-openings-order-list__stat",
              },
              {
                key: "coach",
                variant: "stat",
                label: "教练",
                className: "c-course-openings-order-list__stat",
              },
              {
                key: "date",
                variant: "stat",
                label: "订单时间",
                className: "c-course-openings-order-list__date",
              },
            ]}
          />
          <ul className="c-resource-list__list">
            {visibleOrders.map((order) => {
              const group = findCourseOpeningGroupByOrderId(
                order.id,
                courseOpeningGroups,
              );
              const openingStatus: OrderOpeningStatus = getOrderOpeningStatus(
                order.id,
                courseOpeningGroups,
              );
              const coach = group ? coachById.get(group.coachId) : undefined;
              const student = studentById.get(order.studentId);
              const pkg = packageById.get(order.packageId);

              return (
                <li key={order.id}>
                  <Link
                    className="c-resource-list__row c-course-openings-order-list__row"
                    state={{ fromCourseOpeningsOrders: true }}
                    to={`/orders/${encodeURIComponent(order.id)}`}
                  >
                    <div className="c-resource-list__title-block">
                      <p className="c-resource-list__title">
                        {student?.name ?? "未知学员"}
                      </p>
                      <p className="c-resource-list__subtitle">
                        {order.id} · {pkg?.name ?? "未知套餐"}
                      </p>
                    </div>

                    <div className="c-resource-list__stat c-course-openings-order-list__stat c-resource-list__stat--value-only">
                      <p className="c-resource-list__stat-value">
                        <span
                          className={cn(
                            "c-order-status",
                            orderPaymentStatusClass[order.status],
                          )}
                        >
                          {order.status}
                        </span>
                      </p>
                    </div>

                    <div className="c-resource-list__stat c-course-openings-order-list__stat c-resource-list__stat--value-only">
                      <p className="c-resource-list__stat-value">
                        <span
                          className={cn(
                            "c-order-status",
                            orderOpeningStatusPillClass(openingStatus),
                          )}
                        >
                          {openingStatus}
                        </span>
                      </p>
                    </div>

                    <div className="c-resource-list__stat c-course-openings-order-list__stat c-resource-list__stat--value-only">
                      <p className="c-resource-list__stat-value--plain">
                        {coach?.name ?? "未绑定"}
                      </p>
                    </div>

                    <div className="c-resource-list__stat c-course-openings-order-list__date c-resource-list__stat--value-only">
                      <p className="c-resource-list__stat-value--plain">
                        {formatOrderDateTimeForDisplay(order.orderDate)}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
