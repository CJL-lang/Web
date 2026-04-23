import { NavLink } from "react-router-dom";

import { navigationItems } from "../../constants/navigation";
import { cn } from "../../utils/cn";
import { AcademyBrand } from "./AcademyBrand";

export function TabletNav() {
  return (
    <aside className="sticky top-5 flex h-[calc(100vh-2.5rem)] flex-col items-center rounded-[28px] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3 py-4 shadow-[var(--shadow-soft)]">
      <div className="pb-4">
        <AcademyBrand compact />
      </div>

      <nav className="flex min-h-0 flex-1 flex-col items-center gap-2 overflow-y-auto pt-3">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              aria-label={item.label}
              className={({ isActive }) =>
                cn(
                  "flex min-h-12 w-12 items-center justify-center rounded-2xl border border-transparent transition duration-200",
                  isActive
                    ? "border-[var(--color-border-strong)] bg-[var(--color-surface-alt)] text-[var(--color-brand)]"
                    : "bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
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
