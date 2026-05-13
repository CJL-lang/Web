import { CheckCircle2, ChevronLeft, Plus } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import { Button } from "../../components/ui/Button";
import { SectionCard } from "../../components/ui/SectionCard";
import { useAdminData } from "../../context/AdminDataContext";
import {
  getCourseOpeningGroupDisplayStatus,
  getCourseOpeningGroupRemainingCapacity,
} from "../../mocks/courseOpenings";
import type { OrderListItem } from "../../mocks/orders";
import { courseOpeningGroupStatusPillClass } from "../../utils/bizStatusPills";
import { cn } from "../../utils/cn";
import { formatOrderDateTimeForDisplay } from "../../utils/orderDateTime";
import {
  createOrderGroupMap,
  formatIsoMinute,
  formatPrice,
} from "./courseOpeningViewHelpers";

export function CourseOpeningGroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const closeDialogRef = useRef<HTMLDialogElement>(null);
  const [selectedAddOrderIds, setSelectedAddOrderIds] = useState<string[]>([]);
  const [addError, setAddError] = useState("");
  const {
    appendOrdersToCourseOpeningGroup,
    coaches,
    confirmCourseOpeningGroup,
    courseOpeningGroups,
    deleteCourseOpeningGroup,
    orders,
    packages,
    reassignCourseOpeningGroupCoach,
    students,
  } = useAdminData();

  const group = useMemo(
    () =>
      groupId
        ? courseOpeningGroups.find((item) => item.id === groupId)
        : undefined,
    [courseOpeningGroups, groupId],
  );

  const studentById = useMemo(
    () => new Map(students.map((student) => [student.id, student])),
    [students],
  );
  const coachById = useMemo(
    () => new Map(coaches.map((coach) => [coach.id, coach])),
    [coaches],
  );
  const activeCoaches = useMemo(
    () => coaches.filter((coach) => coach.status === "在职"),
    [coaches],
  );
  const orderGroupByOrderId = useMemo(
    () => createOrderGroupMap(courseOpeningGroups),
    [courseOpeningGroups],
  );

  if (!groupId || !group) {
    return <Navigate replace to="/course-openings/groups" />;
  }

  const coach = coachById.get(group.coachId);
  const pkg = packages.find((item) => item.id === group.packageId);
  const capacity = pkg?.coachStudentRatio ?? group.orderIds.length;
  const remainingCapacity = getCourseOpeningGroupRemainingCapacity(
    group,
    packages,
  );
  const displayStatus = getCourseOpeningGroupDisplayStatus(group, packages);
  const canAddOrders = group.status === "未满人" && remainingCapacity > 0;
  const canConfirmOpening = group.status === "未满人" && remainingCapacity === 0;
  const currentCoachIsInactive = coach != null && coach.status !== "在职";
  const openedOrders = group.orderIds
    .map((orderId) => orders.find((item) => item.id === orderId))
    .filter((order): order is OrderListItem => order != null);
  const availableOrders = orders.filter(
    (order) =>
      order.status === "已完成" &&
      !order.closedAt &&
      order.packageId === group.packageId &&
      !orderGroupByOrderId.has(order.id),
  );

  const confirmCloseGroup = () => {
    deleteCourseOpeningGroup(group.id);
    closeDialogRef.current?.close();
    navigate("/course-openings/groups");
  };

  const toggleAddOrder = (orderId: string) => {
    setAddError("");
    setSelectedAddOrderIds((current) => {
      if (current.includes(orderId)) {
        return current.filter((id) => id !== orderId);
      }
      if (current.length >= remainingCapacity) {
        setAddError(`当前开课组最多还可添加 ${remainingCapacity} 个学员。`);
        return current;
      }
      return [...current, orderId];
    });
  };

  const appendSelectedOrders = () => {
    if (!canAddOrders) {
      setAddError("当前开课组不可继续添加学员。");
      return;
    }
    if (selectedAddOrderIds.length === 0) {
      setAddError("请选择至少 1 个同套餐订单。");
      return;
    }
    if (selectedAddOrderIds.length > remainingCapacity) {
      setAddError(`当前开课组最多还可添加 ${remainingCapacity} 个学员。`);
      return;
    }
    appendOrdersToCourseOpeningGroup(group.id, selectedAddOrderIds);
    setSelectedAddOrderIds([]);
    setAddError("");
  };

  const confirmOpening = () => {
    if (!canConfirmOpening) {
      return;
    }
    confirmCourseOpeningGroup(group.id);
  };

  return (
    <>
      <div className="c-course-openings-detail__toolbar">
        <Link className="c-order-detail__back-link" to="/course-openings/groups">
          <ChevronLeft aria-hidden className="c-order-detail__back-icon" />
          返回开课组
        </Link>
      </div>

      <SectionCard
        action={
          <div className="c-course-openings-detail__actions">
            {group.status === "未满人" ? (
              <Button
                disabled={!canConfirmOpening}
                title={
                  canConfirmOpening
                    ? "确认开课"
                    : `还差 ${remainingCapacity} 人，补满后可开课`
                }
                type="button"
                onClick={confirmOpening}
              >
                <CheckCircle2
                  aria-hidden
                  className="c-course-openings__button-icon"
                />
                确认开课
              </Button>
            ) : null}
            <Button
              type="button"
              variant="danger"
              onClick={() => closeDialogRef.current?.showModal()}
            >
              关闭开课组
            </Button>
          </div>
        }
        title={group.id}
      >
        <dl className="c-course-openings-summary-list">
          <div>
            <dt>教练</dt>
            <dd>
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
                {!coach ? <option value={group.coachId}>未知教练</option> : null}
                {currentCoachIsInactive ? (
                  <option value={coach.id}>
                    {coach.name} · {coach.status}
                  </option>
                ) : null}
                {activeCoaches.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} · {item.title}
                  </option>
                ))}
              </select>
            </dd>
          </div>
          <div>
            <dt>状态</dt>
            <dd>
              <span
                className={cn(
                  "c-order-status",
                  courseOpeningGroupStatusPillClass(displayStatus),
                )}
              >
                {displayStatus}
              </span>
            </dd>
          </div>
          <div>
            <dt>套餐</dt>
            <dd>{pkg?.name ?? "未知套餐"}</dd>
          </div>
          <div>
            <dt>容量</dt>
            <dd>
              {group.orderIds.length}/{capacity} 人
            </dd>
          </div>
          <div>
            <dt>剩余名额</dt>
            <dd>{remainingCapacity} 人</dd>
          </div>
          <div>
            <dt>开启时间</dt>
            <dd>{formatIsoMinute(group.openedAt)}</dd>
          </div>
          <div>
            <dt>更新时间</dt>
            <dd>{formatIsoMinute(group.updatedAt)}</dd>
          </div>
        </dl>
      </SectionCard>

      {canAddOrders ? (
        <SectionCard
          action={
            <Button
              disabled={selectedAddOrderIds.length === 0}
              type="button"
              onClick={appendSelectedOrders}
            >
              <Plus aria-hidden className="c-course-openings__button-icon" />
              添加学员
            </Button>
          }
          title="添加学员"
        >
          <div className="c-course-openings-add-students">
            <p className="c-course-openings-add-students__hint">
              仅可添加已支付、未关闭、未加入其他开课组且套餐相同的订单。当前还可添加 {remainingCapacity} 人。
            </p>
            {addError ? (
              <p className="c-course-openings-form__error">{addError}</p>
            ) : null}
            {availableOrders.length === 0 ? (
              <p className="c-resource-list__empty">
                当前没有可添加的同套餐订单。
              </p>
            ) : (
              <ul className="c-course-openings-order-picker__list">
                {availableOrders.map((order) => {
                  const student = studentById.get(order.studentId);
                  const checked = selectedAddOrderIds.includes(order.id);
                  const disabled =
                    !checked && selectedAddOrderIds.length >= remainingCapacity;

                  return (
                    <li key={order.id}>
                      <label
                        className={cn(
                          "c-course-openings-order-option",
                          checked && "is-selected",
                          disabled && "is-disabled",
                        )}
                      >
                        <input
                          checked={checked}
                          disabled={disabled}
                          type="checkbox"
                          onChange={() => toggleAddOrder(order.id)}
                        />
                        <span className="c-course-openings-order-option__body">
                          <span className="c-course-openings-order-option__title">
                            {student?.name ?? "未知学员"}
                          </span>
                          <span className="c-course-openings-order-option__meta">
                            {order.id} · {formatPrice(order.amount)} ·{" "}
                            {formatOrderDateTimeForDisplay(order.orderDate)}
                          </span>
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </SectionCard>
      ) : null}

      <SectionCard title="组内订单">
        <ul className="c-course-openings-detail-order-list">
          {openedOrders.map((order) => {
            const student = studentById.get(order.studentId);

            return (
              <li key={order.id} className="c-course-openings-detail-order">
                <div className="c-course-openings-detail-order__main">
                  <Link
                    className="c-course-openings-detail-order__title"
                    to={`/orders/${encodeURIComponent(order.id)}`}
                  >
                    {student?.name ?? "未知学员"} · {order.id}
                  </Link>
                  <p className="c-course-openings-detail-order__meta">
                    {formatOrderDateTimeForDisplay(order.orderDate)} ·{" "}
                    {formatPrice(order.amount)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </SectionCard>

      <dialog
        ref={closeDialogRef}
        aria-labelledby="course-opening-close-dialog-title"
        aria-modal="true"
        className="c-order-cancel-dialog"
      >
        <div
          className="c-order-cancel-dialog__surface"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDialogRef.current?.close();
            }
          }}
        >
          <div
            className="c-order-cancel-dialog__panel"
            onPointerDown={(event) => event.stopPropagation()}
          >
            <h2
              className="c-order-cancel-dialog__title"
              id="course-opening-close-dialog-title"
            >
              关闭开课组
            </h2>
            <p className="c-order-cancel-dialog__meta">
              确认关闭 {group.id}？关闭后该组记录会被删除，组内订单将回到未开启状态。
            </p>
            <div className="c-order-cancel-dialog__actions">
              <Button
                type="button"
                variant="secondary"
                onClick={() => closeDialogRef.current?.close()}
              >
                返回
              </Button>
              <Button type="button" variant="danger" onClick={confirmCloseGroup}>
                确认关闭
              </Button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
