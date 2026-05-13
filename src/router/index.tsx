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
import { OrderCreatePage } from "../pages/commerce/OrderCreatePage";
import { OrderDetailPage } from "../pages/commerce/OrderDetailPage";
import { OrderEditPage } from "../pages/commerce/OrderEditPage";
import { OrderManagementPage } from "../pages/commerce/OrderManagementPage";
import { PackageCreatePage } from "../pages/commerce/PackageCreatePage";
import { PackageDetailPage } from "../pages/commerce/PackageDetailPage";
import { PackageEditPage } from "../pages/commerce/PackageEditPage";
import { PackageManagementPage } from "../pages/commerce/PackageManagementPage";
import { PackagesLayout } from "../pages/commerce/PackagesLayout";
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
        element: <PackagesLayout />,
        children: [
          {
            index: true,
            element: <PackageManagementPage />,
          },
          {
            path: "new",
            element: <PackageCreatePage />,
          },
          {
            path: ":packageId",
            element: <PackageDetailPage />,
          },
          {
            path: ":packageId/edit",
            element: <PackageEditPage />,
          },
        ],
      },
      {
        path: "orders",
        element: <OrderManagementPage />,
      },
      {
        path: "orders/new",
        element: <OrderCreatePage />,
      },
      {
        path: "orders/:orderId",
        element: <OrderDetailPage />,
      },
      {
        path: "orders/:orderId/edit",
        element: <OrderEditPage />,
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
