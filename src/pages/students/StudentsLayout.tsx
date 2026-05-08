import { Outlet } from "react-router-dom";

export function StudentsLayout() {
  return (
    <div className="c-route-outlet">
      <Outlet />
    </div>
  );
}
