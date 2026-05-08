import { Outlet } from "react-router-dom";

export function CoachesLayout() {
  return (
    <div className="c-route-outlet">
      <Outlet />
    </div>
  );
}
