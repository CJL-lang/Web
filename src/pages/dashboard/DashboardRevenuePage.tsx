import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader } from "../../components/ui/PageHeader";
import { ResourceListColumnHead } from "../../components/ui/ResourceListColumnHead";
import { SectionCard } from "../../components/ui/SectionCard";
import { useAdminData } from "../../context/AdminDataContext";
import { getOrderOpeningStatus } from "../../mocks/courseOpenings";
import {
  ORDER_STATUSES,
  PAYMENT_METHODS,
  type OrderListItem,
  type OrderStatus,
} from "../../mocks/orders";
import { orderOpeningStatusPillClass } from "../../utils/bizStatusPills";
import { cn } from "../../utils/cn";
import { formatOrderDateTimeForDisplay } from "../../utils/orderDateTime";

const FILTER_ALL = "__all__";

type RevenueRange = "month" | "30d" | "12m" | "all";

const revenueRangeOptions: Array<{ id: RevenueRange; label: string }> = [
  { id: "month", label: "本月" },
  { id: "30d", label: "近30天" },
  { id: "12m", label: "近12个月" },
  { id: "all", label: "全部" },
];

const orderStatusClass: Record<OrderStatus, string> = {
  待完成: "c-order-status--pending",
  已完成: "c-order-status--success",
  已退款: "c-order-status--canceled",
  已关闭: "c-order-status--closed",
};

const chartColors = [
  "var(--revenue-series-1)",
  "var(--revenue-series-2)",
  "var(--revenue-series-3)",
  "var(--revenue-series-4)",
  "var(--revenue-series-5)",
  "var(--revenue-series-6)",
] as const;

interface RevenueRecord {
  accountingDate?: Date;
  accountingDateText: string;
  haystack: string;
  netRevenue: number;
  openingStatus: ReturnType<typeof getOrderOpeningStatus>;
  order: OrderListItem;
  packageName: string;
  pendingAmount: number;
  refundAmount: number;
  studentName: string;
}

interface RevenueChartPoint {
  label: string;
  netRevenue: number;
}

interface DistributionPoint {
  id: string;
  label: string;
  value: number;
  color: string;
}

interface DashboardTooltipContentProps {
  active?: boolean;
  label?: string;
  payload?: Array<{
    name?: string;
    value?: number | string;
  }>;
  valueFormatter?: (value: number | string) => string;
}

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

function formatCompactPrice(amount: number) {
  const abs = Math.abs(amount);
  if (abs >= 10000) {
    const value = amount / 10000;
    return `¥${Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1)}万`;
  }
  return `¥${Math.round(amount)}`;
}

