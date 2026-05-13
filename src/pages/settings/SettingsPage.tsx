import { useState } from "react";

import { PageHeader } from "../../components/ui/PageHeader";
import { SectionCard } from "../../components/ui/SectionCard";
import { cn } from "../../utils/cn";
import {
  appThemeOptions,
  applyTheme,
  getStoredTheme,
  type AppTheme,
} from "../../utils/theme";

export function SettingsPage() {
  const [theme, setTheme] = useState<AppTheme>(() => getStoredTheme());

  const handleThemeChange = (nextTheme: AppTheme) => {
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <>
      <PageHeader
        description="调整后台界面的显示偏好。"
        eyebrow="Settings"
        title="设置"
      />

      <SectionCard
        description="选择后会立即应用，并在下次打开后台时自动保留。"
        eyebrow="Appearance"
        title="界面色系"
      >
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
    </>
  );
}
