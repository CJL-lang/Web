import { NavLink } from "react-router-dom";

import { navigationItems } from "../../constants/navigation";
import { cn } from "../../utils/cn";

export function MobileNav() {
  return (
    <nav className="md:hidden">
      <div className="flex gap-3 overflow-x-auto rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-3 shadow-[var(--shadow-soft)]">
        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            className={({ isActive }) =>
              cn(
                "inline-flex min-h-11 min-w-fit items-center rounded-2xl px-4 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-[color:rgba(236,171,19,0.14)] text-[var(--color-brand)]"
                  : "bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)]"
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
