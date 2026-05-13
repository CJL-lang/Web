import { ChevronLeft, Pencil, StickyNote } from "lucide-react";
import { useMemo, useRef, useState, type ReactNode } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { useAdminData } from "../../context/AdminDataContext";
import type { OrderStatus } from "../../mocks/orders";
import { formatOrderDateTimeForDisplay } from "../../utils/orderDateTime";
import { cn } from "../../utils/cn";

const orderStatusClass: Record<OrderStatus, string> = {
  待支付: "c-order-status--pending",
  进行中: "c-order-status--active",
  已完成: "c-order-status--success",
  已取消: "c-order-status--canceled",
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

export function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const cancelDialogRef = useRef<HTMLDialogElement>(null);
  const noteDialogRef = useRef<HTMLDialogElement>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const { cancelOrder, orders, packages, students, updateOrder } =
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

  if (!orderId || !order) {
    return <Navigate replace to="/orders" />;
  }

  const isInProgress = order.status === "进行中";
  const isCompleted = order.status === "已完成";
  const canCancel =
    order.status !== "进行中" &&
    order.status !== "已完成" &&
    order.status !== "已取消";

  const confirmCancel = () => {
    cancelOrder(order.id);
    cancelDialogRef.current?.close();
  };

  const openNoteDialog = () => {
    setNoteDraft(order.note ?? "");
    noteDialogRef.current?.showModal();
  };

  const saveNote = () => {
    updateOrder(order.id, {
      studentId: order.studentId,
      packageId: order.packageId,
      amount: order.amount,
      status: order.status,
      orderDate: order.orderDate,
      paymentMethod: order.paymentMethod,
      paymentDate: order.paymentDate,
      note: noteDraft.trim() || undefined,
      updatedAt: new Date().toISOString(),
    });
    noteDialogRef.current?.close();
  };

  return (
    <>
      <PageHeader
        actions={
          <div className="c-order-detail__header-actions">
            {isInProgress ? (
              <Button
                className="gap-2"
                type="button"
                variant="secondary"
                onClick={openNoteDialog}
              >
                <StickyNote
                  aria-hidden
                  className="c-order-detail__action-icon"
                />
                编辑备注
              </Button>
            ) : isCompleted ? null : (
              <>
                <Link
                  className="c-button-link-primary c-order-detail__edit-link"
                  to={`/orders/${encodeURIComponent(order.id)}/edit`}
                >
                  <Pencil aria-hidden className="c-order-detail__action-icon" />
                  编辑订单
                </Link>
                {canCancel ? (
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => cancelDialogRef.current?.showModal()}
                  >
                    取消订单
                  </Button>
                ) : null}
              </>
            )}
          </div>
        }
        eyebrow="Commerce"
        title="订单详情"
      />

      <div className="c-order-detail__toolbar">
        <Link className="c-order-detail__back-link" to="/orders">
          <ChevronLeft aria-hidden className="c-order-detail__back-icon" />
          返回订单列表
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
            <DetailTableRow label="订单金额" value={formatPrice(order.amount)} />
            <DetailTableRow label="学员" value={student?.name ?? "未知学员"} />
            <DetailTableRow label="学员编号" value={order.studentId} />
            <DetailTableRow label="套餐" value={pkg?.name ?? "未知套餐"} />
            <DetailTableRow label="套餐编号" value={order.packageId} />
            <DetailTableRow
              label="订单创建时间"
              value={formatOrderDateTimeForDisplay(order.orderDate)}
            />
            <DetailTableRow label="支付方式" value={order.paymentMethod} />
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
        ref={cancelDialogRef}
        aria-labelledby="order-cancel-dialog-title"
        aria-modal="true"
        className="c-order-cancel-dialog"
      >
        <div
          className="c-order-cancel-dialog__surface"
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) {
              cancelDialogRef.current?.close();
            }
          }}
        >
          <div
            className="c-order-cancel-dialog__panel"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <h2
              className="c-order-cancel-dialog__title"
              id="order-cancel-dialog-title"
            >
              取消订单
            </h2>
            <p className="c-order-cancel-dialog__meta">
              确认将 {order.id} 标记为已取消？订单会保留在历史记录中。
            </p>
            <div className="c-order-cancel-dialog__actions">
              <Button
                type="button"
                variant="secondary"
                onClick={() => cancelDialogRef.current?.close()}
              >
                返回
              </Button>
              <Button type="button" variant="danger" onClick={confirmCancel}>
                确认取消
              </Button>
            </div>
          </div>
        </div>
      </dialog>

      <dialog
        ref={noteDialogRef}
        aria-labelledby="order-note-dialog-title"
        aria-modal="true"
        className="c-order-cancel-dialog"
      >
        <div
          className="c-order-cancel-dialog__surface"
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) {
              noteDialogRef.current?.close();
            }
          }}
        >
          <div
            className="c-order-cancel-dialog__panel"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <h2
              className="c-order-cancel-dialog__title"
              id="order-note-dialog-title"
            >
              编辑备注
            </h2>
            <p className="c-order-cancel-dialog__meta">
              进行中的订单仅支持修改备注；金额、套餐等请通过其他流程处理。
            </p>
            <textarea
              aria-label="备注内容"
              className="c-field-textarea"
              onChange={(e) => setNoteDraft(e.target.value)}
              rows={5}
              value={noteDraft}
            />
            <div className="c-order-cancel-dialog__actions">
              <Button
                type="button"
                variant="secondary"
                onClick={() => noteDialogRef.current?.close()}
              >
                取消
              </Button>
              <Button type="button" variant="primary" onClick={saveNote}>
                保存
              </Button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
