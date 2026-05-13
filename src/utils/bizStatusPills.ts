import type {
  CourseOpeningGroupDisplayStatus,
  OrderOpeningStatus,
} from "../mocks/courseOpenings";
import type { StudentEnrollmentStatus } from "../mocks/students";

const coachSessionStatusPill: Record<"上课中" | "空闲", string> = {
  上课中: "c-order-status--active",
  空闲: "c-order-status--idle",
};

export function coachSessionStatusPillClass(sessionStatus: string): string {
  if (sessionStatus === "上课中" || sessionStatus === "空闲") {
    return coachSessionStatusPill[sessionStatus];
  }
  return "c-order-status--idle";
}

const studentStatusPill: Record<StudentEnrollmentStatus, string> = {
  正式学员: "c-order-status--success",
  已过期: "c-order-status--canceled",
};

export function studentEnrollmentStatusPillClass(
  status: StudentEnrollmentStatus,
): string {
  return studentStatusPill[status];
}

const orderOpeningStatusPill: Record<OrderOpeningStatus, string> = {
  未开启: "c-order-status--pending",
  待开课: "c-order-status--pending",
  已开启: "c-order-status--active",
};

export function orderOpeningStatusPillClass(
  status: OrderOpeningStatus,
): string {
  return orderOpeningStatusPill[status];
}

const courseOpeningGroupStatusPill: Record<
  CourseOpeningGroupDisplayStatus,
  string
> = {
  未满人: "c-order-status--pending",
  待开课: "c-order-status--pending",
  已开课: "c-order-status--active",
};

export function courseOpeningGroupStatusPillClass(
  status: CourseOpeningGroupDisplayStatus,
): string {
  return courseOpeningGroupStatusPill[status];
}
