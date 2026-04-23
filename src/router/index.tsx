import { Navigate, createBrowserRouter } from "react-router-dom";

import { AdminLayout } from "../layouts/AdminLayout";
import { ApprovalsPage } from "../pages/approvals/ApprovalsPage";
import { CoachesPage } from "../pages/coaches/CoachesPage";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { MessagePublishPage } from "../pages/messages/MessagePublishPage";
import { SettingsPage } from "../pages/settings/SettingsPage";
import { StudentsPage } from "../pages/students/StudentsPage";

export const router = createBrowserRouter([
  {
    element: <AdminLayout />,
    path: "/",
    children: [
      {
        index: true,
        element: <Navigate replace to="/dashboard" />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "messages",
        element: <MessagePublishPage />,
      },
      {
        path: "students",
        element: <StudentsPage />,
      },
      {
        path: "coaches",
        element: <CoachesPage />,
      },
      {
        path: "approvals",
        element: <ApprovalsPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
]);
