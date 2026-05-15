import { Outlet } from "react-router-dom";

import { SettingsTemplateProvider } from "../context/SettingsTemplateContext";

export function SettingsTemplateLayout() {
  return (
    <SettingsTemplateProvider>
      <Outlet />
    </SettingsTemplateProvider>
  );
}
