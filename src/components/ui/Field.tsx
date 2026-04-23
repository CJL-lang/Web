import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

import { cn } from "../../utils/cn";

interface FieldShellProps {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

function FieldShell({ children, error, hint, label }: FieldShellProps) {
  return (
    <label className="c-field-shell">
      <span className="c-field-shell__label-row">
        <span className="c-field-shell__label">{label}</span>
        {hint ? (
          <span className="c-field-shell__hint">{hint}</span>
        ) : null}
      </span>
      {children}
      {error ? (
        <span className="c-field-shell__error">{error}</span>
      ) : null}
    </label>
  );
}

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function InputField({
  className,
  error,
  hint,
  label,
  ...props
}: InputFieldProps) {
  return (
    <FieldShell error={error} hint={hint} label={label}>
      <input className={cn("c-field-input", className)} {...props} />
    </FieldShell>
  );
}

interface TextareaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function TextareaField({
  className,
  error,
  hint,
  label,
  ...props
}: TextareaFieldProps) {
  return (
    <FieldShell error={error} hint={hint} label={label}>
      <textarea className={cn("c-field-textarea", className)} {...props} />
    </FieldShell>
  );
}
