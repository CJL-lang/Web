import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "../../utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const variantMap: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-brand)] text-[var(--color-ink-strong)] shadow-[0_14px_30px_rgba(236,171,19,0.22)] hover:bg-[var(--color-brand-strong)]",
  secondary:
    "border border-[var(--color-border-strong)] bg-[var(--color-surface-alt)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-alt-hover)]",
  ghost:
    "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text-primary)]",
  danger:
    "border border-[var(--border-danger)] bg-[var(--surface-danger-soft)] text-[var(--color-danger)] hover:bg-[rgba(220,94,94,0.14)] hover:text-[var(--color-danger)] focus-visible:ring-[var(--color-danger)]/45",
};

export function Button({
  children,
  className,
  fullWidth = false,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]/60 disabled:cursor-not-allowed disabled:opacity-55",
        variantMap[variant],
        fullWidth && "w-full",
        className
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
