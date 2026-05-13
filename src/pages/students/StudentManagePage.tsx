import { ChevronLeft, Phone, UserRound } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";

import { StudentBadgeWall } from "../../components/students/StudentBadgeWall";
import { StudentPackagesSection } from "../../components/students/StudentPackagesSection";
import { SectionCard } from "../../components/ui/SectionCard";
import { useAdminData } from "../../context/AdminDataContext";
import { getStudentProfileFromListItem } from "../../mocks/studentProfiles";
import { normalizeEnrollmentStatus } from "../../mocks/students";
import { studentEnrollmentStatusPillClass } from "../../utils/bizStatusPills";
import { cn } from "../../utils/cn";

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
  const enrollmentStatus = normalizeEnrollmentStatus(profile.status);

  return (
    <>
      <div className="c-student-detail__toolbar">
        <Link className="c-student-detail__back-link" to="/students">
          <ChevronLeft aria-hidden className="c-icon-back" />
          返回学员列表
        </Link>
      </div>

      <header className="c-student-detail__hero">
        <div aria-hidden className="c-student-detail__avatar">
          {profile.name.slice(0, 1)}
        </div>
        <div className="c-student-detail__hero-main">
          <h1 className="c-student-detail__display-name">{profile.name}</h1>
          <div className="c-student-detail__meta-line">
            <span>
              学号{" "}
              <span className="c-student-detail__school-no-emphasis">
                {profile.schoolNo}
              </span>
            </span>
            <span>
              {profile.age} 岁 · {profile.gender}
            </span>
            <span
              className={cn(
                "c-order-status",
                studentEnrollmentStatusPillClass(enrollmentStatus),
              )}
            >
              {enrollmentStatus}
            </span>
          </div>
        </div>
      </header>

      <div className="c-student-detail__cards-grid">
        <SectionCard title="获得的勋章">
          <StudentBadgeWall badges={profile.badges} />
        </SectionCard>

        <SectionCard title="家长与教练">
          <div className="c-student-detail__contacts-stack">
            <div>
              <h3 className="c-student-detail__section-heading">关联家长</h3>
              <ul className="c-student-detail__parent-list">
                {profile.parents.map((p, i) => (
                  <li
                    key={`${p.userId ?? p.phone}-${i}`}
                    className="c-student-detail__parent-card"
                  >
                    <div className="c-student-detail__parent-card-header">
                      <p className="c-student-detail__parent-name">{p.name}</p>
                      <span className="c-student-detail__parent-relation">
                        {p.relation}
                      </span>
                    </div>
                    <p className="c-student-detail__parent-phone-row">
                      <Phone aria-hidden className="c-icon-phone-inline" />
                      {p.phone}
                    </p>
                    <dl className="c-student-detail__parent-profile-list">
                      {p.occupation ? (
                        <div className="c-student-detail__parent-profile-row">
                          <dt>职业</dt>
                          <dd>{p.occupation}</dd>
                        </div>
                      ) : null}
                      {p.emergencyContact ? (
                        <div className="c-student-detail__parent-profile-row">
                          <dt>紧急联系方式</dt>
                          <dd>{p.emergencyContact}</dd>
                        </div>
                      ) : null}
                      {p.homeAddress ? (
                        <div className="c-student-detail__parent-profile-row c-student-detail__parent-profile-row--wide">
                          <dt>家庭住址</dt>
                          <dd>{p.homeAddress}</dd>
                        </div>
                      ) : null}
                    </dl>
                  </li>
                ))}
              </ul>
            </div>

            <div className="c-student-detail__coach-divider">
              <h3 className="c-student-detail__section-heading">关联教练</h3>
              <div className="c-student-detail__coach-card">
                <div
                  aria-hidden
                  className="c-student-detail__coach-icon-wrap"
                >
                  <UserRound className="c-icon-profile" />
                </div>
                <div className="c-student-detail__coach-body">
                  <p className="c-student-detail__coach-name">
                    {profile.coachProfile.name}
                  </p>
                  <p className="c-student-detail__coach-title">
                    {profile.coachProfile.title}
                  </p>
                  <p className="c-student-detail__coach-specialty">
                    擅长：{profile.coachProfile.specialty}
                  </p>
                  <p className="c-student-detail__coach-phone">
                    <Phone aria-hidden className="c-icon-phone" />
                    {profile.coachProfile.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          className="c-section-card--grid-span-2"
          title="套餐列表"
        >
          <StudentPackagesSection packages={profile.packages} />
        </SectionCard>
      </div>
    </>
  );
}
