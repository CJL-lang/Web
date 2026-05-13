import { ChevronLeft, Pencil } from "lucide-react";
import { useMemo, useRef, type ReactNode } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { useAdminData } from "../../context/AdminDataContext";
import {
  findCourseOpeningGroupByOrderId,
  getCourseOpeningGroupDisplayStatus,
  getOrderOpeningStatus,
  type CourseOpeningGroupDisplayStatus,
  type OrderOpeningStatus,
} from "../../mocks/courseOpenings";
import type { OrderStatus } from "../../mocks/orders";
import {
  courseOpeningGroupStatusPillClass,
  orderOpeningStatusPillClass,
} from "../../utils/bizStatusPills";
import { formatOrderDateTimeForDisplay } from "../../utils/orderDateTime";
import { cn } from "../../utils/cn";

const orderStatusClass: Record<OrderStatus, string> = {
  待完成: "c-order-status--pending",
  已完成: "c-order-status--success",
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("zh-CN", {
    currency: "CNY",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(amount);
}

function OrderStatusPill({ status }: { status: OrderStatus }) {
  return (
    <span className={cn("c-order-status", orderStatusClass[status])}>
      {status}
    </span>
  );
}

function OrderOpeningStatusPill({ status }: { status: OrderOpeningStatus }) {
  return (
    <span className={cn("c-order-status", orderOpeningStatusPillClass(status))}>
      {status}
    </span>
  );
}

function CourseOpeningGroupStatusPill({
  status,
}: {
  status: CourseOpeningGroupDisplayStatus;
}) {
  return (
    <span className={cn("c-order-status", courseOpeningGroupStatusPillClass(status))}>
      {status}
    </span>
  );
}

function formatIsoMinute(input: string) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return "未知时间";
  }
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function DetailTableRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <tr>
      <th className="c-order-detail-table__label" scope="row">
        {label}
      </th>
      <td className="c-order-detail-table__value">{value}</td>
    </tr>
  );
}

type OrderDetailLocationState = {
  fromCourseOpeningsOrders?: boolean;
};

function ordersListPathFromState(state: unknown): "/orders" | "/course-openings/orders" {
  if (
    state &&
    typeof state === "object" &&
    (state as OrderDetailLocationState).fromCourseOpeningsOrders === true
  ) {
    return "/course-openings/orders";
  }
  return "/orders";
}

