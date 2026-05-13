import { NavLink, Outlet } from "react-router-dom";

import { cn } from "../../utils/cn";

const courseOpeningTabs = [
  { label: "开课组", path: "groups" },
  { label: "教练视角", path: "coaches" },
  { label: "订单视角", path: "orders" },
] as const;

export function CourseOpeningsLayout() {
  return (
    <div className="c-dashboard-shell">
      <header className="c-dashboard-header">
        <nav
          aria-label="开课管理模块"
          className="c-dashboard-tabs"
        >
          {courseOpeningTabs.map((item) => (
            <NavLink
              key={item.path}
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
