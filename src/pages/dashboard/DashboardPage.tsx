import { NavLink, Outlet } from "react-router-dom";

import { dashboardModuleTabs } from "../../mocks/dashboard";
import { cn } from "../../utils/cn";

export function DashboardPage() {
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
      </header>

      <div className="c-dashboard-shell__content">
        <Outlet />
      </div>
    </div>
  );
}
