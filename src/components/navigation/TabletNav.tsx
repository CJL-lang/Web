import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { navigationItems } from "../../constants/navigation";
import { cn } from "../../utils/cn";
import {
  getNavTargetPath,
  isWithinNavSection,
  rememberNavSectionPath,
} from "../../utils/navigation";
import { AcademyBrand } from "./AcademyBrand";

const navigationPaths = navigationItems.map((item) => item.path);

export function TabletNav() {
  const location = useLocation();

  useEffect(() => {
    rememberNavSectionPath(location.pathname, navigationPaths);
  }, [location.pathname]);

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
              replace={isWithinNavSection(location.pathname, item.path)}
              title={item.label}
              to={getNavTargetPath(location.pathname, item.path)}
            >
              <Icon size={18} />
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
