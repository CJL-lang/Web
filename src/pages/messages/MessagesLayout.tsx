import { NavLink, Outlet } from "react-router-dom";

import { cn } from "../../utils/cn";

const messageTabs = [
  { label: "发送消息", path: "publish" },
  { label: "历史记录", path: "history" },
] as const;

export function MessagesLayout() {
  return (
    <div className="c-dashboard-shell">
      <header className="c-dashboard-header">
        <nav aria-label="消息模块页签" className="c-dashboard-tabs c-dashboard-tabs--cols-2">
          {messageTabs.map((item) => (
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
