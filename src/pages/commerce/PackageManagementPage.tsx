import { ChevronRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import { PageHeader } from "../../components/ui/PageHeader";
import { useAdminData } from "../../context/AdminDataContext";
import { cn } from "../../utils/cn";

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("zh-CN", {
    currency: "CNY",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(price);
}

export function PackageManagementPage() {
  const { packages } = useAdminData();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) {
      return packages;
    }
    return packages.filter((item) => {
      const haystack = normalize(
        [
          item.id,
          item.name,
          item.introduction,
          item.price.toString(),
          `1对${item.coachStudentRatio}`,
          `${item.lessonCount}节课`,
          item.improvementPlans.join(" "),
        ].join(" ")
      );
      return haystack.includes(q);
    });
  }, [packages, query]);

  return (
    <>
      <PageHeader
        actions={
          <Link className="c-button-link-primary" to="/packages/new">
            新建套餐
          </Link>
        }
        eyebrow="Commerce"
        title="套餐管理"
      />

      <div
        className="c-resource-list__toolbar"
        role="search"
        aria-label="搜索套餐"
      >
        <div className="c-resource-list__search-wrap">
          <Search aria-hidden className="c-resource-list__search-icon" />
          <input
            autoComplete="off"
            className="c-field-input c-resource-list__search-field"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索套餐名称、简介、编号、价格或提升计划"
            type="search"
            value={query}
          />
        </div>
      </div>

      <section aria-label="套餐列表">
        {filtered.length === 0 ? (
          <p className="c-resource-list__empty">
            没有符合条件的套餐，请调整搜索条件。
          </p>
        ) : (
          <ul className="c-resource-list__list">
            {filtered.map((item) => (
              <li key={item.id}>
                <NavLink
                  aria-label={`编辑套餐：${item.name}`}
                  className={({ isPending }) =>
                    cn(
                      "group c-resource-list__row c-package-list__row",
                      isPending && "c-resource-list__row--pending"
                    )
                  }
                  to={`/packages/${encodeURIComponent(item.id)}/edit`}
                >
                  <div className="c-resource-list__title-block">
                    <p className="c-resource-list__title">{item.name}</p>
                  </div>

                  <div className="c-resource-list__stat c-package-list__stat">
                    <p className="c-resource-list__stat-label">价格</p>
                    <p className="c-resource-list__stat-value">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  <div className="c-resource-list__stat c-package-list__stat">
                    <p className="c-resource-list__stat-label">班型</p>
                    <p className="c-resource-list__stat-value--plain">
                      1 对 {item.coachStudentRatio}
                    </p>
                  </div>

                  <div className="c-resource-list__stat c-resource-list__stat--fixed">
                    <p className="c-resource-list__stat-label">课时</p>
                    <p className="c-resource-list__stat-value--plain">
                      {item.lessonCount} 节
                    </p>
                  </div>

                  <ChevronRight
                    aria-hidden
                    className="c-resource-list__chevron"
                  />
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