function parseStoredDate(value: string | undefined): Date | undefined {
  if (!value) {
    return undefined;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function rangeStart(range: RevenueRange, now: Date): Date | undefined {
  if (range === "all") {
    return undefined;
  }
  if (range === "month") {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
  if (range === "12m") {
    return new Date(now.getFullYear(), now.getMonth() - 11, 1);
  }

  const start = new Date(now);
  start.setDate(start.getDate() - 30);
  start.setHours(0, 0, 0, 0);
  return start;
}

function isWithinRange(
  date: Date | undefined,
  range: RevenueRange,
  now: Date,
) {
  if (!date) {
    return range === "all";
  }
  const start = rangeStart(range, now);
  return !start || date >= start;
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string) {
  const [year, month] = key.split("-");
  return `${year}/${month}`;
}

function orderNetRevenue(order: OrderListItem) {
  if (order.status === "已完成") {
    return order.amount;
  }
  if (order.status === "已退款") {
    return Math.max(order.amount - (order.refundAmount ?? order.amount), 0);
  }
  return 0;
}

function orderRefundAmount(order: OrderListItem) {
  return order.status === "已退款" ? order.refundAmount ?? order.amount : 0;
}

function DashboardTooltipContent({
  active,
  label,
  payload,
  valueFormatter,
}: DashboardTooltipContentProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="c-dashboard-tooltip">
      {label ? <p className="c-dashboard-tooltip__title">{label}</p> : null}
      <div className="c-dashboard-tooltip__list">
        {payload.map((item) => {
          const value = item.value ?? "";
          return (
            <div
              key={`${item.name ?? "item"}-${String(value)}`}
              className="c-dashboard-tooltip__item"
            >
              <span>{item.name}</span>
              <span className="c-dashboard-tooltip__value">
                {valueFormatter ? valueFormatter(value) : value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChartEmpty() {
  return <p className="c-revenue-dashboard__chart-empty">暂无可展示数据。</p>;
}

function RevenueLegend({
  items,
  valueFormatter,
}: {
  items: DistributionPoint[];
  valueFormatter: (value: number) => string;
}) {
  return (
    <ul className="c-revenue-dashboard__legend" aria-label="图表图例">
      {items.map((item) => (
        <li className="c-revenue-dashboard__legend-item" key={item.id}>
          <span
            className="c-revenue-dashboard__legend-swatch"
            style={{ background: item.color }}
          />
          <span className="c-revenue-dashboard__legend-label">
            {item.label}
          </span>
          <span className="c-revenue-dashboard__legend-value">
            {valueFormatter(item.value)}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function DashboardRevenuePage() {
  const { courseOpeningGroups, orders, packages, students } = useAdminData();
  const [range, setRange] = useState<RevenueRange>("12m");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(FILTER_ALL);
  const [packageFilter, setPackageFilter] = useState(FILTER_ALL);
  const [paymentFilter, setPaymentFilter] = useState(FILTER_ALL);

  const now = useMemo(() => new Date(), []);
  const studentById = useMemo(
    () => new Map(students.map((student) => [student.id, student])),
    [students],
  );
  const packageById = useMemo(
    () => new Map(packages.map((item) => [item.id, item])),
    [packages],
  );

  const records = useMemo<RevenueRecord[]>(() => {
    return orders
      .map((order) => {
        const student = studentById.get(order.studentId);
        const pkg = packageById.get(order.packageId);
        const accountingDateText = order.paymentDate ?? order.orderDate;
        const accountingDate = parseStoredDate(accountingDateText);
        const netRevenue = orderNetRevenue(order);
        const refundAmount = orderRefundAmount(order);
        const pendingAmount = order.status === "待完成" ? order.amount : 0;
        const openingStatus = getOrderOpeningStatus(
          order.id,
          courseOpeningGroups,
        );
        const studentName = student?.name ?? "未知学员";
        const packageName = pkg?.name ?? "未知套餐";
        const haystack = normalize(
          [
            order.id,
            order.status,
            order.paymentMethod,
            order.amount.toString(),
            formatPrice(order.amount),
            netRevenue.toString(),
            refundAmount.toString(),
            order.note ?? "",
            student?.id ?? order.studentId,
            studentName,
            pkg?.id ?? order.packageId,
            packageName,
            openingStatus,
            accountingDateText,
          ].join(" "),
        );

        return {
          accountingDate,
          accountingDateText,
          haystack,
          netRevenue,
          openingStatus,
          order,
          packageName,
          pendingAmount,
          refundAmount,
          studentName,
        };
      })
      .sort((a, b) => {
        const aTime = a.accountingDate?.getTime() ?? 0;
        const bTime = b.accountingDate?.getTime() ?? 0;
        return bTime - aTime;
      });
  }, [courseOpeningGroups, orders, packageById, studentById]);

  const visibleRecords = useMemo(() => {
    const q = normalize(query);
    return records.filter((record) => {
      const order = record.order;
      if (!isWithinRange(record.accountingDate, range, now)) {
        return false;
      }
      if (statusFilter !== FILTER_ALL && order.status !== statusFilter) {
        return false;
      }
      if (packageFilter !== FILTER_ALL && order.packageId !== packageFilter) {
        return false;
      }
      if (paymentFilter !== FILTER_ALL && order.paymentMethod !== paymentFilter) {
        return false;
      }
      if (!q) {
        return true;
      }
      return record.haystack.includes(q);
    });
  }, [now, packageFilter, paymentFilter, query, range, records, statusFilter]);

  const summary = useMemo(() => {
    return visibleRecords.reduce(
      (acc, record) => {
        acc.netRevenue += record.netRevenue;
        acc.orderAmount += record.order.amount;
        acc.pendingAmount += record.pendingAmount;
        acc.refundAmount += record.refundAmount;
        if (record.order.status === "已完成") {
          acc.completedOrders += 1;
        }
        return acc;
      },
      {
        completedOrders: 0,
        netRevenue: 0,
        orderAmount: 0,
        pendingAmount: 0,
        refundAmount: 0,
      },
    );
  }, [visibleRecords]);

  const monthlyRevenueSeries = useMemo<RevenueChartPoint[]>(() => {
    const bucket = new Map<string, number>();
    for (const record of visibleRecords) {
      if (!record.accountingDate) {
        continue;
      }
      const key = monthKey(record.accountingDate);
      bucket.set(key, (bucket.get(key) ?? 0) + record.netRevenue);
    }
    return Array.from(bucket.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, netRevenue]) => ({
        label: monthLabel(key),
        netRevenue,
      }));
  }, [visibleRecords]);

  const packageRevenueSeries = useMemo<RevenueChartPoint[]>(() => {
    return packages
      .map((pkg) => {
        const netRevenue = visibleRecords.reduce(
          (sum, record) =>
            record.order.packageId === pkg.id ? sum + record.netRevenue : sum,
          0,
        );
        return { label: pkg.name, netRevenue };
      })
      .filter((item) => item.netRevenue > 0)
      .sort((a, b) => b.netRevenue - a.netRevenue);
  }, [packages, visibleRecords]);

  const statusDistribution = useMemo<DistributionPoint[]>(() => {
    return ORDER_STATUSES.map((status, index) => ({
      id: status,
      label: status,
      value: visibleRecords.filter((record) => record.order.status === status)
        .length,
      color: chartColors[index % chartColors.length],
    })).filter((item) => item.value > 0);
  }, [visibleRecords]);

  const paymentDistribution = useMemo<DistributionPoint[]>(() => {
    return PAYMENT_METHODS.map((method, index) => ({
      id: method,
      label: method,
      value: visibleRecords.filter(
        (record) => record.order.paymentMethod === method,
      ).length,
      color: chartColors[index % chartColors.length],
    })).filter((item) => item.value > 0);
  }, [visibleRecords]);

  return (
    <div className="c-revenue-dashboard">
      <PageHeader
        actions={
          <div className="c-dashboard-range" aria-label="营收统计周期">
            {revenueRangeOptions.map((item) => (
              <button
                className={cn(
                  "c-dashboard-range__button",
                  item.id === range && "is-active",
                )}
                key={item.id}
                onClick={() => setRange(item.id)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        }
        eyebrow="Revenue"
        title="营收统计"
      />

      <section className="c-revenue-dashboard__kpis" aria-label="营收核心指标">
        <div className="c-revenue-dashboard__kpi c-revenue-dashboard__kpi--primary">
          <p className="c-revenue-dashboard__kpi-label">净营收</p>
          <p className="c-revenue-dashboard__kpi-value">
            {formatPrice(summary.netRevenue)}
          </p>
        </div>
        <div className="c-revenue-dashboard__kpi">
          <p className="c-revenue-dashboard__kpi-label">订单总额</p>
          <p className="c-revenue-dashboard__kpi-value">
            {formatPrice(summary.orderAmount)}
          </p>
        </div>
        <div className="c-revenue-dashboard__kpi">
          <p className="c-revenue-dashboard__kpi-label">已完成订单</p>
          <p className="c-revenue-dashboard__kpi-value">
            {summary.completedOrders}
          </p>
        </div>
        <div className="c-revenue-dashboard__kpi">
          <p className="c-revenue-dashboard__kpi-label">待收金额</p>
          <p className="c-revenue-dashboard__kpi-value">
            {formatPrice(summary.pendingAmount)}
          </p>
        </div>
        <div className="c-revenue-dashboard__kpi">
          <p className="c-revenue-dashboard__kpi-label">退款金额</p>
          <p className="c-revenue-dashboard__kpi-value">
            {formatPrice(summary.refundAmount)}
          </p>
        </div>
      </section>

      <div className="c-revenue-dashboard__charts-grid">
        <SectionCard
          className="c-revenue-dashboard__chart-card--wide"
          title="月度净营收趋势"
        >
          {monthlyRevenueSeries.length === 0 ? (
            <ChartEmpty />
          ) : (
            <div className="c-dashboard-chart">
              <div className="c-dashboard-chart__frame c-dashboard-chart__frame--md">
                <ResponsiveContainer height="100%" width="100%">
                  <LineChart data={monthlyRevenueSeries}>
                    <CartesianGrid
                      stroke="var(--dashboard-grid-color)"
                      vertical={false}
                    />
                    <XAxis
                      axisLine={false}
                      dataKey="label"
                      tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
                      tickLine={false}
                    />
                    <YAxis
                      axisLine={false}
                      tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
                      tickFormatter={(value) => formatCompactPrice(Number(value))}
                      tickLine={false}
                    />
                    <Tooltip
                      content={
                        <DashboardTooltipContent valueFormatter={(value) =>
                          formatPrice(Number(value))
                        } />
                      }
                    />
                    <Line
                      dataKey="netRevenue"
                      dot={false}
                      name="净营收"
                      stroke="var(--revenue-series-1)"
                      strokeWidth={3}
                      type="monotone"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </SectionCard>

        <SectionCard title="套餐净营收分布">
          {packageRevenueSeries.length === 0 ? (
            <ChartEmpty />
          ) : (
            <div className="c-dashboard-chart">
              <div className="c-dashboard-chart__frame c-dashboard-chart__frame--md">
                <ResponsiveContainer height="100%" width="100%">
                  <BarChart data={packageRevenueSeries}>
                    <CartesianGrid
                      stroke="var(--dashboard-grid-color)"
                      vertical={false}
                    />
                    <XAxis
                      axisLine={false}
                      dataKey="label"
                      tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
                      tickLine={false}
                    />
                    <YAxis
                      axisLine={false}
                      tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
                      tickFormatter={(value) => formatCompactPrice(Number(value))}
                      tickLine={false}
                    />
                    <Tooltip
                      content={
                        <DashboardTooltipContent valueFormatter={(value) =>
                          formatPrice(Number(value))
                        } />
                      }
                      cursor={{
                        fill: "rgba(236, 171, 19, 0.06)",
                        stroke: "rgba(236, 171, 19, 0.22)",
                        strokeWidth: 1,
                      }}
                    />
                    <Bar
                      dataKey="netRevenue"
                      fill="var(--revenue-series-2)"
                      name="净营收"
                      radius={[10, 10, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </SectionCard>

        <SectionCard title="订单状态分布">
          {statusDistribution.length === 0 ? (
            <ChartEmpty />
          ) : (
            <div className="c-revenue-dashboard__pie-block">
              <div className="c-dashboard-chart__frame c-dashboard-chart__frame--sm">
                <ResponsiveContainer height="100%" width="100%">
                  <PieChart>
                    <Pie
                      cx="50%"
                      cy="50%"
                      data={statusDistribution}
                      dataKey="value"
                      innerRadius={68}
                      nameKey="label"
                      outerRadius={92}
                      paddingAngle={3}
                    >
                      {statusDistribution.map((item) => (
                        <Cell fill={item.color} key={item.id} />
                      ))}
                    </Pie>
                    <Tooltip content={<DashboardTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <RevenueLegend
                items={statusDistribution}
                valueFormatter={(value) => `${value} 单`}
              />
            </div>
          )}
        </SectionCard>

        <SectionCard title="支付方式分布">
          {paymentDistribution.length === 0 ? (
            <ChartEmpty />
          ) : (
            <div className="c-revenue-dashboard__pie-block">
              <div className="c-dashboard-chart__frame c-dashboard-chart__frame--sm">
                <ResponsiveContainer height="100%" width="100%">
                  <PieChart>
                    <Pie
                      cx="50%"
                      cy="50%"
                      data={paymentDistribution}
                      dataKey="value"
                      innerRadius={68}
                      nameKey="label"
                      outerRadius={92}
                      paddingAngle={3}
                    >
                      {paymentDistribution.map((item) => (
                        <Cell fill={item.color} key={item.id} />
                      ))}
                    </Pie>
                    <Tooltip content={<DashboardTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <RevenueLegend
                items={paymentDistribution}
                valueFormatter={(value) => `${value} 单`}
              />
            </div>
          )}
        </SectionCard>
      </div>

      <SectionCard title="订单明细">
        <div
          className="c-resource-list__toolbar"
          role="search"
          aria-label="搜索与筛选营收订单"
        >
          <div className="c-resource-list__search-wrap">
            <Search aria-hidden className="c-resource-list__search-icon" />
            <input
              autoComplete="off"
              className="c-field-input c-resource-list__search-field"
              onChange={(event) => setQuery(event.target.value)}
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
                onChange={(event) => setStatusFilter(event.target.value)}
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
                aria-label="支付方式"
                className="c-field-input c-resource-list__filter-select"
                onChange={(event) => setPaymentFilter(event.target.value)}
                value={paymentFilter}
              >
                <option value={FILTER_ALL}>全部支付</option>
                {PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {visibleRecords.length === 0 ? (
          <p className="c-resource-list__empty mt-5 md:mt-6">
            没有符合条件的订单，请调整搜索或筛选条件。
          </p>
        ) : (
          <div className="mt-5 md:mt-6">
            <ResourceListColumnHead
              className="c-revenue-order-list__column-head"
              columns={[
                { key: "primary", variant: "primary", label: "订单" },
                {
                  key: "net",
                  variant: "stat",
                  label: "净营收",
                  className: "c-revenue-order-list__stat",
                },
                {
                  key: "amount",
                  variant: "stat",
                  label: "订单金额",
                  className: "c-revenue-order-list__stat",
                },
                {
                  key: "status",
                  variant: "stat",
                  label: "状态",
                  className: "c-revenue-order-list__stat",
                },
                {
                  key: "pay",
                  variant: "stat",
                  label: "支付",
                  className: "c-revenue-order-list__stat",
                },
                {
                  key: "date",
                  variant: "stat",
                  label: "收入时间",
                  className: "c-revenue-order-list__date",
                },
              ]}
            />
            <ul className="c-resource-list__list">
              {visibleRecords.map((record) => {
                const order = record.order;
                return (
                  <li key={order.id}>
                    <Link
                      className="c-resource-list__row c-revenue-order-list__row"
                      state={{ returnTo: "/dashboard/revenue" }}
                      to={`/orders/${encodeURIComponent(order.id)}`}
                    >
                      <div className="c-resource-list__title-block">
                        <p className="c-resource-list__title">
                          {record.studentName}
                        </p>
                        <p className="c-resource-list__subtitle">
                          {order.id} · {record.packageName}
                        </p>
                        <p className="c-revenue-order-list__meta">
                          <span
                            className={cn(
                              "c-order-status",
                              orderOpeningStatusPillClass(record.openingStatus),
                            )}
                          >
                            {record.openingStatus}
                          </span>
                        </p>
                      </div>

                      <div className="c-resource-list__stat c-revenue-order-list__stat c-resource-list__stat--value-only">
                        <p className="c-resource-list__stat-value">
                          {formatPrice(record.netRevenue)}
                        </p>
                      </div>

                      <div className="c-resource-list__stat c-revenue-order-list__stat c-resource-list__stat--value-only">
                        <p className="c-resource-list__stat-value">
                          {formatPrice(order.amount)}
                        </p>
                      </div>

                      <div className="c-resource-list__stat c-revenue-order-list__stat c-resource-list__stat--value-only">
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

                      <div className="c-resource-list__stat c-revenue-order-list__stat c-resource-list__stat--value-only">
                        <p className="c-resource-list__stat-value--plain">
                          {order.paymentMethod}
                        </p>
                      </div>

                      <div className="c-resource-list__stat c-revenue-order-list__date c-resource-list__stat--value-only">
                        <p className="c-resource-list__stat-value--plain">
                          {formatOrderDateTimeForDisplay(
                            record.accountingDateText,
                          )}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
