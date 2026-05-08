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
      <div className="c-coach-detail__toolbar">
        <Link className="c-coach-detail__back-link" to="/coaches">
          <ChevronLeft aria-hidden className="c-icon-back" />
          返回教练列表
        </Link>
      </div>

      <header className="c-coach-detail__hero">
        <div className="c-coach-detail__avatar-frame">
          {avatarFailed || !coach.avatarUrl.trim() ? (
            <span className="c-coach-detail__avatar-fallback">
              {coach.initials}
            </span>
          ) : (
            <img
              alt=""
              className="c-coach-detail__avatar-img"
              decoding="async"
              height={120}
              loading="eager"
              src={coach.avatarUrl}
              width={120}
              onError={() => setAvatarFailed(true)}
            />
          )}
        </div>
        <div className="c-coach-detail__intro">
          <h1 className="c-coach-detail__name">{coach.name}</h1>
          <p className="c-coach-detail__job-title">{coach.title}</p>
          {coach.tagline.trim() ? (
            <p className="c-coach-detail__tagline">{coach.tagline}</p>
          ) : null}
        </div>
      </header>

      <SectionCard title="状态与联系">
        <dl className="c-coach-detail__dl">
          <div>
            <dt className="c-coach-detail__dt">当前带教状态</dt>
            <dd className="c-coach-detail__dd">{coach.sessionStatus}</dd>
          </div>
          <div>
            <dt className="c-coach-detail__dt">联系电话</dt>
            <dd className="c-coach-detail__dd">
              <a className="c-coach-detail__tel" href={telHref}>
                {coach.phone}
              </a>
            </dd>
          </div>
          <div className="c-coach-detail__dl-row-wide">
            <dt className="c-coach-detail__dt">带教学员</dt>
            <dd className="c-coach-detail__dd">
              {studentCount} 人（与学员管理 mock 一致）
            </dd>
          </div>
        </dl>
      </SectionCard>

      <SectionCard title="简介">
        <p className="c-coach-detail__bio">{coach.bio}</p>
      </SectionCard>

      <SectionCard title="擅长方向">
        <ol className="c-coach-detail__specialty-list">
          {coach.specialties.map((text, i) => (
            <li key={text} className="c-coach-detail__specialty-row">
              <span aria-hidden className="c-coach-detail__specialty-index">
                {i + 1}
              </span>
              <span className="c-coach-detail__specialty-text">{text}</span>
            </li>
          ))}
        </ol>
      </SectionCard>
    </>
  );
}
