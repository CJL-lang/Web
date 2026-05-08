import { NavLink } from "react-router-dom";

import { navigationItems } from "../../constants/navigation";
import { cn } from "../../utils/cn";
import { AcademyBrand } from "./AcademyBrand";

export function Sidebar() {
  return (
    <aside className="c-sidebar">
      <div className="c-sidebar__brand-row">
        <AcademyBrand />
      </div>

      <nav className="c-sidebar__nav">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              className={({ isActive }) =>
                cn(
                  "group c-sidebar-navlink",
                  isActive
                    ? "c-sidebar-navlink--active"
                    : "c-sidebar-navlink--inactive"
                )
              }
              to={item.path}
            >
              {({ isActive }) => (
                <div className="c-sidebar-navlink__row">
                  <div
                    className={cn(
                      "c-sidebar-navlink__icon",
                      isActive
                        ? "c-sidebar-navlink__icon--active"
                        : "c-sidebar-navlink__icon--inactive"
                    )}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="c-sidebar-navlink__text-stack">
                    <div
                      className={cn(
                        "c-sidebar-navlink__title",
                        isActive
                          ? "c-sidebar-navlink__title--active"
                          : "c-sidebar-navlink__title--inactive"
                      )}
                    >
                      {item.label}
                    </div>
                    <p className="c-sidebar-navlink__desc">{item.description}</p>
                  </div>
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
