import { ArrowDownWideNarrow, ArrowUpNarrowWide, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import { PageHeader } from "../../components/ui/PageHeader";
import { ResourceListColumnHead } from "../../components/ui/ResourceListColumnHead";
import { useAdminData } from "../../context/AdminDataContext";
import { Button } from "../../components/ui/Button";
import { ORDER_STATUSES, type OrderStatus } from "../../mocks/orders";
import { formatOrderDateTimeForDisplay } from "../../utils/orderDateTime";
import { cn } from "../../utils/cn";

const FILTER_ALL = "__all__";

type CreatedSort = "asc" | "desc";

const orderStatusClass: Record<OrderStatus, string> = {
  待完成: "c-order-status--pending",
  已完成: "c-order-status--success",
  已退款: "c-order-status--canceled",
  已关闭: "c-order-status--closed",
};

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat("zh-CN", {
    currency: "CNY",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(amount);
}

export function OrderManagementPage() {
  const { orders, packages, students } = useAdminData();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(FILTER_ALL);
  const [createdSort, setCreatedSort] = useState<CreatedSort>("desc");

  const studentById = useMemo(() => {
    const map = new Map(students.map((student) => [student.id, student]));
    return map;
  }, [students]);

  const packageById = useMemo(() => {
    const map = new Map(packages.map((item) => [item.id, item]));
    return map;
  }, [packages]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    const list = orders.filter((order) => {
      const student = studentById.get(order.studentId);
      const pkg = packageById.get(order.packageId);

      if (statusFilter !== FILTER_ALL && order.status !== statusFilter) {
        return false;
      }
      if (!q) {
        return true;
      }

      const haystack = normalize(
        [
          order.id,
          order.status,
          order.paymentMethod,
          order.orderDate,
          order.amount.toString(),
          order.note ?? "",
          student?.id ?? order.studentId,
          student?.name ?? "",
          pkg?.id ?? order.packageId,
          pkg?.name ?? "",
        ].join(" "),
      );
      return haystack.includes(q);
    });

    const dir = createdSort === "asc" ? 1 : -1;
    return [...list].sort(
      (a, b) => dir * a.createdAt.localeCompare(b.createdAt),
    );
  }, [createdSort, orders, packageById, query, statusFilter, studentById]);

  return (
    <>
      <PageHeader
        actions={
          <Link className="c-button-link-primary" to="/orders/new">
            新增订单
          </Link>
        }
        eyebrow="Commerce"
        title="订单管理"
      />

      <div
        className="c-resource-list__toolbar"
        role="search"
        aria-label="搜索与筛选订单"
      >
        <div className="c-resource-list__search-wrap">
          <Search aria-hidden className="c-resource-list__search-icon" />
          <input
            autoComplete="off"
            className="c-field-input c-resource-list__search-field"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索订单号、学员、套餐、金额或备注"
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
              {ORDER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div
            className={cn(
              "c-resource-list__filter-field",
              "c-resource-list__filter-field--sort",
            )}
          >
            <Button
              aria-label={
                createdSort === "desc"
                  ? "当前按创建时间从新到旧排序，点击切换为从旧到新"
                  : "当前按创建时间从旧到新排序，点击切换为新到旧"
              }
              className="c-resource-list__sort-toggle"
              type="button"
              variant="secondary"
              onClick={() =>
                setCreatedSort((prev) => (prev === "desc" ? "asc" : "desc"))
              }
            >
              {createdSort === "desc" ? (
                <ArrowDownWideNarrow
                  aria-hidden
                  className="c-resource-list__sort-toggle-icon"
                />
              ) : (
                <ArrowUpNarrowWide
                  aria-hidden
                  className="c-resource-list__sort-toggle-icon"
                />
              )}
              创建时间
            </Button>
          </div>
        </div>
      </div>

      <section aria-label="订单列表">
        {filtered.length === 0 ? (
          <p className="c-resource-list__empty">
            没有符合条件的订单，请调整搜索或筛选条件。
          </p>
        ) : (
          <>
            <ResourceListColumnHead
              className="c-order-list__column-head"
              columns={[
                { key: "primary", variant: "primary", label: "订单" },
                {
                  key: "amount",
                  variant: "stat",
                  label: "金额",
                  className: "c-order-list__stat",
                },
                {
                  key: "status",
                  variant: "stat",
                  label: "状态",
                  className: "c-order-list__stat",
                },
                {
                  key: "pay",
                  variant: "stat",
                  label: "支付",
                  className: "c-order-list__stat",
                },
                {
                  key: "date",
                  variant: "stat",
                  label: "创建时间",
                  className: "c-resource-list__stat--fixed",
                },
              ]}
            />
            <ul className="c-resource-list__list">
              {filtered.map((order) => {
                const student = studentById.get(order.studentId);
                const pkg = packageById.get(order.packageId);
                return (
                  <li key={order.id}>
                    <NavLink
                      aria-label={`查看订单：${order.id}`}
                      className={({ isPending }) =>
                        cn(
                          "c-resource-list__row c-order-list__row",
                          isPending && "c-resource-list__row--pending",
                        )
                      }
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

                      <div className="c-resource-list__stat c-order-list__stat c-resource-list__stat--value-only">
                        <p className="c-resource-list__stat-value">
                          {formatPrice(order.amount)}
                        </p>
                      </div>

                      <div className="c-resource-list__stat c-order-list__stat c-resource-list__stat--value-only">
                        <p className="c-resource-list__stat-value">
                          <span
                            className={cn(
                              "c-order-status",
                              orderStatusClass[order.status],
                            )}
                          >
                            {order.status}
                          </span>
                        </p>
                      </div>

                      <div className="c-resource-list__stat c-order-list__stat c-resource-list__stat--value-only">
                        <p className="c-resource-list__stat-value--plain">
                          {order.paymentMethod}
                        </p>
                      </div>

                      <div className="c-resource-list__stat c-resource-list__stat--fixed c-resource-list__stat--value-only">
                        <p className="c-resource-list__stat-value--plain">
                          {formatOrderDateTimeForDisplay(order.orderDate)}
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
