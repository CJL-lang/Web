import { ChevronLeft, Phone, UserRound } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";

import { StudentBadgeWall } from "../../components/students/StudentBadgeWall";
import { StudentPackagesSection } from "../../components/students/StudentPackagesSection";
import { SectionCard } from "../../components/ui/SectionCard";
import { useAdminData } from "../../context/AdminDataContext";
import {
  findCourseOpeningGroupByOrderId,
  getOrderOpeningStatus,
  type OrderOpeningStatus,
} from "../../mocks/courseOpenings";
import { getStudentProfileFromListItem } from "../../mocks/studentProfiles";
import { normalizeEnrollmentStatus } from "../../mocks/students";
import {
  orderOpeningStatusPillClass,
  studentEnrollmentStatusPillClass,
} from "../../utils/bizStatusPills";
import { cn } from "../../utils/cn";

function formatIsoMinute(input: string) {
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

export function StudentManagePage() {
  const { studentId } = useParams<{ studentId: string }>();
  const { coaches, courseOpeningGroups, orders, packages, students } =
    useAdminData();

  if (!studentId) {
    return <Navigate replace to="/students" />;
  }

  const listItem = students.find((s) => s.id === studentId);

  if (!listItem) {
    return <Navigate replace to="/students" />;
  }

  const profile = getStudentProfileFromListItem(listItem);
  const enrollmentStatus = normalizeEnrollmentStatus(profile.status);
  const openingRecords = orders
    .filter((order) => order.studentId === listItem.id && !order.closedAt)
    .map((order) => {
      const group = findCourseOpeningGroupByOrderId(
        order.id,
        courseOpeningGroups,
      );
      const coach = group
        ? coaches.find((item) => item.id === group.coachId)
        : undefined;
      const pkg = packages.find((item) => item.id === order.packageId);
      const openingStatus: OrderOpeningStatus = getOrderOpeningStatus(
        order.id,
        courseOpeningGroups,
      );

      return {
        coach,
        group,
        openingStatus,
        order,
        pkg,
      };
    });

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
          title="开课记录"
        >
          {openingRecords.length === 0 ? (
            <p className="c-resource-list__empty">当前学员暂无订单开课记录。</p>
          ) : (
            <ul className="c-student-detail__opening-list">
              {openingRecords.map(({ coach, group, openingStatus, order, pkg }) => (
                <li key={order.id} className="c-student-detail__opening-row">
                  <div className="c-student-detail__opening-main">
                    <Link
                      className="c-student-detail__opening-title"
                      to={`/orders/${encodeURIComponent(order.id)}`}
                    >
                      {order.id} · {pkg?.name ?? "未知套餐"}
                    </Link>
                    <p className="c-student-detail__opening-meta">
                      {group
                        ? `${coach?.name ?? "未知教练"} · ${group.id} · ${formatIsoMinute(group.openedAt)}`
                        : "未绑定教练"}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "c-order-status",
                      orderOpeningStatusPillClass(openingStatus),
                    )}
                  >
                    {openingStatus}
                  </span>
                </li>
              ))}
            </ul>
          )}
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
