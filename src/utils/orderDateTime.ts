function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Minute-precision local datetime for storage (matches `datetime-local` value shape). */
export function formatLocalDateTimeMinute(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

/** Map stored order/payment datetime to `datetime-local` input value (date-only defaults to 00:00). */
export function storedToDatetimeLocalValue(stored: string): string {
  if (!stored) {
    return "";
  }
  if (stored.includes("T")) {
    const [date, timePart] = stored.split("T");
    const hm = (timePart ?? "").slice(0, 5);
    const safeHm = /^[0-9]{2}:[0-9]{2}$/.test(hm) ? hm : "00:00";
    return `${date}T${safeHm}`;
  }
  return `${stored}T00:00`;
}

/** Readable zh-style display YYYY-MM-DD HH:mm or legacy date-only. */
export function formatOrderDateTimeForDisplay(stored: string): string {
  if (!stored) {
    return "";
  }
  if (stored.includes("T")) {
    const [date, timePart] = stored.split("T");
    const hm = (timePart ?? "").slice(0, 5);
    return /^[0-9]{2}:[0-9]{2}$/.test(hm) ? `${date} ${hm}` : date;
  }
  return stored;
}
