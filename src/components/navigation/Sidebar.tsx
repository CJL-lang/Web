import { NavLink } from "react-router-dom";

import { navigationItems } from "../../constants/navigation";
import { cn } from "../../utils/cn";
import { AcademyBrand } from "./AcademyBrand";

export function Sidebar() {
  return (
    <aside className="flex h-[calc(100vh-3rem)] flex-col rounded-[32px] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-soft)]">
      <div className="border-b border-[var(--color-border-subtle)] px-3 pb-5 pt-2">
        <AcademyBrand />
      </div>

      <nav className="mt-5 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              className={({ isActive }) =>
                cn(
                  "group rounded-[24px] border border-transparent px-4 py-4 transition duration-200",
                  isActive
                    ? "border-[var(--color-border-strong)] bg-[var(--color-surface-alt)]"
                    : "hover:bg-[var(--color-surface-soft)]"
                )
              }
              to={item.path}
            >
              {({ isActive }) => (
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl transition",
                      isActive
                        ? "bg-[color:rgba(236,171,19,0.12)] text-[var(--color-brand)]"
                        : "bg-[var(--color-surface-soft)] text-[var(--color-text-secondary)]"
                    )}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="space-y-1">
                    <div
                      className={cn(
                        "text-sm font-semibold transition",
                        isActive
                          ? "text-[var(--color-text-primary)]"
                          : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]"
                      )}
                    >
                      {item.label}
                    </div>
                    <p className="text-xs leading-5 text-[var(--color-text-muted)]">
                      {item.description}
                    </p>
                  </div>
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-soft)] p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
          Layout Notes
        </p>
        <p className="mt-2 text-sm font-medium text-[var(--color-text-primary)]">
          当前先统一桌面端与 iPad 横屏的骨架、导航和内容密度，再逐页接入真实模块。
        </p>
      </div>
    </aside>
  );
}
