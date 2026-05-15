import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { PageHeader } from "../../components/ui/PageHeader";
import { SectionCard } from "../../components/ui/SectionCard";
import { cn } from "../../utils/cn";
import {
  appThemeOptions,
  applyTheme,
  getStoredTheme,
  type AppTheme,
} from "../../utils/theme";

const templateSettingEntries = [
  { id: "course", label: "课程模板设置", path: "/settings/courses" },
  {
    id: "trainingPlan",
    label: "培养计划模板设置",
    path: "/settings/training-plans",
  },
  { id: "homework", label: "作业模板设置", path: "/settings/homework" },
  { id: "badges", label: "奖牌与勋章模板设置", path: "/settings/badges" },
] as const;

export function SettingsPage() {
  const [theme, setTheme] = useState<AppTheme>(() => getStoredTheme());

  const handleThemeChange = (nextTheme: AppTheme) => {
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <>
      <PageHeader eyebrow="Settings" title="设置" />

      <SectionCard eyebrow="Appearance" title="界面色系">
        <div className="c-settings-theme-grid">
          {appThemeOptions.map((option) => {
            const isActive = option.id === theme;

            return (
              <button
                key={option.id}
                aria-pressed={isActive}
                className={cn(
                  "c-settings-theme-option",
                  isActive && "c-settings-theme-option--active",
                )}
                type="button"
                onClick={() => handleThemeChange(option.id)}
              >
                <span className="c-settings-theme-option__main">
                  <span className="c-settings-theme-option__top">
                    <span className="c-settings-theme-option__label">
                      {option.label}
                    </span>
                    {isActive ? (
                      <span className="c-settings-theme-option__status">
                        当前
                      </span>
                    ) : null}
                  </span>
                  <span className="c-settings-theme-option__description">
                    {option.description}
                  </span>
                </span>

                <span
                  aria-hidden
                  className="c-settings-theme-option__swatches"
                >
                  {option.swatches.map((swatch) => (
                    <span
                      key={swatch}
                      className="c-settings-theme-option__swatch"
                      style={{ backgroundColor: swatch }}
                    />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard eyebrow="Templates" title="模板设置">
        <div className="c-settings-template-list">
          {templateSettingEntries.map((entry) => (
            <Link
              key={entry.id}
              className="c-settings-template-row"
              to={entry.path}
            >
              <span className="c-settings-template-row__label">
                {entry.label}
              </span>
              <ChevronRight
                aria-hidden
                className="c-settings-template-row__icon"
                strokeWidth={2}
              />
            </Link>
          ))}
        </div>
      </SectionCard>
    </>
  );
}
