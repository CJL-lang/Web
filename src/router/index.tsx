import { Navigate, createBrowserRouter } from "react-router-dom";

import { AdminLayout } from "../layouts/AdminLayout";
import { ApprovalsPage } from "../pages/approvals/ApprovalsPage";
import {
  CoachCreatePage,
  CoachDetailPage,
  CoachesLayout,
  CoachesListPage,
} from "../pages/coaches";
import {
  DashboardCoachesPage,
  DashboardPage,
  DashboardRevenuePage,
  DashboardStudentsPage,
} from "../pages/dashboard";
import { OrderManagementPage } from "../pages/commerce/OrderManagementPage";
import { PackageCreatePage } from "../pages/commerce/PackageCreatePage";
import { PackageEditPage } from "../pages/commerce/PackageEditPage";
import { PackageManagementPage } from "../pages/commerce/PackageManagementPage";
import { MessagePublishPage } from "../pages/messages/MessagePublishPage";
import { SettingsPage } from "../pages/settings/SettingsPage";
import {
  StudentCreatePage,
  StudentManagePage,
  StudentsLayout,
  StudentsListPage,
} from "../pages/students";

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
        children: [
          {
            index: true,
            element: <Navigate replace to="students" />,
          },
          {
            path: "students",
            element: <DashboardStudentsPage />,
          },
          {
            path: "coaches",
            element: <DashboardCoachesPage />,
          },
          {
            path: "revenue",
            element: <DashboardRevenuePage />,
          },
        ],
      },
      {
        path: "messages",
        element: <MessagePublishPage />,
      },
      {
        path: "students",
        element: <StudentsLayout />,
        children: [
          {
            index: true,
            element: <StudentsListPage />,
          },
          {
            path: "new",
            element: <StudentCreatePage />,
          },
          {
            path: ":studentId",
            element: <StudentManagePage />,
          },
        ],
      },
      {
        path: "coaches",
        element: <CoachesLayout />,
        children: [
          {
            index: true,
            element: <CoachesListPage />,
          },
          {
            path: "new",
            element: <CoachCreatePage />,
          },
          {
            path: ":coachId",
            element: <CoachDetailPage />,
          },
        ],
      },
      {
        path: "packages",
        element: <PackageManagementPage />,
      },
      {
        path: "packages/new",
        element: <PackageCreatePage />,
      },
      {
        path: "packages/:packageId/edit",
        element: <PackageEditPage />,
      },
      {
        path: "orders",
        element: <OrderManagementPage />,
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
