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
import type { OrderListItem, OrderStatus } from "../../mocks/orders";
import { courseOpeningGroupStatusPillClass } from "../../utils/bizStatusPills";
import { cn } from "../../utils/cn";
import { formatOrderDateTimeForDisplay } from "../../utils/orderDateTime";
import {
  createOrderGroupMap,
  formatIsoMinute,
  formatPrice,
  sortCoachesForGroupSelect,
} from "./courseOpeningViewHelpers";

const orderPaymentStatusClass: Record<OrderStatus, string> = {
  待完成: "c-order-status--pending",
  已完成: "c-order-status--success",
  已退款: "c-order-status--canceled",
  已关闭: "c-order-status--closed",
};

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
  const orderGroupByOrderId = useMemo(
    () => createOrderGroupMap(courseOpeningGroups),
    [courseOpeningGroups],
  );

  const coachSelectRows = useMemo(
    () => sortCoachesForGroupSelect(coaches),
    [coaches],
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
      <div className="c-course-openings-detail">
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
        <div className="c-course-openings-summary-table-wrap">
          <table
            className="c-course-openings-summary-table"
            aria-label={`${group.id} 开课组信息`}
          >
            <tbody>
              <tr>
                <th scope="row">教练</th>
                <td>
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
                    {!coach ? (
                      <option value={group.coachId}>未知教练</option>
                    ) : null}
                    {coachSelectRows.map((item) => {
                      const canPick =
                        item.status === "在职" || item.id === group.coachId;
                      const label =
                        item.status === "在职"
                          ? item.name
                          : `${item.name}（${item.status}）`;
                      return (
                        <option
                          key={item.id}
                          disabled={!canPick}
                          value={item.id}
                        >
                          {label}
                        </option>
                      );
                    })}
                  </select>
                </td>
              </tr>
              <tr>
                <th scope="row">状态</th>
                <td>
                  <span
                    className={cn(
                      "c-order-status",
                      courseOpeningGroupStatusPillClass(displayStatus),
                    )}
                  >
                    {displayStatus}
                  </span>
                </td>
              </tr>
              <tr>
                <th scope="row">套餐</th>
                <td>
                  {pkg ? (
                    <Link
                      className="c-course-openings-summary-table__package-link"
                      state={{
                        returnTo: `/course-openings/groups/${encodeURIComponent(group.id)}`,
                      }}
                      to={`/packages/${encodeURIComponent(pkg.id)}`}
                    >
                      {pkg.name}
                    </Link>
                  ) : (
                    "未知套餐"
                  )}
                </td>
              </tr>
              <tr>
                <th scope="row">容量</th>
                <td>
                  {group.orderIds.length}/{capacity} 人
                </td>
              </tr>
              <tr>
                <th scope="row">剩余名额</th>
                <td>{remainingCapacity} 人</td>
              </tr>
              <tr className="c-course-openings-summary-table__row--orders">
                <th scope="row">学员订单</th>
                <td>
                  {openedOrders.length === 0 ? (
                    <span className="c-course-openings-summary-table__empty">
                      暂无
                    </span>
                  ) : (
                    <ul className="c-course-openings-summary-table__orders">
                      {openedOrders.map((order) => {
                        const student = studentById.get(order.studentId);
                        return (
                          <li key={order.id}>
                            <Link
                              className="c-course-openings-summary-table__order-link"
                              state={{
                                returnTo: `/course-openings/groups/${encodeURIComponent(group.id)}`,
                              }}
                              to={`/orders/${encodeURIComponent(order.id)}`}
                            >
                              <span>{student?.name ?? "未知学员"} · {order.id}</span>
                              <span
                                className={cn(
                                  "c-order-status",
                                  orderPaymentStatusClass[order.status],
                                )}
                              >
                                {order.status}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </td>
              </tr>
              <tr>
                <th scope="row">开启时间</th>
                <td>{formatIsoMinute(group.openedAt)}</td>
              </tr>
              <tr>
                <th scope="row">更新时间</th>
                <td>{formatIsoMinute(group.updatedAt)}</td>
              </tr>
            </tbody>
          </table>
        </div>
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
      </div>

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
