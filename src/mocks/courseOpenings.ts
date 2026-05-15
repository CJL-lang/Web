import type { PackageListItem } from "./packages";

export const ORDER_OPENING_STATUSES = ["未开启", "已开启"] as const;

export type OrderOpeningStatus = (typeof ORDER_OPENING_STATUSES)[number];

export const COURSE_OPENING_GROUP_STATUSES = ["未满人", "已开课"] as const;

export type CourseOpeningGroupStatus =
  (typeof COURSE_OPENING_GROUP_STATUSES)[number];

export const COURSE_OPENING_GROUP_DISPLAY_STATUSES = [
  "未满人",
  "已开课",
] as const;

export type CourseOpeningGroupDisplayStatus =
  (typeof COURSE_OPENING_GROUP_DISPLAY_STATUSES)[number];

export interface CourseOpeningGroup {
  id: string;
  coachId: string;
  packageId: string;
  orderIds: string[];
  status: CourseOpeningGroupStatus;
  openedAt: string;
  /** 计划/实际首节开课时刻；null 表示尚未确定 */
  startsAt: string | null;
  updatedAt: string;
}

export const INITIAL_COURSE_OPENING_GROUPS: CourseOpeningGroup[] = [
  {
    id: "COG-1001",
    coachId: "CH-1001",
    packageId: "PKG-1",
    orderIds: ["ORD-1001"],
    status: "未满人",
    openedAt: "2026-03-13T01:30:00.000Z",
    startsAt: null,
    updatedAt: "2026-03-13T01:30:00.000Z",
  },
];

export function getCourseOpeningGroupCapacity(
  group: CourseOpeningGroup,
  packages: PackageListItem[],
): number {
  return (
    packages.find((item) => item.id === group.packageId)?.coachStudentRatio ??
    group.orderIds.length
  );
}

export function getCourseOpeningGroupRemainingCapacity(
  group: CourseOpeningGroup,
  packages: PackageListItem[],
): number {
  return Math.max(0, getCourseOpeningGroupCapacity(group, packages) - group.orderIds.length);
}

export function getCourseOpeningGroupDisplayStatus(
  group: CourseOpeningGroup,
): CourseOpeningGroupDisplayStatus {
  if (group.status === "已开课") {
    return "已开课";
  }
  return "未满人";
}

export function getOrderOpeningStatus(
  orderId: string,
  groups: CourseOpeningGroup[],
): OrderOpeningStatus {
  const group = findCourseOpeningGroupByOrderId(orderId, groups);
  if (!group) {
    return "未开启";
  }
  return group.status === "已开课" ? "已开启" : "未开启";
}

export function findCourseOpeningGroupByOrderId(
  orderId: string,
  groups: CourseOpeningGroup[],
): CourseOpeningGroup | undefined {
  return groups.find((group) => group.orderIds.includes(orderId));
}
