import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "../../utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const variantClass: Record<ButtonVariant, string> = {
  primary: "c-button--primary",
  secondary: "c-button--secondary",
  ghost: "c-button--ghost",
  danger: "c-button--danger",
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
        "c-button",
        variantClass[variant],
        fullWidth && "c-button--full",
        className
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
