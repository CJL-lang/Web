import { Outlet } from "react-router-dom";

/** Groups `/packages`, `/packages/new`, and `/packages/:id/edit` under one branch for stable matching. */
export function PackagesLayout() {
  return <Outlet />;
}
