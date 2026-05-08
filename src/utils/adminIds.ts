import type { CoachListItem } from "../mocks/coaches";
import type { PackageListItem } from "../mocks/packages";
import type { StudentListItem } from "../mocks/students";

export function nextStudentId(students: StudentListItem[]): string {
  let max = 0;
  for (const s of students) {
    const m = /^ST-(\d+)$/.exec(s.id);
    if (m) {
      max = Math.max(max, parseInt(m[1], 10));
    }
  }
  return `ST-${max + 1}`;
}

export function nextCoachId(coaches: CoachListItem[]): string {
  let max = 0;
  for (const c of coaches) {
    const m = /^CH-(\d+)$/.exec(c.id);
    if (m) {
      max = Math.max(max, parseInt(m[1], 10));
    }
  }
  return `CH-${max + 1}`;
}

export function nextPackageId(packages: PackageListItem[]): string {
  let max = 0;
  for (const p of packages) {
    const m = /^PKG-(\d+)$/.exec(p.id);
    if (m) {
      max = Math.max(max, parseInt(m[1], 10));
    }
  }
  return `PKG-${max + 1}`;
}

export function coachInitialsFromName(name: string): string {
  const base = name.replace(/教练\s*$/u, "").trim();
  if (base.length >= 1) {
    return `${base.slice(0, 1)}教`;
  }
  return name.slice(0, 2) || "教练";
}
