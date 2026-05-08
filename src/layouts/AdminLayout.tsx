import { Outlet } from "react-router-dom";

import { AdminDataProvider } from "../context/AdminDataContext";
import { MobileNav } from "../components/navigation/MobileNav";
import { Sidebar } from "../components/navigation/Sidebar";
import { TabletNav } from "../components/navigation/TabletNav";

export function AdminLayout() {
  return (
    <div className="c-admin-layout">
      <div className="c-admin-layout__grid">
        <div className="c-admin-layout__rail-md">
          <TabletNav />
        </div>
        <div className="c-admin-layout__sidebar-lg">
          <Sidebar />
        </div>
        <main className="c-admin-layout__main">
          <MobileNav />
          <div className="c-admin-layout__content">
            <AdminDataProvider>
              <Outlet />
            </AdminDataProvider>
          </div>
        </main>
      </div>
    </div>
  );
}
