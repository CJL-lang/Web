import { Outlet } from "react-router-dom";

import { AdminDataProvider } from "../context/AdminDataContext";
import { MobileNav } from "../components/navigation/MobileNav";
import { Sidebar } from "../components/navigation/Sidebar";
import { TabletNav } from "../components/navigation/TabletNav";

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-text-primary)]">
      <div className="mx-auto grid min-h-screen max-w-[var(--layout-max-width)] grid-cols-1 gap-4 p-3 md:grid-cols-[var(--layout-rail-width)_minmax(0,1fr)] md:items-start md:gap-5 md:p-5 lg:grid-cols-[var(--layout-sidebar-width)_minmax(0,1fr)] lg:gap-6 lg:p-6">
        <div className="hidden md:sticky md:top-5 md:block lg:hidden">
          <TabletNav />
        </div>
        <div className="hidden lg:sticky lg:top-6 lg:block">
          <Sidebar />
        </div>
        <main className="flex min-w-0 flex-col gap-4 md:gap-5 lg:gap-6">
          <MobileNav />
          <div className="w-full max-w-[var(--layout-content-max-width)]">
            <AdminDataProvider>
              <Outlet />
            </AdminDataProvider>
          </div>
        </main>
      </div>
    </div>
  );
}
