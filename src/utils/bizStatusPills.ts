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
