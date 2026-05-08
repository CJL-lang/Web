import { Search } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { Button } from "../../components/ui/Button";
import { TextareaField } from "../../components/ui/Field";
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

const APPROVAL_STATUS_CLASS: Record<
  LeaveRequestStatus,
  "c-approval-card__status--pending" | "c-approval-card__status--approved" | "c-approval-card__status--rejected"
> = {
  pending: "c-approval-card__status--pending",
  approved: "c-approval-card__status--approved",
  rejected: "c-approval-card__status--rejected",
};

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
  const rejectDialogRef = useRef<HTMLDialogElement>(null);
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState("");
  const [rejectReasonError, setRejectReasonError] = useState("");

  const rejectTargetRow = useMemo(
    () =>
      rejectTargetId ? rows.find((r) => r.id === rejectTargetId) : undefined,
    [rejectTargetId, rows]
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
        `${row.applicantName} ${row.courseLabel} ${row.reason} ${row.id} ${row.sessionDateLabel} ${row.rejectionReason ?? ""}`
      );
      return haystack.includes(q);
    });
  }, [query, roleFilter, rows, statusFilter]);

  const approveRequest = (id: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" as const } : r))
    );
  };

  const openRejectDialog = (id: string) => {
    setRejectTargetId(id);
    setRejectReasonInput("");
    setRejectReasonError("");
    rejectDialogRef.current?.showModal();
  };

  const handleRejectDialogClose = () => {
    setRejectTargetId(null);
    setRejectReasonInput("");
    setRejectReasonError("");
  };

  const confirmReject = () => {
    const trimmed = rejectReasonInput.trim();
    if (!trimmed) {
      setRejectReasonError("请填写驳回理由");
      return;
    }
    if (!rejectTargetId) {
      return;
    }
    setRows((prev) =>
      prev.map((r) =>
        r.id === rejectTargetId
          ? { ...r, status: "rejected" as const, rejectionReason: trimmed }
          : r
      )
    );
    rejectDialogRef.current?.close();
  };

  return (
    <div className="c-approvals-page">
      <PageHeader eyebrow="Approvals" title="批准申请" />

      <div
        className="c-resource-list__toolbar"
        role="search"
        aria-label="搜索与筛选请假申请"
      >
        <div className="c-resource-list__search-wrap">
          <Search aria-hidden className="c-resource-list__search-icon" />
          <input
            autoComplete="off"
            className="c-field-input c-resource-list__search-field"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索姓名、课程、原因或编号"
            type="search"
            value={query}
          />
        </div>

        <div className="c-resource-list__filters">
          <label className="c-resource-list__filter-field">
            <span className="c-resource-list__filter-label">申请对象</span>
            <select
              className="c-field-input c-resource-list__filter-select"
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

          <label className="c-resource-list__filter-field">
            <span className="c-resource-list__filter-label">状态</span>
            <select
              className="c-field-input c-resource-list__filter-select"
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
          <p className="c-resource-list__empty">
            没有符合条件的申请，请调整搜索或筛选条件。
          </p>
        ) : (
          <ul className="c-resource-list__list">
            {filtered.map((row) => (
              <li key={row.id}>
                <article className="c-approval-card">
                  <div className="c-approval-card__main">
                    <div className="c-approval-card__badge-row">
                      <span className="c-approval-card__role-chip">
                        {roleLabel(row.role)}
                      </span>
                      <span
                        className={cn(
                          "c-approval-card__status",
                          APPROVAL_STATUS_CLASS[row.status]
                        )}
                      >
                        {statusLabel(row.status)}
                      </span>
                      <span className="c-approval-card__id">{row.id}</span>
                    </div>
                    <p className="c-approval-card__name">{row.applicantName}</p>
                    <p className="c-approval-card__line">{row.courseLabel}</p>
                    <p className="c-approval-card__line">
                      涉及上课：{row.sessionDateLabel}
                    </p>
                    <p className="c-approval-card__reason-block">
                      <span className="c-approval-card__reason-label">原因：</span>
                      {row.reason}
                    </p>
                    {row.status === "rejected" && row.rejectionReason ? (
                      <p className="c-approval-card__rejection-block">
                        <span className="c-approval-card__rejection-label">
                          驳回理由：
                        </span>
                        {row.rejectionReason}
                      </p>
                    ) : null}
                    <p className="c-approval-card__meta">
                      提交于 {row.submittedAtLabel}
                    </p>
                  </div>

                  {row.status === "pending" ? (
                    <div className="c-approval-card__actions">
                      <Button
                        type="button"
                        variant="primary"
                        onClick={() => approveRequest(row.id)}
                      >
                        批准
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => openRejectDialog(row.id)}
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

      <dialog
        ref={rejectDialogRef}
        aria-labelledby="approval-reject-dialog-title"
        aria-modal="true"
        className="c-approval-reject-dialog"
        onClose={handleRejectDialogClose}
      >
        <div
          className="c-approval-reject-dialog__surface"
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) {
              rejectDialogRef.current?.close();
            }
          }}
        >
          <div
            className="c-approval-reject-dialog__panel"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <h2
              className="c-approval-reject-dialog__title"
              id="approval-reject-dialog-title"
            >
              驳回请假申请
            </h2>
            {rejectTargetRow ? (
              <p className="c-approval-reject-dialog__meta">
                {rejectTargetRow.applicantName} · {rejectTargetRow.id}
              </p>
            ) : null}
            <TextareaField
              error={rejectReasonError}
              label="驳回理由"
              onChange={(e) => {
                setRejectReasonInput(e.target.value);
                if (rejectReasonError) {
                  setRejectReasonError("");
                }
              }}
              rows={4}
              value={rejectReasonInput}
            />
            <div className="c-approval-reject-dialog__actions">
              <Button
                type="button"
                variant="secondary"
                onClick={() => rejectDialogRef.current?.close()}
              >
                取消
              </Button>
              <Button type="button" variant="danger" onClick={confirmReject}>
                确认驳回
              </Button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}
