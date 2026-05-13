import type { CourseOpeningGroup } from "../../mocks/courseOpenings";
import type { PackageListItem } from "../../mocks/packages";

export const FILTER_ALL = "__all__";

export function normalize(s: string) {
  return s.trim().toLowerCase();
}

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("zh-CN", {
    currency: "CNY",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(amount);
}

export function formatIsoMinute(input: string) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return "未知时间";
  }
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function createOrderGroupMap(groups: CourseOpeningGroup[]) {
  const map = new Map<string, CourseOpeningGroup>();
  for (const group of groups) {
    for (const orderId of group.orderIds) {
      map.set(orderId, group);
    }
  }
  return map;
}

export function getUnopenedGroupRemainingCapacity(
  group: CourseOpeningGroup,
  packages: PackageListItem[],
) {
  if (group.status === "已开课") {
    return 0;
  }
  const capacity =
    packages.find((item) => item.id === group.packageId)?.coachStudentRatio ??
    group.orderIds.length;
  return Math.max(0, capacity - group.orderIds.length);
}
