import { ChevronLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { SectionCard } from "../../components/ui/SectionCard";
import { useAdminData } from "../../context/AdminDataContext";
import { getCourseOpeningGroupDisplayStatus } from "../../mocks/courseOpenings";
import {
  coachSessionStatusPillClass,
  courseOpeningGroupStatusPillClass,
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

export function CoachDetailPage() {
  const { coachId } = useParams<{ coachId: string }>();
  const { coaches, courseOpeningGroups, orders, packages, students } =
    useAdminData();
  const [avatarFailed, setAvatarFailed] = useState(false);

  const coach = coachId ? coaches.find((c) => c.id === coachId) : undefined;

  const studentCount = useMemo(() => {
    if (!coach) {
      return 0;
    }
    return students.filter((s) => s.coach === coach.name).length;
  }, [coach, students]);

  const openingGroups = useMemo(() => {
    if (!coach) {
      return [];
    }
    return courseOpeningGroups.filter((group) => group.coachId === coach.id);
  }, [coach, courseOpeningGroups]);

  const openedOrderCount = useMemo(() => {
    return openingGroups
      .filter((group) => group.status === "已开课")
      .reduce((sum, group) => sum + group.orderIds.length, 0);
  }, [openingGroups]);

  const openedStudentCount = useMemo(() => {
    const ids = new Set<string>();
    for (const group of openingGroups) {
      if (group.status !== "已开课") {
        continue;
      }
      for (const orderId of group.orderIds) {
        const order = orders.find((item) => item.id === orderId);
        if (order) {
          ids.add(order.studentId);
        }
      }
    }
    return ids.size;
  }, [openingGroups, orders]);

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
            <dd className="c-coach-detail__dd">
              <span
                className={cn(
                  "c-order-status",
                  coachSessionStatusPillClass(coach.sessionStatus),
                )}
              >
                {coach.sessionStatus}
              </span>
            </dd>
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
          <div>
            <dt className="c-coach-detail__dt">已开启订单</dt>
            <dd className="c-coach-detail__dd">{openedOrderCount} 单</dd>
          </div>
          <div>
            <dt className="c-coach-detail__dt">已开启学员</dt>
            <dd className="c-coach-detail__dd">{openedStudentCount} 人</dd>
          </div>
        </dl>
      </SectionCard>

      <SectionCard title="开课组">
        {openingGroups.length === 0 ? (
          <p className="c-resource-list__empty">当前教练暂无开课组。</p>
        ) : (
          <ul className="c-course-openings-group-list">
            {openingGroups.map((group) => {
              const pkg = packages.find((item) => item.id === group.packageId);
              const capacity = pkg?.coachStudentRatio ?? group.orderIds.length;
              const displayStatus = getCourseOpeningGroupDisplayStatus(
                group,
                packages,
              );

              return (
                <li key={group.id} className="c-course-openings-group">
                  <div className="c-course-openings-group__header">
                    <div>
                      <h3 className="c-course-openings-group__title">
                        {group.id}
                      </h3>
                      <p className="c-course-openings-group__subtitle">
                        {pkg?.name ?? "未知套餐"} · {group.orderIds.length}/
                        {capacity} 人 · {formatIsoMinute(group.openedAt)}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "c-order-status",
                        courseOpeningGroupStatusPillClass(displayStatus),
                      )}
                    >
                      {displayStatus}
                    </span>
                  </div>
                  <ul className="c-course-openings-group__orders">
                    {group.orderIds.map((orderId) => {
                      const order = orders.find((item) => item.id === orderId);
                      const student = order
                        ? students.find((item) => item.id === order.studentId)
                        : undefined;

                      return (
                        <li
                          key={orderId}
                          className="c-course-openings-group__order"
                        >
                          <span className="c-course-openings-group__order-title">
                            {student?.name ?? "未知学员"}
                          </span>
                          <Link
                            className="c-course-openings-group__order-meta"
                            to={`/orders/${encodeURIComponent(orderId)}`}
                          >
                            {orderId}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        )}
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
