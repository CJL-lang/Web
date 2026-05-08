import { NavLink } from "react-router-dom";

import { navigationItems } from "../../constants/navigation";
import { cn } from "../../utils/cn";
import { AcademyBrand } from "./AcademyBrand";

export function TabletNav() {
  return (
    <aside className="c-tablet-nav">
      <div className="c-tablet-nav__brand">
        <AcademyBrand compact />
      </div>

      <nav className="c-tablet-nav__nav">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              aria-label={item.label}
              className={({ isActive }) =>
                cn(
                  "c-tablet-nav__link",
                  isActive
                    ? "c-tablet-nav__link--active"
                    : "c-tablet-nav__link--inactive"
                )
              }
              title={item.label}
              to={item.path}
            >
              <Icon size={18} />
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
