import { ChevronLeft, Pencil } from "lucide-react";
import { useMemo, type ReactNode } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { PageHeader } from "../../components/ui/PageHeader";
import { useAdminData } from "../../context/AdminDataContext";
// 格式化价格
function formatPrice(price: number) {
  return new Intl.NumberFormat("zh-CN", {
    currency: "CNY",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(price);
}
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
// 套餐详情页面
export function PackageDetailPage() {
  const { packageId } = useParams<{ packageId: string }>();
  const { packages } = useAdminData();

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
          </div>
        }
        eyebrow="Commerce"
        title="套餐详情"
      />

      <div className="c-order-detail__toolbar">
        <Link className="c-order-detail__back-link" to="/packages">
          <ChevronLeft aria-hidden className="c-order-detail__back-icon" />
          返回套餐列表
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
            <DetailTableRow label="套餐名称" value={pkg.name} />
            <DetailTableRow label="价格" value={formatPrice(pkg.price)} />
            <DetailTableRow
              label="班型"
              value={`1 对 ${pkg.coachStudentRatio}`}
            />
            <DetailTableRow label="课时" value={`${pkg.lessonCount} 节`} />
            <DetailTableRow
              label="套餐简介"
              value={
                <span className="c-order-detail-table__note">
                  {pkg.introduction}
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
