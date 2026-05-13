import { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { navigationItems } from "../../constants/navigation";
import { cn } from "../../utils/cn";
import {
  getNavTargetPath,
  isWithinNavSection,
  rememberNavSectionPath,
} from "../../utils/navigation";

const navigationPaths = navigationItems.map((item) => item.path);

export function MobileNav() {
  const location = useLocation();

  useEffect(() => {
    rememberNavSectionPath(location.pathname, navigationPaths);
  }, [location.pathname]);

  return (
    <nav className="c-mobile-nav">
      <div className="c-mobile-nav__strip">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            className={({ isActive }) =>
              cn(
                "c-mobile-nav__link",
                isActive
                  ? "c-mobile-nav__link--active"
                  : "c-mobile-nav__link--inactive"
                )
            }
            replace={isWithinNavSection(location.pathname, item.path)}
            to={getNavTargetPath(location.pathname, item.path)}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
