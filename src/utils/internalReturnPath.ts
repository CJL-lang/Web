/** 校验订单/套餐等详情页「返回」所需的站内绝对路径，避免开放重定向 */
export function sanitizeInternalReturnPath(raw: unknown): string | undefined {
  if (typeof raw !== "string" || raw === "") {
    return undefined;
  }
  if (!raw.startsWith("/") || raw.startsWith("//")) {
    return undefined;
  }
  if (raw.includes("\\")) {
    return undefined;
  }
  return raw;
}