export function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const ordersListPath = ordersListPathFromState(location.state);
  const closeDialogRef = useRef<HTMLDialogElement>(null);
  const { closeOrder, coaches, courseOpeningGroups, orders, packages, students } =
    useAdminData();

  const order = useMemo(
    () => (orderId ? orders.find((item) => item.id === orderId) : undefined),
    [orderId, orders],
  );

  const student = useMemo(
    () =>
      order ? students.find((item) => item.id === order.studentId) : undefined,
    [order, students],
  );

  const pkg = useMemo(
    () =>
      order ? packages.find((item) => item.id === order.packageId) : undefined,
    [order, packages],
  );

  const openingGroup = useMemo(
    () =>
      order
        ? findCourseOpeningGroupByOrderId(order.id, courseOpeningGroups)
        : undefined,
    [courseOpeningGroups, order],
  );

  const openingStatus = order
    ? getOrderOpeningStatus(order.id, courseOpeningGroups)
    : "未开启";

  const openingCoach = openingGroup
    ? coaches.find((coach) => coach.id === openingGroup.coachId)
    : undefined;
  const openingGroupStatus = openingGroup
    ? getCourseOpeningGroupDisplayStatus(openingGroup, packages)
    : undefined;

  if (!orderId || !order || order.closedAt) {
    return <Navigate replace to="/orders" />;
  }

  const canEditOrClose = order.status === "待完成";

  const confirmClose = () => {
    closeOrder(order.id);
    closeDialogRef.current?.close();
    navigate("/orders");
  };

  return (
    <>
      <PageHeader
        actions={
          <div className="c-order-detail__header-actions">
            {canEditOrClose ? (
              <>
                <Link
                  className="c-button-link-primary c-order-detail__edit-link"
                  to={`/orders/${encodeURIComponent(order.id)}/edit`}
                >
                  <Pencil aria-hidden className="c-order-detail__action-icon" />
                  编辑订单
                </Link>
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => closeDialogRef.current?.showModal()}
                >
                  关闭订单
                </Button>
              </>
            ) : null}
          </div>
        }
        eyebrow="Commerce"
        title="订单详情"
      />

      <div className="c-order-detail__toolbar">
        <Link className="c-order-detail__back-link" to={ordersListPath}>
          <ChevronLeft aria-hidden className="c-order-detail__back-icon" />
          {ordersListPath === "/course-openings/orders"
            ? "返回开课订单"
            : "返回订单列表"}
        </Link>
      </div>

      <section
        aria-labelledby="order-detail-table-title"
        className="c-order-detail-table-card"
      >
        <h2 className="c-order-detail-table-card__title" id="order-detail-table-title">
          订单明细
        </h2>
        <table className="c-order-detail-table">
          <tbody>
            <DetailTableRow label="订单号" value={order.id} />
            <DetailTableRow
              label="订单状态"
              value={<OrderStatusPill status={order.status} />}
            />
            <DetailTableRow
              label="开课状态"
              value={<OrderOpeningStatusPill status={openingStatus} />}
            />
            <DetailTableRow
              label="绑定教练"
              value={openingCoach?.name ?? "未绑定"}
            />
            <DetailTableRow
              label="开课组编号"
              value={openingGroup?.id ?? "未开启"}
            />
            <DetailTableRow
              label="开课组状态"
              value={
                openingGroupStatus ? (
                  <CourseOpeningGroupStatusPill status={openingGroupStatus} />
                ) : (
                  "未开启"
                )
              }
            />
            <DetailTableRow
              label="开启时间"
              value={openingGroup ? formatIsoMinute(openingGroup.openedAt) : "未开启"}
            />
            <DetailTableRow label="订单金额" value={formatPrice(order.amount)} />
            <DetailTableRow label="学员" value={student?.name ?? "未知学员"} />
            <DetailTableRow label="学员编号" value={order.studentId} />
            <DetailTableRow label="套餐" value={pkg?.name ?? "未知套餐"} />
            <DetailTableRow
              label="班型"
              value={pkg ? `1 对 ${pkg.coachStudentRatio}` : "未知班型"}
            />
            <DetailTableRow
              label="课时"
              value={pkg ? `${pkg.lessonCount} 节` : "未知课时"}
            />
            <DetailTableRow label="套餐编号" value={order.packageId} />
            <DetailTableRow
              label="订单创建时间"
              value={formatOrderDateTimeForDisplay(order.orderDate)}
            />
            <DetailTableRow label="支付方式" value={order.paymentMethod} />
            <DetailTableRow
              label="订单凭证"
              value={
                order.paymentVoucher ? (
                  <div className="c-order-detail-voucher">
                    <img
                      alt="订单凭证"
                      className="c-order-detail-voucher__image"
                      src={order.paymentVoucher.dataUrl}
                    />
                    <span className="c-order-detail-voucher__name">
                      {order.paymentVoucher.fileName}
                    </span>
                  </div>
                ) : (
                  "未上传"
                )
              }
            />
            <DetailTableRow
              label="订单支付时间"
              value={
                order.paymentDate
                  ? formatOrderDateTimeForDisplay(order.paymentDate)
                  : "未记录"
              }
            />
            <DetailTableRow label="更新时间" value={order.updatedAt.slice(0, 10)} />
            <DetailTableRow
              label="备注"
              value={<span className="c-order-detail-table__note">{order.note ?? "暂无备注"}</span>}
            />
          </tbody>
        </table>
      </section>

      <dialog
        ref={closeDialogRef}
        aria-labelledby="order-close-dialog-title"
        aria-modal="true"
        className="c-order-cancel-dialog"
      >
        <div
          className="c-order-cancel-dialog__surface"
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) {
              closeDialogRef.current?.close();
            }
          }}
        >
          <div
            className="c-order-cancel-dialog__panel"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <h2
              className="c-order-cancel-dialog__title"
              id="order-close-dialog-title"
            >
              关闭订单
            </h2>
            <p className="c-order-cancel-dialog__meta">
              确认关闭 {order.id}？关闭后订单将从订单管理列表隐藏。
            </p>
            <div className="c-order-cancel-dialog__actions">
              <Button
                type="button"
                variant="secondary"
                onClick={() => closeDialogRef.current?.close()}
              >
                返回
              </Button>
              <Button type="button" variant="danger" onClick={confirmClose}>
                确认关闭
              </Button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
