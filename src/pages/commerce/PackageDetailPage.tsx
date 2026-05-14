import { ChevronLeft, Pencil } from "lucide-react";
import { useMemo, type ReactNode } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";

import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { useAdminData } from "../../context/AdminDataContext";
import {
  formatPackageLessonCount,
  formatPackagePrice,
  formatPackageRatio,
  type PackageStatus,
} from "../../mocks/packages";
import { cn } from "../../utils/cn";
import { sanitizeInternalReturnPath } from "../../utils/internalReturnPath";

const packageStatusClass: Record<PackageStatus, string> = {
  草稿: "c-package-status--draft",
  已上架: "c-package-status--active",
  已过期: "c-package-status--expired",
};

// 详情表格行
function DetailTableRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <tr>
      <th className="c-order-detail-table__label" scope="row">
        {label}
      </th>
      <td className="c-order-detail-table__value">{value}</td>
    </tr>
  );
}

type PackageDetailLocationState = {
  returnTo?: string;
};

function packageDetailReturnPathFromState(state: unknown): string {
  if (state && typeof state === "object") {
    const returnTo = sanitizeInternalReturnPath(
      (state as PackageDetailLocationState).returnTo,
    );
    if (returnTo) {
      return returnTo;
    }
  }
  return "/packages";
}

function packageDetailBackLinkLabel(path: string): string {
  if (
    path === "/course-openings/groups" ||
    path.startsWith("/course-openings/groups/")
  ) {
    return "返回开课组";
  }
  return "返回套餐列表";
}

// 套餐详情页面
export function PackageDetailPage() {
  const { packageId } = useParams<{ packageId: string }>();
  const location = useLocation();
  const returnPath = packageDetailReturnPathFromState(location.state);
  const { expirePackage, packages } = useAdminData();

  const pkg = useMemo(
    () =>
      packageId
        ? packages.find((item) => item.id === packageId)
        : undefined,
    [packageId, packages],
  );

  if (!packageId || !pkg) {
    return <Navigate replace to="/packages" />;
  }

  return (
    <>
      <PageHeader
        actions={
          <div className="c-order-detail__header-actions">
            <Link
              className="c-button-link-primary c-order-detail__edit-link"
              to={`/packages/${encodeURIComponent(pkg.id)}/edit`}
            >
              <Pencil aria-hidden className="c-order-detail__action-icon" />
              编辑套餐
            </Link>
            {pkg.status === "已上架" ? (
              <Button
                type="button"
                variant="danger"
                onClick={() => expirePackage(pkg.id)}
              >
                下架套餐
              </Button>
            ) : null}
          </div>
        }
        eyebrow="Commerce"
        title="套餐详情"
      />

      <div className="c-order-detail__toolbar">
        <Link className="c-order-detail__back-link" to={returnPath}>
          <ChevronLeft aria-hidden className="c-order-detail__back-icon" />
          {packageDetailBackLinkLabel(returnPath)}
        </Link>
      </div>

      <section
        aria-labelledby="package-detail-table-title"
        className="c-order-detail-table-card"
      >
        <h2
          className="c-order-detail-table-card__title"
          id="package-detail-table-title"
        >
          套餐明细
        </h2>
        <table className="c-order-detail-table">
          <tbody>
            <DetailTableRow label="套餐编号" value={pkg.id} />
            <DetailTableRow
              label="套餐状态"
              value={
                <span
                  className={cn(
                    "c-package-status",
                    packageStatusClass[pkg.status]
                  )}
                >
                  {pkg.status}
                </span>
              }
            />
            <DetailTableRow label="套餐名称" value={pkg.name || "未命名草稿"} />
            <DetailTableRow label="价格" value={formatPackagePrice(pkg.price)} />
            <DetailTableRow
              label="班型"
              value={formatPackageRatio(pkg.coachStudentRatio)}
            />
            <DetailTableRow
              label="课时"
              value={formatPackageLessonCount(pkg.lessonCount)}
            />
            <DetailTableRow
              label="套餐简介"
              value={
                <span className="c-order-detail-table__note">
                  {pkg.introduction || "未填写"}
                </span>
              }
            />
            <DetailTableRow
              label="核心提升计划"
              value={
                <span className="c-order-detail-table__note">
                  {pkg.improvementPlans.length > 0
                    ? pkg.improvementPlans.join("； ")
                    : "暂无提升计划"}
                </span>
              }
            />
          </tbody>
        </table>
      </section>
    </>
  );
}
