import { ChevronLeft, Phone, UserRound } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";

import { StudentBadgeWall } from "../../components/students/StudentBadgeWall";
import { StudentProgressOverview } from "../../components/students/StudentProgressOverview";
import { SectionCard } from "../../components/ui/SectionCard";
import { useAdminData } from "../../context/AdminDataContext";
import { getStudentProfileFromListItem } from "../../mocks/studentProfiles";

export function StudentManagePage() {
  const { studentId } = useParams<{ studentId: string }>();
  const { students } = useAdminData();

  if (!studentId) {
    return <Navigate replace to="/students" />;
  }

  const listItem = students.find((s) => s.id === studentId);

  if (!listItem) {
    return <Navigate replace to="/students" />;
  }

  const profile = getStudentProfileFromListItem(listItem);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface-alt)] px-4 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-alt-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]/60"
          to="/students"
        >
          <ChevronLeft aria-hidden className="h-4 w-4" />
          返回学员列表
        </Link>
      </div>

      <header className="flex flex-col gap-4 rounded-[28px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-soft)] p-5 shadow-[var(--shadow-soft)] sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        <div
          aria-hidden
          className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[22px] bg-gradient-to-br from-[color:rgba(236,171,19,0.35)] to-[color:rgba(90,70,30,0.55)] text-3xl font-bold tracking-tight text-[var(--color-ink-strong)] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
        >
          {profile.name.slice(0, 1)}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)] md:text-[1.75rem]">
            {profile.name}
          </h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--color-text-secondary)]">
            <span>
              学号{" "}
              <span className="font-medium text-[var(--color-text-primary)]">
                {profile.schoolNo}
              </span>
            </span>
            <span>
              {profile.age} 岁 · {profile.gender}
            </span>
            <span className="rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-alt)] px-2.5 py-0.5 text-xs font-semibold text-[var(--color-text-primary)]">
              {profile.status}
            </span>
          </div>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="获得的勋章">
          <StudentBadgeWall badges={profile.badges} />
        </SectionCard>

        <SectionCard title="家长与教练">
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="m-0 mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                关联家长
              </h3>
              <ul className="m-0 grid list-none gap-3 p-0">
                {profile.parents.map((p, i) => (
                  <li
                    key={`${p.phone}-${i}`}
                    className="rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-alt)] px-4 py-3"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="m-0 font-semibold text-[var(--color-text-primary)]">
                        {p.name}
                      </p>
                      <span className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                        {p.relation}
                      </span>
                    </div>
                    <p className="mt-2 mb-0 flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                      <Phone aria-hidden className="h-3.5 w-3.5 shrink-0" />
                      {p.phone}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[var(--color-border-subtle)] pt-6">
              <h3 className="m-0 mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                关联教练
              </h3>
              <div className="flex gap-4 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-alt)] p-4">
                <div
                  aria-hidden
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-surface-soft)] text-[var(--color-brand)]"
                >
                  <UserRound className="h-7 w-7" />
                </div>
                <div className="min-w-0 space-y-2">
                  <p className="m-0 text-lg font-semibold text-[var(--color-text-primary)]">
                    {profile.coachProfile.name}
                  </p>
                  <p className="m-0 text-sm text-[var(--color-text-secondary)]">
                    {profile.coachProfile.title}
                  </p>
                  <p className="m-0 text-sm text-[var(--color-text-muted)]">
                    擅长：{profile.coachProfile.specialty}
                  </p>
                  <p className="m-0 flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                    <Phone aria-hidden className="h-3.5 w-3.5" />
                    {profile.coachProfile.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          action={
            <button
              className="inline-flex min-h-10 items-center rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-alt)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-alt-hover)]"
              type="button"
            >
              {profile.progressOverview.summary.recordsLabel}
            </button>
          }
          className="lg:col-span-2"
          description={profile.progressOverview.summary.subtitle}
          title={profile.progressOverview.summary.title}
        >
          <StudentProgressOverview overview={profile.progressOverview} />
        </SectionCard>
      </div>

      <SectionCard title="套餐列表">
        <ul className="m-0 divide-y divide-[var(--color-border-subtle)] rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-alt)] p-0 list-none">
          {profile.packages.map((pkg) => (
            <li
              key={pkg.id}
              className="flex flex-col gap-1 px-4 py-3 first:rounded-t-[18px] last:rounded-b-[18px] sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
              <div className="min-w-0">
                <p className="m-0 font-semibold text-[var(--color-text-primary)]">
                  {pkg.name}
                </p>
                <p className="mt-1 mb-0 text-sm text-[var(--color-text-secondary)]">
                  {pkg.summary}
                </p>
              </div>
              <span className="shrink-0 self-start rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--color-text-primary)] sm:self-center">
                {pkg.status}
              </span>
            </li>
          ))}
        </ul>
      </SectionCard>
    </>
  );
}
