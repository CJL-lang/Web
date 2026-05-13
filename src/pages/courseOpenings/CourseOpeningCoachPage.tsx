import { CheckCircle2, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../../components/ui/Button";
import { SectionCard } from "../../components/ui/SectionCard";
import { useAdminData } from "../../context/AdminDataContext";
import { nextCourseOpeningGroupId } from "../../utils/adminIds";
import { cn } from "../../utils/cn";
import {
  createOrderGroupMap,
  formatPrice,
  getUnopenedGroupRemainingCapacity,
} from "./courseOpeningViewHelpers";

export function CourseOpeningCoachPage() {
  const navigate = useNavigate();
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
      let cursor = 0;
      for (const group of fillableGroups) {
        const remaining = getUnopenedGroupRemainingCapacity(group, packages);
        const slice = selectedOrderIds.slice(cursor, cursor + remaining);
        if (slice.length > 0) {
          appendOrdersToCourseOpeningGroup(group.id, slice);
        }
        cursor += slice.length;
        if (cursor >= selectedOrderIds.length) {
          break;
        }
      }
      navigate("/course-openings/groups");
      return;
    }

    const now = new Date().toISOString();
    const groupId = nextCourseOpeningGroupId(courseOpeningGroups);
    addCourseOpeningGroup({
      id: groupId,
      coachId: selectedCoach.id,
      packageId: selectedPackage.id,
      orderIds: selectedOrderIds,
      status: "未满人",
      openedAt: now,
      updatedAt: now,
    });
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
                  {selectedOrderIds.length}/{selectionLimit}
                </p>
                <p className="c-course-openings-metric__label">
                  已选订单 / {fillableGroups.length > 0 ? "可补名额" : "新组容量"}
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

          {fillableGroups.length > 0 ? (
            <p className="c-course-openings-form__hint">
              已找到 {fillableGroups.length} 个同教练同套餐未满组，将按最早创建顺序补入，最多可选 {fillableRemainingCapacity} 个订单。
            </p>
          ) : null}

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
    </div>
  );
}
