import { CheckCircle2, ChevronLeft, Plus, RefreshCw, Trash2 } from "lucide-react";
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

type PendingFullOpeningAction =
  | { kind: "append"; orderIds: string[] }
  | { kind: "replace"; oldOrderId: string; newOrderId: string };

export function CourseOpeningGroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const closeDialogRef = useRef<HTMLDialogElement>(null);
  const fullOpeningDialogRef = useRef<HTMLDialogElement>(null);
  const replaceDialogRef = useRef<HTMLDialogElement>(null);
  const removeOrderDialogRef = useRef<HTMLDialogElement>(null);
  const [selectedAddOrderIds, setSelectedAddOrderIds] = useState<string[]>([]);
  const [replacementTargetOrderId, setReplacementTargetOrderId] = useState<
    string | null
  >(null);
  const [selectedReplacementOrderId, setSelectedReplacementOrderId] =
    useState("");
  const [removeTargetOrderId, setRemoveTargetOrderId] = useState<string | null>(
    null,
  );
  const [pendingFullOpeningAction, setPendingFullOpeningAction] =
    useState<PendingFullOpeningAction | null>(null);
  const [addError, setAddError] = useState("");
  const [replaceError, setReplaceError] = useState("");
  const {
    appendOrdersToCourseOpeningGroup,
    coaches,
    courseOpeningGroups,
    deleteCourseOpeningGroup,
    orders,
    packages,
    reassignCourseOpeningGroupCoach,
    removeOrderFromCourseOpeningGroup,
    replaceCourseOpeningGroupOrder,
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
  const displayStatus = getCourseOpeningGroupDisplayStatus(group);
  const canAddOrders = remainingCapacity > 0;
  const groupOrders = group.orderIds
    .map((orderId) => orders.find((item) => item.id === orderId))
    .filter((order): order is OrderListItem => order != null);
  const availableOrders = orders.filter(
    (order) =>
      order.status === "已完成" &&
      !order.closedAt &&
      order.packageId === group.packageId &&
      !orderGroupByOrderId.has(order.id),
  );
  const replacementTargetOrder = replacementTargetOrderId
    ? groupOrders.find((order) => order.id === replacementTargetOrderId)
    : undefined;
  const replacementTargetStudent = replacementTargetOrder
    ? studentById.get(replacementTargetOrder.studentId)
    : undefined;
  const selectedReplacementOrder = selectedReplacementOrderId
    ? availableOrders.find((order) => order.id === selectedReplacementOrderId)
    : undefined;
  const selectedReplacementStudent = selectedReplacementOrder
    ? studentById.get(selectedReplacementOrder.studentId)
    : undefined;
  const removeTargetOrder = removeTargetOrderId
    ? groupOrders.find((order) => order.id === removeTargetOrderId)
    : undefined;
  const removeTargetStudent = removeTargetOrder
    ? studentById.get(removeTargetOrder.studentId)
    : undefined;
  const fullOpeningPrompt =
    pendingFullOpeningAction?.kind === "replace"
      ? "替换后该开课组将达到额定人数。确认后会标记为已开课；取消则不替换学员。"
      : "添加后该开课组将达到额定人数。确认后会写入学员并标记为已开课；取消则不修改组内学员。";

  const shouldConfirmFullOpening = (nextOrderCount: number) =>
    group.status !== "已开课" && capacity > 0 && nextOrderCount >= capacity;

  const openFullOpeningDialog = (action: PendingFullOpeningAction) => {
    setPendingFullOpeningAction(action);
    fullOpeningDialogRef.current?.showModal();
  };

  const cancelPendingFullOpening = () => {
    if (pendingFullOpeningAction?.kind === "append") {
      setSelectedAddOrderIds([]);
    }
    setPendingFullOpeningAction(null);
    fullOpeningDialogRef.current?.close();
  };

  const confirmPendingFullOpening = () => {
    if (!pendingFullOpeningAction) {
      return;
    }

    if (pendingFullOpeningAction.kind === "append") {
      appendOrdersToCourseOpeningGroup(group.id, pendingFullOpeningAction.orderIds, {
        openGroup: true,
      });
      setSelectedAddOrderIds([]);
    } else {
      replaceCourseOpeningGroupOrder(
        group.id,
        pendingFullOpeningAction.oldOrderId,
        pendingFullOpeningAction.newOrderId,
        { openGroup: true },
      );
    }

    setAddError("");
    setPendingFullOpeningAction(null);
    fullOpeningDialogRef.current?.close();
  };

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

    const nextOrderCount = group.orderIds.length + selectedAddOrderIds.length;
    if (shouldConfirmFullOpening(nextOrderCount)) {
      openFullOpeningDialog({
        kind: "append",
        orderIds: selectedAddOrderIds,
      });
      return;
    }

    appendOrdersToCourseOpeningGroup(group.id, selectedAddOrderIds);
    setSelectedAddOrderIds([]);
    setAddError("");
  };

  const removeGroupOrder = (orderId: string) => {
    removeOrderFromCourseOpeningGroup(group.id, orderId);
    setAddError("");
  };

  const openReplaceDialog = (orderId: string) => {
    setAddError("");
    setReplaceError("");
    setReplacementTargetOrderId(orderId);
    setSelectedReplacementOrderId("");
    replaceDialogRef.current?.showModal();
  };

  const closeReplaceDialog = () => {
    setReplacementTargetOrderId(null);
    setSelectedReplacementOrderId("");
    setReplaceError("");
    replaceDialogRef.current?.close();
  };

  const confirmReplaceGroupOrder = () => {
    if (!replacementTargetOrderId) {
      closeReplaceDialog();
      return;
    }
    if (!selectedReplacementOrderId) {
      setReplaceError("请选择用于替换的学员。");
      return;
    }
    if (!selectedReplacementOrder) {
      setReplaceError("所选学员已不可替换，请重新选择。");
      return;
    }

    const action: PendingFullOpeningAction = {
      kind: "replace",
      oldOrderId: replacementTargetOrderId,
      newOrderId: selectedReplacementOrderId,
    };
    closeReplaceDialog();

    if (shouldConfirmFullOpening(group.orderIds.length)) {
      openFullOpeningDialog(action);
      return;
    }

    replaceCourseOpeningGroupOrder(
      group.id,
      action.oldOrderId,
      action.newOrderId,
    );
    setAddError("");
  };

  const openRemoveDialog = (orderId: string) => {
    setAddError("");
    setRemoveTargetOrderId(orderId);
    removeOrderDialogRef.current?.showModal();
  };

  const closeRemoveDialog = () => {
    setRemoveTargetOrderId(null);
    removeOrderDialogRef.current?.close();
  };

  const confirmRemoveGroupOrder = () => {
    if (!removeTargetOrderId) {
      closeRemoveDialog();
      return;
    }
    removeGroupOrder(removeTargetOrderId);
    closeRemoveDialog();
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
                    {groupOrders.length === 0 ? (
                      <span className="c-course-openings-summary-table__empty">
                        暂无
                      </span>
                    ) : (
                      <ul className="c-course-openings-summary-table__orders c-course-openings-summary-table__orders--editable">
                        {groupOrders.map((order) => {
                          const student = studentById.get(order.studentId);

                          return (
                            <li
                              key={order.id}
                              className="c-course-openings-summary-table__order-row"
                            >
                              <Link
                                className="c-course-openings-summary-table__order-link"
                                state={{
                                  returnTo: `/course-openings/groups/${encodeURIComponent(group.id)}`,
                                }}
                                to={`/orders/${encodeURIComponent(order.id)}`}
                              >
                                <span>
                                  {student?.name ?? "未知学员"} · {order.id}
                                </span>
                                <span
                                  className={cn(
                                    "c-order-status",
                                    orderPaymentStatusClass[order.status],
                                  )}
                                >
                                  {order.status}
                                </span>
                              </Link>

                              <div className="c-course-openings-summary-table__order-actions">
                                <Button
                                  className="c-course-openings-summary-table__order-action-button"
                                  type="button"
                                  variant="secondary"
                                  onClick={() => openReplaceDialog(order.id)}
                                >
                                  <RefreshCw
                                    aria-hidden
                                    className="c-course-openings__button-icon"
                                  />
                                  替换
                                </Button>
                                <Button
                                  className="c-course-openings-summary-table__order-action-button"
                                  type="button"
                                  variant="danger"
                                  onClick={() => openRemoveDialog(order.id)}
                                >
                                  <Trash2
                                    aria-hidden
                                    className="c-course-openings__button-icon"
                                  />
                                  移除
                                </Button>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </td>
                </tr>
                <tr>
                  <th scope="row">开组时间</th>
                  <td>{formatIsoMinute(group.openedAt)}</td>
                </tr>
                <tr>
                  <th scope="row">开课时间</th>
                  <td>
                    {group.startsAt
                      ? formatIsoMinute(group.startsAt)
                      : "待定"}
                  </td>
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
        ref={replaceDialogRef}
        aria-labelledby="course-opening-replace-dialog-title"
        aria-modal="true"
        className="c-order-cancel-dialog"
        onCancel={(event) => {
          event.preventDefault();
          closeReplaceDialog();
        }}
      >
        <div
          className="c-order-cancel-dialog__surface"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) {
              closeReplaceDialog();
            }
          }}
        >
          <div
            className="c-order-cancel-dialog__panel c-course-openings-replace-dialog__panel"
            onPointerDown={(event) => event.stopPropagation()}
          >
            <h2
              className="c-order-cancel-dialog__title"
              id="course-opening-replace-dialog-title"
            >
              替换学员
            </h2>
            <p className="c-order-cancel-dialog__meta">
              请选择一位同套餐、未开启的学员，用来替换{" "}
              <strong>
                {replacementTargetStudent?.name ?? "未知学员"} ·{" "}
                {replacementTargetOrder?.id ?? "未知订单"}
              </strong>
              。
            </p>
            <div className="c-course-openings-replace-dialog__body">
              {replaceError ? (
                <p className="c-course-openings-form__error">{replaceError}</p>
              ) : null}
              {availableOrders.length === 0 ? (
                <p className="c-resource-list__empty">
                  当前没有可用于替换的同套餐未开启订单。
                </p>
              ) : (
                <label className="c-course-openings-replace-dialog__field">
                  <span className="c-course-openings-replace-dialog__label">
                    使用哪位学员替换
                  </span>
                  <select
                    className="c-field-input"
                    value={selectedReplacementOrderId}
                    onChange={(event) => {
                      setSelectedReplacementOrderId(event.target.value);
                      setReplaceError("");
                    }}
                  >
                    <option value="">请选择替换学员</option>
                    {availableOrders.map((candidate) => {
                      const candidateStudent = studentById.get(
                        candidate.studentId,
                      );
                      return (
                        <option key={candidate.id} value={candidate.id}>
                          {candidateStudent?.name ?? "未知学员"} · {candidate.id}
                        </option>
                      );
                    })}
                  </select>
                </label>
              )}
              {selectedReplacementOrder ? (
                <p className="c-order-cancel-dialog__meta">
                  将使用{" "}
                  <strong>
                    {selectedReplacementStudent?.name ?? "未知学员"} ·{" "}
                    {selectedReplacementOrder.id}
                  </strong>{" "}
                  替换当前学员。
                </p>
              ) : null}
            </div>
            <div className="c-order-cancel-dialog__actions">
              <Button
                type="button"
                variant="secondary"
                onClick={closeReplaceDialog}
              >
                取消
              </Button>
              <Button
                disabled={!selectedReplacementOrderId}
                type="button"
                onClick={confirmReplaceGroupOrder}
              >
                确认替换
              </Button>
            </div>
          </div>
        </div>
      </dialog>

      <dialog
        ref={removeOrderDialogRef}
        aria-labelledby="course-opening-remove-order-dialog-title"
        aria-modal="true"
        className="c-order-cancel-dialog"
        onCancel={(event) => {
          event.preventDefault();
          closeRemoveDialog();
        }}
      >
        <div
          className="c-order-cancel-dialog__surface"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) {
              closeRemoveDialog();
            }
          }}
        >
          <div
            className="c-order-cancel-dialog__panel"
            onPointerDown={(event) => event.stopPropagation()}
          >
            <h2
              className="c-order-cancel-dialog__title"
              id="course-opening-remove-order-dialog-title"
            >
              移除学员
            </h2>
            <p className="c-order-cancel-dialog__meta">
              确认将{" "}
              <strong>
                {removeTargetStudent?.name ?? "未知学员"} ·{" "}
                {removeTargetOrder?.id ?? "未知订单"}
              </strong>{" "}
              从 {group.id} 移除？移除后该订单开课状态将回到未开启，开课组会保留。
            </p>
            <div className="c-order-cancel-dialog__actions">
              <Button
                type="button"
                variant="secondary"
                onClick={closeRemoveDialog}
              >
                取消
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={confirmRemoveGroupOrder}
              >
                确认移除
              </Button>
            </div>
          </div>
        </div>
      </dialog>

      <dialog
        ref={fullOpeningDialogRef}
        aria-labelledby="course-opening-full-dialog-title"
        aria-modal="true"
        className="c-order-cancel-dialog"
        onCancel={(event) => {
          event.preventDefault();
          cancelPendingFullOpening();
        }}
      >
        <div
          className="c-order-cancel-dialog__surface"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) {
              cancelPendingFullOpening();
            }
          }}
        >
          <div
            className="c-order-cancel-dialog__panel"
            onPointerDown={(event) => event.stopPropagation()}
          >
            <h2
              className="c-order-cancel-dialog__title"
              id="course-opening-full-dialog-title"
            >
              确认开课
            </h2>
            <p className="c-order-cancel-dialog__meta">
              {fullOpeningPrompt}
            </p>
            <div className="c-order-cancel-dialog__actions">
              <Button
                type="button"
                variant="secondary"
                onClick={cancelPendingFullOpening}
              >
                取消
              </Button>
              <Button type="button" onClick={confirmPendingFullOpening}>
                <CheckCircle2
                  aria-hidden
                  className="c-course-openings__button-icon"
                />
                确认
              </Button>
            </div>
          </div>
        </div>
      </dialog>

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
