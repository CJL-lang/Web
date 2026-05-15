import { CheckCircle2, UsersRound } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../../components/ui/Button";
import { SectionCard } from "../../components/ui/SectionCard";
import { useAdminData } from "../../context/AdminDataContext";
import type { CourseOpeningGroup } from "../../mocks/courseOpenings";
import { nextCourseOpeningGroupId } from "../../utils/adminIds";
import { cn } from "../../utils/cn";
import {
  createOrderGroupMap,
  formatPrice,
  getUnopenedGroupRemainingCapacity,
} from "./courseOpeningViewHelpers";

type PendingBatchOpeningAction =
  | {
      kind: "append";
      operations: Array<{
        groupId: string;
        orderIds: string[];
        openGroup: boolean;
      }>;
    }
  | {
      kind: "create";
      group: CourseOpeningGroup;
    };

export function CourseOpeningCoachPage() {
  const navigate = useNavigate();
  const fullOpeningDialogRef = useRef<HTMLDialogElement>(null);
  const {
    addCourseOpeningGroup,
    appendOrdersToCourseOpeningGroup,
    coaches,
    courseOpeningGroups,
    orders,
    packages,
    students,
  } = useAdminData();

  const activeCoaches = useMemo(
    () => coaches.filter((coach) => coach.status === "在职"),
    [coaches],
  );
  const [selectedCoachId, setSelectedCoachId] = useState(
    () => activeCoaches[0]?.id ?? "",
  );
  const [selectedPackageId, setSelectedPackageId] = useState(
    () => packages[0]?.id ?? "",
  );
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [pendingBatchOpeningAction, setPendingBatchOpeningAction] =
    useState<PendingBatchOpeningAction | null>(null);
  const [createError, setCreateError] = useState("");

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

  const selectedPackage = packageById.get(selectedPackageId);
  const selectedCoach = coachById.get(selectedCoachId);
  const groupCapacity = selectedPackage?.coachStudentRatio ?? 0;
  const fillableGroups = useMemo(() => {
    return courseOpeningGroups
      .filter(
        (group) =>
          group.coachId === selectedCoachId &&
          group.packageId === selectedPackageId &&
          group.status === "未满人" &&
          getUnopenedGroupRemainingCapacity(group, packages) > 0,
      )
      .sort((a, b) => a.openedAt.localeCompare(b.openedAt));
  }, [courseOpeningGroups, packages, selectedCoachId, selectedPackageId]);
  const fillableRemainingCapacity = fillableGroups.reduce(
    (sum, group) => sum + getUnopenedGroupRemainingCapacity(group, packages),
    0,
  );
  const selectionLimit =
    fillableGroups.length > 0 ? fillableRemainingCapacity : groupCapacity;

  const batchHeadcountMetric = useMemo(() => {
    if (fillableGroups.length === 0) {
      return {
        denominatorLabel: "新组容量" as const,
        numeratorLabel: "已选订单" as const,
        value: `${selectedOrderIds.length}/${groupCapacity}`,
      };
    }
    const first = fillableGroups[0];
    const pkg = packageById.get(first.packageId);
    const capacity = pkg?.coachStudentRatio ?? first.orderIds.length;
    const firstRemaining = getUnopenedGroupRemainingCapacity(first, packages);
    const toFirstGroup = Math.min(selectedOrderIds.length, firstRemaining);
    return {
      denominatorLabel: "额定人数" as const,
      numeratorLabel: "组内人数" as const,
      value: `${first.orderIds.length + toFirstGroup}/${capacity}`,
    };
  }, [
    fillableGroups,
    groupCapacity,
    packageById,
    packages,
    selectedOrderIds.length,
  ]);

  const eligibleOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        order.status === "已完成" &&
        !order.closedAt &&
        !orderGroupByOrderId.has(order.id),
    );
  }, [orderGroupByOrderId, orders]);

  const packageEligibleOrders = useMemo(() => {
    return eligibleOrders.filter((order) => order.packageId === selectedPackageId);
  }, [eligibleOrders, selectedPackageId]);
  const fullOpeningPrompt =
    pendingBatchOpeningAction?.kind === "create"
      ? "该新开课组已达到额定人数。确认后会创建开课组并标记为已开课；取消则不创建开课组。"
      : "本次补入会使开课组达到额定人数。确认后会写入学员并标记为已开课；取消则不提交本批次变更。";

  const activeCoachOptions = activeCoaches.map((coach) => (
    <option key={coach.id} value={coach.id}>
      {coach.name}
    </option>
  ));

  const resetCreateSelectionForPackage = (nextPackageId: string) => {
    setSelectedPackageId(nextPackageId);
    setSelectedOrderIds([]);
    setCreateError("");
  };

  const toggleOrderSelection = (orderId: string) => {
    setCreateError("");
    setSelectedOrderIds((current) => {
      if (current.includes(orderId)) {
        return current.filter((id) => id !== orderId);
      }
      if (selectionLimit > 0 && current.length >= selectionLimit) {
        setCreateError(`当前最多选择 ${selectionLimit} 个订单。`);
        return current;
      }
      return [...current, orderId];
    });
  };

  const buildFillableGroupOperations = () => {
    let cursor = 0;
    const operations: Array<{
      groupId: string;
      orderIds: string[];
      openGroup: boolean;
    }> = [];

    for (const group of fillableGroups) {
      const remaining = getUnopenedGroupRemainingCapacity(group, packages);
      const slice = selectedOrderIds.slice(cursor, cursor + remaining);
      if (slice.length > 0) {
        operations.push({
          groupId: group.id,
          orderIds: slice,
          openGroup: remaining > 0 && slice.length >= remaining,
        });
      }
      cursor += slice.length;
      if (cursor >= selectedOrderIds.length) {
        break;
      }
    }

    return operations;
  };

  const commitFillableGroupOperations = (
    operations: PendingBatchOpeningAction & { kind: "append" },
  ) => {
    for (const operation of operations.operations) {
      appendOrdersToCourseOpeningGroup(operation.groupId, operation.orderIds, {
        openGroup: operation.openGroup,
      });
    }
    setSelectedOrderIds([]);
    setCreateError("");
    navigate("/course-openings/groups");
  };

  const openFullOpeningDialog = (action: PendingBatchOpeningAction) => {
    setPendingBatchOpeningAction(action);
    fullOpeningDialogRef.current?.showModal();
  };

  const cancelPendingBatchOpening = () => {
    setPendingBatchOpeningAction(null);
    setSelectedOrderIds([]);
    fullOpeningDialogRef.current?.close();
  };

  const confirmPendingBatchOpening = () => {
    if (!pendingBatchOpeningAction) {
      return;
    }

    if (pendingBatchOpeningAction.kind === "append") {
      commitFillableGroupOperations(pendingBatchOpeningAction);
    } else {
      addCourseOpeningGroup(pendingBatchOpeningAction.group);
      setSelectedOrderIds([]);
      setCreateError("");
      navigate(
        `/course-openings/groups/${encodeURIComponent(pendingBatchOpeningAction.group.id)}`,
      );
    }

    setPendingBatchOpeningAction(null);
    fullOpeningDialogRef.current?.close();
  };

  const createOpeningGroup = () => {
    if (!selectedCoach || selectedCoach.status !== "在职") {
      setCreateError("请选择在职教练。");
      return;
    }
    if (!selectedPackage) {
      setCreateError("请选择套餐。");
      return;
    }
    if (selectedOrderIds.length === 0) {
      setCreateError("请选择至少 1 个可开课订单。");
      return;
    }
    if (selectedOrderIds.length > selectionLimit) {
      setCreateError(`当前最多选择 ${selectionLimit} 个订单。`);
      return;
    }

    if (fillableGroups.length > 0) {
      const operations = buildFillableGroupOperations();
      if (operations.some((operation) => operation.openGroup)) {
        openFullOpeningDialog({ kind: "append", operations });
        return;
      }
      commitFillableGroupOperations({ kind: "append", operations });
      return;
    }

    const now = new Date().toISOString();
    const groupId = nextCourseOpeningGroupId(courseOpeningGroups);
    const status: CourseOpeningGroup["status"] =
      groupCapacity > 0 && selectedOrderIds.length >= groupCapacity
        ? "已开课"
        : "未满人";
    const group: CourseOpeningGroup = {
      id: groupId,
      coachId: selectedCoach.id,
      packageId: selectedPackage.id,
      orderIds: selectedOrderIds,
      status,
      openedAt: now,
      startsAt: status === "已开课" ? now : null,
      updatedAt: now,
    };

    if (group.status === "已开课") {
      openFullOpeningDialog({ kind: "create", group });
      return;
    }

    addCourseOpeningGroup(group);
    navigate(`/course-openings/groups/${encodeURIComponent(groupId)}`);
  };

  return (
    <div className="c-course-openings__coach-grid">
      <SectionCard className="c-course-openings-batch-card" title="批量开课">
        <div className="c-course-openings-form">
          <div className="c-course-openings-form__row">
            <div className="c-field-shell">
              <div className="c-field-shell__label-row">
                <label
                  className="c-field-shell__label"
                  htmlFor="course-opening-coach"
                >
                  教练
                </label>
              </div>
              <select
                className="c-field-input"
                id="course-opening-coach"
                value={selectedCoachId}
                onChange={(event) => {
                  setSelectedCoachId(event.target.value);
                  setCreateError("");
                }}
              >
                {activeCoachOptions}
              </select>
            </div>

            <div className="c-field-shell">
              <div className="c-field-shell__label-row">
                <label
                  className="c-field-shell__label"
                  htmlFor="course-opening-package"
                >
                  套餐
                </label>
                {selectedPackage ? (
                  <span className="c-field-shell__hint">
                    1 对 {selectedPackage.coachStudentRatio}
                  </span>
                ) : null}
              </div>
              <select
                className="c-field-input"
                id="course-opening-package"
                value={selectedPackageId}
                onChange={(event) =>
                  resetCreateSelectionForPackage(event.target.value)
                }
              >
                {packages.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="c-course-openings-form__summary">
            <div className="c-course-openings-metric">
              <UsersRound
                aria-hidden
                className="c-course-openings-metric__icon"
              />
              <div>
                <p className="c-course-openings-metric__value">
                  {batchHeadcountMetric.value}
                </p>
                <p className="c-course-openings-metric__label">
                  {batchHeadcountMetric.numeratorLabel} /{" "}
                  {batchHeadcountMetric.denominatorLabel}
                </p>
              </div>
            </div>
            <Button
              disabled={selectedOrderIds.length === 0}
              type="button"
              onClick={createOpeningGroup}
            >
              <CheckCircle2
                aria-hidden
                className="c-course-openings__button-icon"
              />
              {fillableGroups.length > 0 ? "补入未满组" : "创建开课组"}
            </Button>
          </div>

          {createError ? (
            <p className="c-course-openings-form__error">{createError}</p>
          ) : null}

          <div className="c-course-openings-order-picker">
            {eligibleOrders.length === 0 ? (
              <p className="c-resource-list__empty">
                当前没有已支付且未开启的订单。
              </p>
            ) : packageEligibleOrders.length === 0 ? (
              <p className="c-resource-list__empty">
                当前套餐暂无可开课订单，请切换套餐查看。
              </p>
            ) : (
              <ul className="c-course-openings-order-picker__list">
                {packageEligibleOrders.map((order) => {
                  const student = studentById.get(order.studentId);
                  const pkg = packageById.get(order.packageId);
                  const checked = selectedOrderIds.includes(order.id);
                  const disabled =
                    !checked &&
                    selectionLimit > 0 &&
                    selectedOrderIds.length >= selectionLimit;

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
                          onChange={() => toggleOrderSelection(order.id)}
                        />
                        <span className="c-course-openings-order-option__body">
                          <span className="c-course-openings-order-option__title">
                            {student?.name ?? "未知学员"}
                          </span>
                          <span className="c-course-openings-order-option__meta">
                            {order.id} · {pkg?.name ?? "未知套餐"} ·{" "}
                            {formatPrice(order.amount)}
                          </span>
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </SectionCard>

      <dialog
        ref={fullOpeningDialogRef}
        aria-labelledby="course-opening-batch-full-dialog-title"
        aria-modal="true"
        className="c-order-cancel-dialog"
        onCancel={(event) => {
          event.preventDefault();
          cancelPendingBatchOpening();
        }}
      >
        <div
          className="c-order-cancel-dialog__surface"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) {
              cancelPendingBatchOpening();
            }
          }}
        >
          <div
            className="c-order-cancel-dialog__panel"
            onPointerDown={(event) => event.stopPropagation()}
          >
            <h2
              className="c-order-cancel-dialog__title"
              id="course-opening-batch-full-dialog-title"
            >
              确认开课
            </h2>
            <p className="c-order-cancel-dialog__meta">{fullOpeningPrompt}</p>
            <div className="c-order-cancel-dialog__actions">
              <Button
                type="button"
                variant="secondary"
                onClick={cancelPendingBatchOpening}
              >
                取消
              </Button>
              <Button type="button" onClick={confirmPendingBatchOpening}>
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
    </div>
  );
}
