import { NavLink, Outlet, useSearchParams } from "react-router-dom";

import { dashboardModuleTabs, dashboardTimeRanges } from "../../mocks/dashboard";
import type { DashboardTimeRange } from "../../types/dashboard";
import { cn } from "../../utils/cn";

const defaultTimeRange: DashboardTimeRange = "30d";

function isDashboardTimeRange(value: string | null): value is DashboardTimeRange {
  return value === "30d" || value === "12m" || value === "term";
}

export interface DashboardOutletContext {
  timeRange: DashboardTimeRange;
}

export function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedRange = searchParams.get("range");
  const timeRange = isDashboardTimeRange(requestedRange)
    ? requestedRange
    : defaultTimeRange;

  function handleRangeChange(nextRange: DashboardTimeRange) {
    const nextSearchParams = new URLSearchParams(searchParams);

    nextSearchParams.set("range", nextRange);
    setSearchParams(nextSearchParams, { replace: true });
  }

  return (
    <div className="c-dashboard-shell">
      <header className="c-dashboard-header">
        <nav className="c-dashboard-tabs" aria-label="统计模块页签">
          {dashboardModuleTabs.map((item) => (
            <NavLink
              key={item.id}
              className={({ isActive }) =>
                cn("c-dashboard-tab", isActive && "is-active")
              }
              to={item.path}
            >
              <span className="c-dashboard-tab__label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="c-dashboard-header__range">
          <div className="c-dashboard-range" aria-label="统计时间范围">
            {dashboardTimeRanges.map((item) => (
              <button
                key={item.id}
                className={cn(
                  "c-dashboard-range__button",
                  item.id === timeRange && "is-active"
                )}
                onClick={() => handleRangeChange(item.id)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="c-dashboard-shell__content">
        <Outlet context={{ timeRange } satisfies DashboardOutletContext} />
      </div>
    </div>
  );
}
