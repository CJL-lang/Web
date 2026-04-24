import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import {
  leaveRequestSeed,
  type CourseLeaveRequest,
  type LeaveApplicantRole,
  type LeaveRequestStatus,
} from "../../mocks/leaveRequests";
import { cn } from "../../utils/cn";

const ROLE_ALL = "__all__" as const;
const STATUS_ALL = "__all__" as const;

const ROLE_OPTIONS: { value: typeof ROLE_ALL | LeaveApplicantRole; label: string }[] = [
  { value: ROLE_ALL, label: "全部对象" },
  { value: "student", label: "学员" },
  { value: "coach", label: "教练" },
];

const STATUS_OPTIONS: { value: typeof STATUS_ALL | LeaveRequestStatus; label: string }[] = [
  { value: "pending", label: "待处理" },
  { value: STATUS_ALL, label: "全部状态" },
  { value: "approved", label: "已通过" },
  { value: "rejected", label: "已驳回" },
];

function roleLabel(role: LeaveApplicantRole) {
  return role === "coach" ? "教练" : "学员";
}

function statusLabel(status: LeaveRequestStatus) {
  switch (status) {
    case "pending":
      return "待处理";
    case "approved":
      return "已通过";
    case "rejected":
      return "已驳回";
    default:
      return status;
  }
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export function ApprovalsPage() {
  const [rows, setRows] = useState<CourseLeaveRequest[]>(() => [...leaveRequestSeed]);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<typeof ROLE_ALL | LeaveApplicantRole>(ROLE_ALL);
  const [statusFilter, setStatusFilter] = useState<typeof STATUS_ALL | LeaveRequestStatus>(
    "pending"
  );

  const filtered = useMemo(() => {
    const q = normalize(query);
    return rows.filter((row) => {
      if (roleFilter !== ROLE_ALL && row.role !== roleFilter) {
        return false;
      }
      if (statusFilter !== STATUS_ALL && row.status !== statusFilter) {
        return false;
      }
      if (!q) {
        return true;
      }
      const haystack = normalize(
        `${row.applicantName} ${row.courseLabel} ${row.reason} ${row.id} ${row.sessionDateLabel}`
      );
      return haystack.includes(q);
    });
  }, [query, roleFilter, rows, statusFilter]);

  const setStatus = (id: string, status: Exclude<LeaveRequestStatus, "pending">) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  return (
    <div className="space-y-5 md:space-y-6">
      <PageHeader eyebrow="Approvals" title="批准申请" />

      <div
        className="flex flex-col gap-3 rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-soft)] p-4 md:flex-row md:flex-wrap md:items-end md:gap-4"
        role="search"
        aria-label="搜索与筛选请假申请"
      >
        <div className="relative min-w-0 flex-1 md:min-w-[240px]">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]"
          />
          <input
            autoComplete="off"
            className="c-field-input w-full pl-10"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索姓名、课程、原因或编号"
            type="search"
            value={query}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-3">
          <label className="flex min-w-0 flex-col gap-1 sm:min-w-[9.5rem]">
            <span className="text-xs font-medium text-[var(--color-text-muted)]">
              申请对象
            </span>
            <select
              className="c-field-input cursor-pointer"
              onChange={(e) =>
                setRoleFilter(e.target.value as typeof ROLE_ALL | LeaveApplicantRole)
              }
              value={roleFilter}
            >
              {ROLE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex min-w-0 flex-col gap-1 sm:min-w-[9.5rem]">
            <span className="text-xs font-medium text-[var(--color-text-muted)]">
              状态
            </span>
            <select
              className="c-field-input cursor-pointer"
              onChange={(e) =>
                setStatusFilter(e.target.value as typeof STATUS_ALL | LeaveRequestStatus)
              }
              value={statusFilter}
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <section aria-label="请假申请列表">
        {filtered.length === 0 ? (
          <p className="m-0 rounded-[24px] border border-dashed border-[var(--color-border-subtle)] bg-[var(--color-surface-soft)] px-4 py-10 text-center text-sm text-[var(--color-text-secondary)]">
            没有符合条件的申请，请调整搜索或筛选条件。
          </p>
        ) : (
          <ul className="m-0 list-none space-y-3 p-0">
            {filtered.map((row) => (
              <li key={row.id}>
                <article
                  className={cn(
                    "flex flex-col gap-4 rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-soft)] p-4 md:flex-row md:items-stretch md:gap-5 md:p-5"
                  )}
                >
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[var(--color-surface-alt)] px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                        {roleLabel(row.role)}
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          row.status === "pending" &&
                            "bg-[rgba(236,171,19,0.12)] text-[var(--color-brand)]",
                          row.status === "approved" &&
                            "bg-[rgba(52,169,108,0.14)] text-[var(--color-success)]",
                          row.status === "rejected" &&
                            "bg-[rgba(220,94,94,0.12)] text-[var(--color-danger)]"
                        )}
                      >
                        {statusLabel(row.status)}
                      </span>
                      <span className="text-xs text-[var(--color-text-muted)]">{row.id}</span>
                    </div>
                    <p className="text-base font-semibold text-[var(--color-text-primary)]">
                      {row.applicantName}
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {row.courseLabel}
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      涉及上课：{row.sessionDateLabel}
                    </p>
                    <p className="m-0 text-sm text-[var(--color-text-primary)]">
                      <span className="text-[var(--color-text-muted)]">原因：</span>
                      {row.reason}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      提交于 {row.submittedAtLabel}
                    </p>
                  </div>

                  {row.status === "pending" ? (
                    <div className="flex shrink-0 flex-col justify-center gap-2 border-t border-[var(--color-border-subtle)] pt-4 md:w-[11rem] md:border-l md:border-t-0 md:pl-5 md:pt-0">
                      <Button
                        type="button"
                        variant="primary"
                        onClick={() => setStatus(row.id, "approved")}
                      >
                        批准
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => setStatus(row.id, "rejected")}
                      >
                        驳回
                      </Button>
                    </div>
                  ) : null}
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
