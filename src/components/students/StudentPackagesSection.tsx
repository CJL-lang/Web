import { ChevronRight, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  toneForPackageStatus,
  type StudentAdminPackage,
} from "../../mocks/studentProfiles";
import { cn } from "../../utils/cn";

function statusToneClass(status: StudentAdminPackage["status"]) {
  const tone = toneForPackageStatus(status);
  if (tone === "success") {
    return "c-student-detail__package-status--success";
  }
  if (tone === "active") {
    return "c-student-detail__package-status--active";
  }
  return "c-student-detail__package-status--muted";
}

function formatPeriod(period: StudentAdminPackage["detail"]["period"]) {
  return `${period.start} — ${period.end}`;
}

function remainingLabel(
  overview: StudentAdminPackage["detail"]["overview"],
): string {
  const { completedLessons, totalLessons } = overview;
  if (totalLessons <= 0) {
    return "—";
  }
  if (completedLessons >= totalLessons) {
    return `已全部完成（${completedLessons}/${totalLessons}）`;
  }
  const left = totalLessons - completedLessons;
  return `剩余 ${left} 课时 · 进度 ${completedLessons}/${totalLessons}`;
}

interface StudentPackagesSectionProps {
  packages: StudentAdminPackage[];
}

export function StudentPackagesSection({ packages }: StudentPackagesSectionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const selected = useMemo(
    () => packages.find((p) => p.id === selectedId) ?? null,
    [packages, selectedId],
  );

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) {
      return undefined;
    }
    if (selected) {
      if (!el.open) {
        el.showModal();
      }
    } else if (el.open) {
      el.close();
    }
    return undefined;
  }, [selected]);

  const closeDialog = () => {
    setSelectedId(null);
  };

  return (
    <>
      <ul className="c-student-detail__package-list" role="list">
        {packages.map((pkg) => (
          <li key={pkg.id} className="c-student-detail__package-row">
            <button
              aria-label={`查看「${pkg.name}」详情`}
              className="c-student-detail__package-row-btn"
              type="button"
              onClick={() => setSelectedId(pkg.id)}
            >
              <div className="c-student-detail__package-main">
                <p className="c-student-detail__package-name">{pkg.name}</p>
              </div>
              <div className="c-student-detail__package-tail">
                <span
                  className={cn(
                    "c-student-detail__package-status",
                    statusToneClass(pkg.status),
                  )}
                >
                  {pkg.status}
                </span>
                <ChevronRight
                  aria-hidden
                  className="c-student-detail__package-chevron"
                  size={20}
                />
              </div>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-labelledby="student-package-dialog-title"
        aria-modal="true"
        className="c-student-package-dialog"
        onClose={closeDialog}
      >
        <div
          className="c-student-package-dialog__surface"
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) {
              dialogRef.current?.close();
            }
          }}
        >
          <div
            className="c-student-package-dialog__panel"
            onPointerDown={(e) => e.stopPropagation()}
          >
            {selected ? (
              <>
                <header className="c-student-package-dialog__header">
                  <div className="c-student-package-dialog__head-text">
                    <p className="c-student-package-dialog__eyebrow">套餐详情</p>
                    <h2
                      className="c-student-package-dialog__title"
                      id="student-package-dialog-title"
                    >
                      {selected.name}
                    </h2>
                  </div>
                  <button
                    aria-label="关闭"
                    className="c-student-package-dialog__close"
                    type="button"
                    onClick={() => dialogRef.current?.close()}
                  >
                    <X aria-hidden size={22} />
                  </button>
                </header>

                <div className="c-student-package-dialog__hero">
                  <p className="c-student-package-dialog__meta">
                    <span className="c-student-package-dialog__meta-label">
                      套餐状态
                    </span>
                    <span className="c-student-package-dialog__meta-value">
                      <span
                        className={cn(
                          "c-student-detail__package-status c-student-detail__package-status--dialog-chip",
                          statusToneClass(selected.status),
                        )}
                      >
                        {selected.status}
                      </span>
                    </span>
                  </p>
                  <p className="c-student-package-dialog__meta">
                    <span className="c-student-package-dialog__meta-label">
                      套餐周期
                    </span>
                    <span className="c-student-package-dialog__meta-value">
                      {formatPeriod(selected.detail.period)}
                    </span>
                  </p>
                  <p className="c-student-package-dialog__meta">
                    <span className="c-student-package-dialog__meta-label">
                      课时进度
                    </span>
                    <span className="c-student-package-dialog__meta-value">
                      {remainingLabel(selected.detail.overview)}
                    </span>
                  </p>
                </div>

                <section className="c-student-package-dialog__section">
                  <h3 className="c-student-package-dialog__section-title">
                    {selected.detail.planSummary.title}
                  </h3>
                  <p className="c-student-package-dialog__section-desc">
                    {selected.detail.planSummary.description}
                  </p>
                </section>

                <section className="c-student-package-dialog__section">
                  <h3 className="c-student-package-dialog__section-title">
                    课程大纲
                  </h3>
                  <ul className="c-student-package-dialog__outline">
                    {selected.detail.courseOutline.map((line) => (
                      <li
                        key={line.id}
                        className="c-student-package-dialog__outline-item"
                      >
                        <div className="c-student-package-dialog__outline-head">
                          <p className="c-student-package-dialog__outline-title">
                            {line.title}
                          </p>
                          <span className="c-student-package-dialog__outline-status">
                            {line.statusLabel}
                          </span>
                        </div>
                        <p className="c-student-package-dialog__outline-desc">
                          {line.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              </>
            ) : null}
          </div>
        </div>
      </dialog>
    </>
  );
}
