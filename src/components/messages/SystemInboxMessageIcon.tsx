import type { FC } from "react";

import type { SystemMessageIconKind } from "../../types/message";

const vb = "0 0 24 24";
const sw = 1.45;

type SvgProps = { className?: string; size?: number };

function SvgBooking({ className, size = 26 }: SvgProps) {
  return (
    <svg
      viewBox={vb}
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      <rect
        x="3.5"
        y="4.5"
        width="17"
        height="16"
        rx="2.2"
        fill="rgba(255,255,255,0.12)"
      />
      <path
        d="M3.5 9.5h17M8 2.5v3M16 2.5v3"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinecap="round"
      />
      <circle
        cx="12"
        cy="14"
        r="3.2"
        stroke="currentColor"
        strokeWidth={sw}
        fill="none"
      />
      <path
        d="M12 12.2v1.6l.9.9"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinecap="round"
      />
    </svg>
  );
}

function SvgAssessment({ className, size = 26 }: SvgProps) {
  return (
    <svg viewBox={vb} width={size} height={size} className={className} aria-hidden>
      <path
        d="M5 17v-6M10 17V8M15 17v-4M20 17V5"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinecap="round"
      />
      <path
        d="M18.5 4.5l1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.8 2.6-.4z"
        fill="rgba(255,255,255,0.2)"
        stroke="currentColor"
        strokeWidth={0.9}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SvgHomework({ className, size = 26 }: SvgProps) {
  return (
    <svg viewBox={vb} width={size} height={size} className={className} aria-hidden>
      <path
        d="M9 3.5h7.5a2 2 0 012 2V19a1.5 1.5 0 01-1.5 1.5H7A1.5 1.5 0 015.5 19V5a1.5 1.5 0 011.5-1.5H9z"
        fill="rgba(255,255,255,0.1)"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      <path
        d="M9 3.5V6a1 1 0 001 1h2a1 1 0 001-1V3.5M8 11h8M8 14.5h6"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinecap="round"
      />
    </svg>
  );
}

function SvgCoachSubstitute({ className, size = 26 }: SvgProps) {
  return (
    <svg viewBox={vb} width={size} height={size} className={className} aria-hidden>
      <circle
        cx="10"
        cy="9"
        r="3.2"
        stroke="currentColor"
        strokeWidth={sw}
        fill="none"
      />
      <path
        d="M5 19.5v-.5a4.5 4.5 0 014.5-4.5h1a4.3 4.3 0 013.8 2.3"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinecap="round"
      />
      <path
        d="M17.5 8v5M15 10.5h5"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinecap="round"
      />
    </svg>
  );
}

function SvgPackageBalance({ className, size = 26 }: SvgProps) {
  return (
    <svg viewBox={vb} width={size} height={size} className={className} aria-hidden>
      <rect
        x="4.5"
        y="11"
        width="12"
        height="9"
        rx="1.5"
        fill="rgba(255,255,255,0.08)"
        stroke="currentColor"
        strokeWidth={sw}
      />
      <rect
        x="6"
        y="7.5"
        width="12"
        height="9"
        rx="1.5"
        fill="rgba(255,255,255,0.06)"
        stroke="currentColor"
        strokeWidth={sw}
      />
      <rect
        x="7.5"
        y="4"
        width="12"
        height="9"
        rx="1.5"
        fill="rgba(255,255,255,0.04)"
        stroke="currentColor"
        strokeWidth={sw}
      />
    </svg>
  );
}

function SvgVenue({ className, size = 26 }: SvgProps) {
  return (
    <svg viewBox={vb} width={size} height={size} className={className} aria-hidden>
      <path
        d="M12 4l7 5.2V19a1 1 0 01-1 1H6a1 1 0 01-1-1V9.2L12 4z"
        fill="rgba(255,255,255,0.08)"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      <path
        d="M10.5 19.5V13h3v6.5"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinecap="round"
      />
    </svg>
  );
}

function SvgHoliday({ className, size = 26 }: SvgProps) {
  return (
    <svg viewBox={vb} width={size} height={size} className={className} aria-hidden>
      <rect
        x="4.5"
        y="5.5"
        width="15"
        height="14"
        rx="2"
        fill="rgba(255,255,255,0.1)"
        stroke="currentColor"
        strokeWidth={sw}
      />
      <path
        d="M4.5 10h15M9 3.5v3M15 3.5v3"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinecap="round"
      />
      <circle cx="17" cy="7" r="2.2" fill="rgba(253, 224, 71, 0.85)" />
    </svg>
  );
}

function SvgPolicy({ className, size = 26 }: SvgProps) {
  return (
    <svg viewBox={vb} width={size} height={size} className={className} aria-hidden>
      <path
        d="M7.5 3.5h6l4 4V19a1.5 1.5 0 01-1.5 1.5h-8.5A1.5 1.5 0 016.5 19V5A1.5 1.5 0 017.5 3.5z"
        fill="rgba(255,255,255,0.08)"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      <path d="M13.5 3.6V8H18" stroke="currentColor" strokeWidth={sw} />
      <path
        d="M9 12h7M9 15h7M9 9h3"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinecap="round"
      />
    </svg>
  );
}

function SvgEventOpen({ className, size = 26 }: SvgProps) {
  return (
    <svg viewBox={vb} width={size} height={size} className={className} aria-hidden>
      <rect
        x="4.5"
        y="5.5"
        width="15"
        height="14"
        rx="2"
        fill="rgba(255,255,255,0.08)"
        stroke="currentColor"
        strokeWidth={sw}
      />
      <path
        d="M4.5 10h15M9 3.5v3M15 3.5v3"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinecap="round"
      />
      <path
        d="M10.5 17l2.2-3.2 2.8 1.4-1.2-4.6 3.2 1.8"
        stroke="rgba(253, 224, 71, 0.95)"
        strokeWidth={1.55}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function SvgPaymentSuccess({ className, size = 26 }: SvgProps) {
  return (
    <svg viewBox={vb} width={size} height={size} className={className} aria-hidden>
      <circle
        cx="12"
        cy="12"
        r="7.5"
        fill="rgba(255,255,255,0.12)"
        stroke="currentColor"
        strokeWidth={sw}
      />
      <path
        d="M8.5 12.2l2.2 2.2 5.2-5.2"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="17.5" cy="7" r="0.9" fill="rgba(253, 224, 71, 0.9)" />
      <circle cx="6.5" cy="16" r="0.75" fill="rgba(253, 224, 71, 0.75)" />
    </svg>
  );
}

function SvgCourseUpdate({ className, size = 26 }: SvgProps) {
  return (
    <svg viewBox={vb} width={size} height={size} className={className} aria-hidden>
      <path
        d="M5.2 9.5A7 7 0 0116.2 6l1.3 1.3M18.8 14.5A7 7 0 017.8 18l-1.3-1.3"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinecap="round"
      />
      <path
        d="M17.5 4.5V8h-3.5M6.5 19.5V16h3.5"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SvgInvoice({ className, size = 26 }: SvgProps) {
  return (
    <svg viewBox={vb} width={size} height={size} className={className} aria-hidden>
      <path
        d="M7 3.5h10l3 3V19a1.5 1.5 0 01-1.5 1.5H7A1.5 1.5 0 015.5 19V5A1.5 1.5 0 017 3.5z"
        fill="rgba(255,255,255,0.08)"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      <path
        d="M8.5 11h7M8.5 14h5M8.5 17h6"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinecap="round"
      />
      <circle cx="9" cy="8" r="1" fill="currentColor" opacity={0.35} />
    </svg>
  );
}

function SvgRefund({ className, size = 26 }: SvgProps) {
  return (
    <svg viewBox={vb} width={size} height={size} className={className} aria-hidden>
      <path
        d="M6.5 10.5a5.5 5.5 0 019.3-3.2l1.2 1.1M17.5 13.5a5.5 5.5 0 01-9.3 3.2l-1.2-1.1"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinecap="round"
      />
      <path
        d="M5.5 7.5V11h3.5M18.5 16.5V13h-3.5"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SvgCelebration({ className, size = 26 }: SvgProps) {
  return (
    <svg viewBox={vb} width={size} height={size} className={className} aria-hidden>
      <path
        d="M12 5l1.2 3.2 3.4.3-2.6 2.3.8 3.3L12 12.9 8.2 14.1l.8-3.3-2.6-2.3 3.4-.3L12 5z"
        fill="rgba(255,255,255,0.18)"
        stroke="currentColor"
        strokeWidth={1.1}
        strokeLinejoin="round"
      />
      <path
        d="M6 8l.8 1.6M18 8l-.8 1.6M6 18l1-1.2M18 18l-1-1.2"
        stroke="rgba(253, 224, 71, 0.85)"
        strokeWidth={1.2}
        strokeLinecap="round"
      />
    </svg>
  );
}

function SvgReminder({ className, size = 26 }: SvgProps) {
  return (
    <svg viewBox={vb} width={size} height={size} className={className} aria-hidden>
      <path
        d="M12 4.5a5 5 0 00-5 5v3.5L5 16.5h14l-2-3.5V9.5a5 5 0 00-5-5z"
        fill="rgba(255,255,255,0.1)"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      <path
        d="M10 18a2 2 0 004 0"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinecap="round"
      />
    </svg>
  );
}

function SvgUrgent({ className, size = 26 }: SvgProps) {
  return (
    <svg viewBox={vb} width={size} height={size} className={className} aria-hidden>
      <circle
        cx="12"
        cy="12"
        r="7.5"
        fill="rgba(255,255,255,0.1)"
        stroke="currentColor"
        strokeWidth={sw}
      />
      <path
        d="M12 8.2v5M12 16.2v.1"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </svg>
  );
}

function SvgWarning({ className, size = 26 }: SvgProps) {
  return (
    <svg viewBox={vb} width={size} height={size} className={className} aria-hidden>
      <path
        d="M11.2 5.3L4.8 17.2a1.2 1.2 0 001 1.8h12.4a1.2 1.2 0 001-1.8L12.8 5.3a1.2 1.2 0 00-2.1 0z"
        fill="rgba(255,255,255,0.1)"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      <path
        d="M12 9.5V14M12 16.2v.1"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </svg>
  );
}

function SvgMaintenance({ className, size = 26 }: SvgProps) {
  return (
    <svg viewBox={vb} width={size} height={size} className={className} aria-hidden>
      <path
        d="M14.2 4.8l2 2-1.6 1.6a3.2 3.2 0 104.5 4.5l1.6-1.6 2 2-3.5 3.5a6 6 0 11-8.5-8.5l1.6-1.6z"
        fill="rgba(255,255,255,0.08)"
        stroke="currentColor"
        strokeWidth={sw}
        strokeLinejoin="round"
      />
    </svg>
  );
}

const BY_ID: Record<SystemMessageIconKind, FC<SvgProps>> = {
  booking: SvgBooking,
  assessment: SvgAssessment,
  homework: SvgHomework,
  coachSubstitute: SvgCoachSubstitute,
  packageBalance: SvgPackageBalance,
  venue: SvgVenue,
  holiday: SvgHoliday,
  policy: SvgPolicy,
  eventOpen: SvgEventOpen,
  paymentSuccess: SvgPaymentSuccess,
  courseUpdate: SvgCourseUpdate,
  invoice: SvgInvoice,
  refund: SvgRefund,
  celebration: SvgCelebration,
  reminder: SvgReminder,
  urgent: SvgUrgent,
  warning: SvgWarning,
  maintenance: SvgMaintenance,
};

interface SystemInboxMessageIconProps {
  kind: SystemMessageIconKind;
  className?: string;
  size?: number;
}

export function SystemInboxMessageIcon({
  kind,
  className,
  size = 26,
}: SystemInboxMessageIconProps) {
  const Cmp = BY_ID[kind];
  return <Cmp className={className} size={size} />;
}
