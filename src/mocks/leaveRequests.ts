export type LeaveApplicantRole = "coach" | "student";

export type LeaveRequestStatus = "pending" | "approved" | "rejected";

export interface CourseLeaveRequest {
  id: string;
  role: LeaveApplicantRole;
  applicantName: string;
  courseLabel: string;
  sessionDateLabel: string;
  reason: string;
  submittedAtLabel: string;
  status: LeaveRequestStatus;
  /** 驳回时由审批人填写；已通过 / 待处理通常为空 */
  rejectionReason?: string;
}

export const leaveRequestSeed: CourseLeaveRequest[] = [
  {
    id: "LV-24001",
    role: "student",
    applicantName: "林嘉禾",
    courseLabel: "青少年进阶课 · 小班",
    sessionDateLabel: "2026-04-26（周六）14:00–15:30",
    reason: "校际比赛集训，需缺席本周课程。",
    submittedAtLabel: "2026-04-22 09:12",
    status: "pending",
  },
  {
    id: "LV-24002",
    role: "coach",
    applicantName: "王教练",
    courseLabel: "成人入门体验 · 团课",
    sessionDateLabel: "2026-04-25（周五）19:00–20:00",
    reason: "临时身体不适，申请调换带课。",
    submittedAtLabel: "2026-04-23 16:40",
    status: "pending",
  },
  {
    id: "LV-24003",
    role: "student",
    applicantName: "周亦晨",
    courseLabel: "私教强化包 · 1 对 1",
    sessionDateLabel: "2026-04-27（周日）10:00–11:00",
    reason: "家庭出行，申请顺延一节。",
    submittedAtLabel: "2026-04-23 11:05",
    status: "pending",
  },
  {
    id: "LV-23988",
    role: "student",
    applicantName: "赵以宁",
    courseLabel: "成人入门体验 · 团课",
    sessionDateLabel: "2026-04-20（周日）15:00–16:00",
    reason: "加班无法到场，已提前 48 小时申请。",
    submittedAtLabel: "2026-04-18 20:22",
    status: "approved",
  },
  {
    id: "LV-23990",
    role: "coach",
    applicantName: "刘教练",
    courseLabel: "基础挥杆训练 · 小班",
    sessionDateLabel: "2026-04-21（周一）18:30–20:00",
    reason: "考务冲突，需请假一次。",
    submittedAtLabel: "2026-04-19 08:55",
    status: "rejected",
    rejectionReason: "该时段已有替课安排，请与教务协调改期后再提交。",
  },
];
