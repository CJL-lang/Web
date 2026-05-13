import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, NavLink } from "react-router-dom";

import { PageHeader } from "../../components/ui/PageHeader";
import { ResourceListColumnHead } from "../../components/ui/ResourceListColumnHead";
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
          <>
            <ResourceListColumnHead
              columns={[
                { key: "primary", variant: "primary", label: "套餐" },
                {
                  key: "price",
                  variant: "stat",
                  label: "价格",
                  className: "c-package-list__stat",
                },
                {
                  key: "ratio",
                  variant: "stat",
                  label: "班型",
                  className: "c-package-list__stat",
                },
                {
                  key: "lessons",
                  variant: "stat",
                  label: "课时",
                  className: "c-resource-list__stat--fixed",
                },
              ]}
            />
            <ul className="c-resource-list__list">
              {filtered.map((item) => (
                <li key={item.id}>
                  <NavLink
                    aria-label={`查看套餐：${item.name}`}
                    className={({ isPending }) =>
                      cn(
                        "c-resource-list__row c-package-list__row",
                        isPending && "c-resource-list__row--pending"
                      )
                    }
                    to={`/packages/${encodeURIComponent(item.id)}`}
                  >
                    <div className="c-resource-list__title-block">
                      <p className="c-resource-list__title">{item.name}</p>
                    </div>

                    <div className="c-resource-list__stat c-package-list__stat c-resource-list__stat--value-only">
                      <p className="c-resource-list__stat-value">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="c-resource-list__stat c-package-list__stat c-resource-list__stat--value-only">
                      <p className="c-resource-list__stat-value--plain">
                        1 对 {item.coachStudentRatio}
                      </p>
                    </div>

                    <div className="c-resource-list__stat c-resource-list__stat--fixed c-resource-list__stat--value-only">
                      <p className="c-resource-list__stat-value--plain">
                        {item.lessonCount} 节
                      </p>
                    </div>
                  </NavLink>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </>
  );
}
