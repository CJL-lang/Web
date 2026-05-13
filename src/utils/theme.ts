export type AppTheme = "classic" | "platinum";

const THEME_STORAGE_KEY = "golf-academy-admin-theme";

export const appThemeOptions: Array<{
  id: AppTheme;
  label: string;
  description: string;
  swatches: string[];
}> = [
  {
    id: "classic",
    label: "经典深金",
    description: "深色工作台与金色强调，适合长时间后台操作。",
    swatches: ["#15110a", "#221c10", "#ecab13"],
  },
  {
    id: "platinum",
    label: "浅白金",
    description: "浅色白金底与沉稳金色强调，适合明亮环境浏览。",
    swatches: ["#f7f4ec", "#fffdf8", "#b88718"],
  },
];

function isAppTheme(value: string | null): value is AppTheme {
  return value === "classic" || value === "platinum";
}

export function getStoredTheme(): AppTheme {
  if (typeof window === "undefined") {
    return "classic";
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isAppTheme(stored) ? stored : "classic";
}

export function applyTheme(theme: AppTheme) {
  if (typeof document === "undefined") {
    return;
  }

  if (theme === "classic") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.dataset.theme = theme;
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
}

export function initializeTheme() {
  applyTheme(getStoredTheme());
}
