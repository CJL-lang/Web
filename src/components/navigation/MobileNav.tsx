import { NavLink } from "react-router-dom";

import { navigationItems } from "../../constants/navigation";
import { cn } from "../../utils/cn";

export function MobileNav() {
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
            to={item.path}
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
