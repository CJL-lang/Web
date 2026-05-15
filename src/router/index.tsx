import { Navigate, createBrowserRouter } from "react-router-dom";

import { AdminLayout } from "../layouts/AdminLayout";
import { ApprovalsPage } from "../pages/approvals/ApprovalsPage";// 审批管理
import {
  CoachCreatePage,
  CoachDetailPage,
  CoachesLayout,
  CoachesListPage,
} from "../pages/coaches";// 教练管理
import {
  CourseOpeningCoachPage,
  CourseOpeningGroupDetailPage,
  CourseOpeningGroupsPage,
  CourseOpeningOrdersPage,
  CourseOpeningsLayout,
} from "../pages/courseOpenings";// 课程管理
import {
  DashboardCoachesPage,
  DashboardPage,
  DashboardRevenuePage,
  DashboardStudentsPage,
} from "../pages/dashboard";// 统计
import { OrderCreatePage } from "../pages/commerce/OrderCreatePage";// 订单管理
import { OrderDetailPage } from "../pages/commerce/OrderDetailPage";// 订单详情
import { OrderEditPage } from "../pages/commerce/OrderEditPage";// 订单编辑
import { OrderManagementPage } from "../pages/commerce/OrderManagementPage";// 订单管理
import { PackageCreatePage } from "../pages/commerce/PackageCreatePage";// 套餐管理
import { PackageDetailPage } from "../pages/commerce/PackageDetailPage";// 套餐详情
import { PackageEditPage } from "../pages/commerce/PackageEditPage";// 套餐编辑
import { PackageManagementPage } from "../pages/commerce/PackageManagementPage";// 套餐管理
import { PackagesLayout } from "../pages/commerce/PackagesLayout";// 套餐管理
import { MessageHistoryPage } from "../pages/messages/MessageHistoryPage";// 消息历史
import { MessagesLayout } from "../pages/messages/MessagesLayout";// 消息管理
import { MessagePublishPage } from "../pages/messages/MessagePublishPage";// 消息发布
import { SettingsTemplateLayout } from "../layouts/SettingsTemplateLayout";// 设置模板上下文
import { BadgeTemplateSettingsPage } from "../pages/settings/BadgeTemplateSettingsPage";// 奖牌与勋章模板设置
import { CourseTemplateDetailPage } from "../pages/settings/CourseTemplateDetailPage";// 课程模板详情
import { CourseTemplateSettingsPage } from "../pages/settings/CourseTemplateSettingsPage";// 课程模板设置
import { HomeworkTemplateDetailPage } from "../pages/settings/HomeworkTemplateDetailPage";// 作业模板详情
import { HomeworkTemplateSettingsPage } from "../pages/settings/HomeworkTemplateSettingsPage";// 作业模板设置
import { SettingsPage } from "../pages/settings/SettingsPage";// 设置
import { TrainingPlanTemplateDetailPage } from "../pages/settings/TrainingPlanTemplateDetailPage";// 培养计划模板详情
import { TrainingPlanTemplateSettingsPage } from "../pages/settings/TrainingPlanTemplateSettingsPage";// 培养计划模板设置
import {
  StudentCreatePage,
  StudentManagePage,
  StudentsLayout,
  StudentsListPage,
} from "../pages/students";// 学员管理

// 路由配置
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
        element: <MessagesLayout />,
        children: [
          {
            index: true,
            element: <Navigate replace to="publish" />,
          },
          {
            path: "publish",
            element: <MessagePublishPage />,
          },
          {
            path: "history",
            element: <MessageHistoryPage />,
          },
        ],
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
        path: "course-openings",
        element: <CourseOpeningsLayout />,
        children: [
          {
            index: true,
            element: <Navigate replace to="groups" />,
          },
          {
            path: "groups",
            element: <CourseOpeningGroupsPage />,
          },
          {
            path: "groups/:groupId",
            element: <CourseOpeningGroupDetailPage />,
          },
          {
            path: "coaches",
            element: <CourseOpeningCoachPage />,
          },
          {
            path: "orders",
            element: <CourseOpeningOrdersPage />,
          },
        ],
      },
      {
        path: "approvals",
        element: <ApprovalsPage />,
      },
      {
        path: "settings",
        element: <SettingsTemplateLayout />,
        children: [
          {
            index: true,
            element: <SettingsPage />,
          },
          {
            path: "courses",
            element: <CourseTemplateSettingsPage />,
          },
          {
            path: "courses/:templateId",
            element: <CourseTemplateDetailPage />,
          },
          {
            path: "training-plans",
            element: <TrainingPlanTemplateSettingsPage />,
          },
          {
            path: "training-plans/:templateId",
            element: <TrainingPlanTemplateDetailPage />,
          },
          {
            path: "homework",
            element: <HomeworkTemplateSettingsPage />,
          },
          {
            path: "homework/:templateId",
            element: <HomeworkTemplateDetailPage />,
          },
          {
            path: "badges",
            element: <BadgeTemplateSettingsPage />,
          },
        ],
      },
    ],
  },
]);
