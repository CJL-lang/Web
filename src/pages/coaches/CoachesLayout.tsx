import { Outlet } from "react-router-dom";

export function CoachesLayout() {
  return (
    <div className="min-w-0 space-y-5 md:space-y-6">
      <Outlet />
    </div>
  );
}
