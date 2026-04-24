import { ChevronLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { SectionCard } from "../../components/ui/SectionCard";
import { useAdminData } from "../../context/AdminDataContext";

export function CoachDetailPage() {
  const { coachId } = useParams<{ coachId: string }>();
  const { coaches, students } = useAdminData();
  const [avatarFailed, setAvatarFailed] = useState(false);

  const coach = coachId ? coaches.find((c) => c.id === coachId) : undefined;

  const studentCount = useMemo(() => {
    if (!coach) {
      return 0;
    }
    return students.filter((s) => s.coach === coach.name).length;
  }, [coach, students]);

  if (!coachId) {
    return <Navigate replace to="/coaches" />;
  }

  if (!coach) {
    return <Navigate replace to="/coaches" />;
  }

  const telHref = `tel:${coach.phone.replace(/\s+/g, "")}`;

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface-alt)] px-4 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-alt-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]/60"
          to="/coaches"
        >
          <ChevronLeft aria-hidden className="h-4 w-4" />
          返回教练列表
        </Link>
      </div>

      <header className="flex flex-col gap-4 rounded-[28px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-soft)] p-5 shadow-[var(--shadow-soft)] sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[22px] bg-gradient-to-br from-[color:rgba(236,171,19,0.35)] to-[color:rgba(90,70,30,0.55)] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
          {avatarFailed || !coach.avatarUrl.trim() ? (
            <span className="flex h-full w-full items-center justify-center text-xl font-bold tracking-tight text-[var(--color-ink-strong)]">
              {coach.initials}
            </span>
          ) : (
            <img
              alt=""
              className="h-full w-full object-cover"
              decoding="async"
              height={120}
              loading="eager"
              src={coach.avatarUrl}
              width={120}
              onError={() => setAvatarFailed(true)}
            />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)] md:text-[1.75rem]">
            {coach.name}
          </h1>
          <p className="m-0 text-sm font-medium text-[var(--color-text-secondary)]">
            {coach.title}
          </p>
          <p className="m-0 text-sm text-[var(--color-text-muted)]">{coach.tagline}</p>
        </div>
      </header>

      <SectionCard title="状态与联系">
        <dl className="m-0 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              当前带教状态
            </dt>
            <dd className="mt-1 m-0 text-sm font-medium text-[var(--color-text-primary)]">
              {coach.sessionStatus}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              联系电话
            </dt>
            <dd className="mt-1 m-0 text-sm font-medium text-[var(--color-text-primary)]">
              <a
                className="text-[var(--color-brand)] underline-offset-2 hover:underline"
                href={telHref}
              >
                {coach.phone}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              带队最佳
            </dt>
            <dd className="mt-1 m-0 text-sm font-medium text-[var(--color-text-primary)]">
              {coach.bestScoreShort}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              带教学员
            </dt>
            <dd className="mt-1 m-0 text-sm font-medium text-[var(--color-text-primary)]">
              {studentCount} 人（与学员管理 mock 一致）
            </dd>
          </div>
        </dl>
      </SectionCard>

      <SectionCard title="简介">
        <p className="m-0 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {coach.bio}
        </p>
      </SectionCard>

      <SectionCard title="擅长方向">
        <ol className="m-0 list-none space-y-3 p-0">
          {coach.specialties.map((text, i) => (
            <li
              key={text}
              className="flex gap-3 rounded-[20px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-alt)] px-4 py-3"
            >
              <span
                aria-hidden
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[rgba(236,171,19,0.14)] text-xs font-bold text-[var(--color-brand)]"
              >
                {i + 1}
              </span>
              <span className="text-sm text-[var(--color-text-primary)]">{text}</span>
            </li>
          ))}
        </ol>
      </SectionCard>
    </>
  );
}
