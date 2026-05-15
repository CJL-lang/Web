# 项目源码导读与 Mock/API 接入指南

本文档用于帮助新接手项目的人快速理解当前代码结构、每个文件的职责、mock 数据来源，以及后期拿到接口文档后如何逐步接入真实后端。

覆盖范围：

- 覆盖：根目录配置文件、`public/`、`src/`。
- 不展开：`node_modules/`、`dist/`、`.git/`、构建缓存文件（如 `*.tsbuildinfo`）、运行日志（如 `vite-dev.log`、`vite-dev.err.log`）。
- `package-lock.json` 只作为依赖锁文件说明，不逐项解释内部内容。

## 1. 项目概览

这是一个高尔夫学院后台管理端，主要面向运营人员使用。当前功能包括统计看板、学员管理、教练管理、套餐与订单、开课管理、消息发布、审批和设置。

| 项目项 | 说明 |
|---|---|
| 技术栈 | React 19、Vite、TypeScript、React Router、Tailwind CSS、Recharts、lucide-react |
| 应用入口 | `src/main.tsx` |
| 路由入口 | `src/router/index.tsx` |
| 根布局 | `src/layouts/AdminLayout.tsx` |
| 全局状态 | `src/context/AdminDataContext.tsx` |
| 当前数据 | 以 `src/mocks/` 和 `localStorage` 模拟为主 |
| 样式入口 | `src/styles/tokens.css` + `src/styles/globals.css` |

### 1.1 运行命令

| 命令 | 作用 |
|---|---|
| `npm install` | 安装依赖 |
| `npm run dev` | 启动本地开发服务 |
| `npm run build` | TypeScript 检查并执行生产构建 |
| `npm run preview` | 预览生产构建结果 |
| `npm run lint` | 运行 ESLint |

### 1.2 当前整体数据流

当前项目没有真实后端请求。主要数据流如下：

1. `src/mocks/*.ts` 提供初始数据、枚举、类型和少量展示辅助函数。
2. `src/context/AdminDataContext.tsx` 使用部分 mock 数据初始化内存状态。
3. 页面通过 `useAdminData()` 读取和修改学员、教练、套餐、订单、开课组等数据。
4. 刷新页面后，Context 内的内存修改会丢失，重新回到 mock 初始数据。
5. 消息发布相关的草稿和发送记录由 `src/services/messageService.ts` 写入浏览器 `localStorage`。
6. 部分页面仍直接读取 mock 文件，例如仪表盘图表、审批、消息收件人、学员详情画像。

## 2. 推荐阅读顺序

如果你是第一次读这个项目，建议按下面顺序看：

1. `package.json`：了解技术栈、脚本、依赖。
2. `src/main.tsx`：看应用如何挂载、样式如何加载、主题如何初始化。
3. `src/App.tsx`：看 RouterProvider 如何接入。
4. `src/router/index.tsx`：看所有页面路由和默认跳转。
5. `src/layouts/AdminLayout.tsx`：看全局布局、导航和 `AdminDataProvider` 的位置。
6. `src/context/AdminDataContext.tsx`：看当前核心业务数据如何被 mock 初始化、如何被页面修改。
7. `src/mocks/`：看各业务域目前有哪些模拟字段。
8. `src/pages/`：按业务模块阅读页面。
9. `src/components/`：理解页面复用组件。
10. `src/styles/`：根据页面 class 名查找对应样式。

## 3. 根目录与静态资源

| 文件路径 | 作用 | 主要使用位置/关联模块 | 后期接口接入关注点 |
|---|---|---|---|
| `README.md` | 项目基础说明，包含开发运行、路由、结构和简单数据说明。 | 项目文档入口。 | 可在接口稳定后补充真实后端运行依赖，但本次不修改。 |
| `package.json` | 定义项目名称、脚本、依赖和开发依赖。 | npm、Vite、TypeScript、ESLint。 | 接入接口时如引入请求库、状态库、数据请求库，需要在这里新增依赖。 |
| `package-lock.json` | npm 依赖锁文件，保证安装版本一致。 | `npm install`。 | 不手动编辑；依赖变化时由 npm 自动更新。 |
| `index.html` | Vite HTML 壳，包含 `#root` 和入口脚本。 | 浏览器加载应用的最外层 HTML。 | 通常无需因接口接入修改；如后期接入第三方 SDK 可在此加资源。 |
| `vite.config.ts` | Vite 配置，启用 React 和 Tailwind 插件，并配置 dev server。 | 开发服务与构建。 | 后期可能增加代理配置，把 `/api` 转发到后端环境。 |
| `tsconfig.json` | TypeScript 项目引用入口。 | TypeScript 编译。 | 通常无需修改。 |
| `tsconfig.app.json` | 应用 TypeScript 编译选项和 include 范围。 | `npm run build` 中的 `tsc -b`。 | 新增源码目录时确保被 include 覆盖。 |
| `eslint.config.js` | ESLint 扁平配置。 | `npm run lint`。 | 新增服务层或 API 类型后仍应通过 lint。 |
| `.gitignore` | Git 忽略规则。 | Git。 | 如新增 `.env.local`、接口生成产物、缓存目录，需要确认是否忽略。 |
| `public/logo.webp` | 应用公开静态 logo 资源。 | 品牌展示、浏览器可直接访问。 | 无。 |
| `public/logo-256.webp` | 256 尺寸 logo 资源。 | 品牌展示、可能用于图标或缩略图。 | 无。 |

## 4. `src` 入口、路由、布局与全局状态

| 文件路径 | 作用 | 主要使用位置/关联模块 | 后期接口接入关注点 |
|---|---|---|---|
| `src/main.tsx` | React 应用入口，初始化主题，挂载 `App`，并按顺序加载 `tokens.css` 与 `globals.css`。 | `index.html`。 | 如果后期加全局数据请求 Provider 或错误边界，可从这里包裹。 |
| `src/App.tsx` | 渲染 `RouterProvider`，把路由表挂进应用。 | `src/main.tsx`、`src/router/index.tsx`。 | 通常无需直接接接口。 |
| `src/vite-env.d.ts` | Vite 类型声明文件。 | TypeScript 编译。 | 如使用 `import.meta.env` 环境变量，可配合增加类型声明。 |
| `src/router/index.tsx` | 定义所有页面路由、嵌套路由和默认重定向。 | `App.tsx`、所有 `pages/*`。 | 接口接入后，如新增登录、鉴权、404、错误页，可在这里调整路由。 |
| `src/layouts/AdminLayout.tsx` | 后台全局布局，包含侧边栏、平板导航、移动导航、主内容区，并包裹 `AdminDataProvider`。 | 所有业务页面。 | 如果 Context 改为异步加载真实数据，需要考虑这里的全局 loading/error 位置。 |
| `src/context/AdminDataContext.tsx` | 当前核心业务内存状态容器，初始化学员、教练、套餐、订单、开课组，并提供新增、编辑、关闭、退款、开课组维护等函数。 | 多数业务页面通过 `useAdminData()` 使用。 | 后期接 API 的核心改造点：把同步 setState 操作替换为 service 请求 + 状态刷新/乐观更新/错误处理。 |
| `src/constants/navigation.ts` | 定义侧边栏和响应式导航菜单项。 | `Sidebar`、`TabletNav`、`MobileNav`。 | 后期如果接口按权限返回菜单，需要在这里或上层加入权限过滤。 |

## 5. 页面文件：`src/pages`

### 5.1 仪表盘 `src/pages/dashboard`

| 文件路径 | 作用 | 主要使用位置/关联模块 | 后期接口接入关注点 |
|---|---|---|---|
| `src/pages/dashboard/index.ts` | 仪表盘页面集中导出。 | `router/index.tsx`。 | 无。 |
| `src/pages/dashboard/DashboardPage.tsx` | 仪表盘嵌套路由容器，承载学员、教练、收入子页。 | `/dashboard`。 | 可在后期添加统一时间范围或接口加载状态。 |
| `src/pages/dashboard/DashboardStudentsPage.tsx` | 学员维度统计页，展示学生概览和图表。 | `/dashboard/students`、`mocks/dashboard.ts`。 | 当前直接使用 mock 图表数据；后期替换为统计接口。 |
| `src/pages/dashboard/DashboardCoachesPage.tsx` | 教练维度统计占位/入口页。 | `/dashboard/coaches`。 | 后期接教练统计接口。 |
| `src/pages/dashboard/DashboardRevenuePage.tsx` | 收入统计页，基于订单、套餐、学员和开课组计算收入、收款状态和开课状态。 | `/dashboard/revenue`、`useAdminData()`。 | 后期应优先使用后端聚合统计接口，避免前端用全量订单计算报表。 |

### 5.2 学员 `src/pages/students`

| 文件路径 | 作用 | 主要使用位置/关联模块 | 后期接口接入关注点 |
|---|---|---|---|
| `src/pages/students/index.ts` | 学员页面集中导出。 | `router/index.tsx`。 | 无。 |
| `src/pages/students/StudentsLayout.tsx` | 学员模块嵌套路由出口。 | `/students`。 | 可放模块级 loading/error。 |
| `src/pages/students/StudentsListPage.tsx` | 学员列表页，支持状态筛选并跳转详情。 | `useAdminData()`、`mocks/students.ts`。 | 后期接学员列表接口，处理分页、搜索、筛选参数。 |
| `src/pages/students/StudentCreatePage.tsx` | 新建学员表单，生成新学员 ID 并写入 Context。 | `useAdminData()`、`utils/adminIds.ts`。 | 后期改为调用创建学员接口，ID 由后端返回。 |
| `src/pages/students/StudentManagePage.tsx` | 学员详情/管理页，整合学员基础信息、画像、套餐、开课状态。 | `useAdminData()`、`mocks/studentProfiles.ts`、`mocks/courseOpenings.ts`。 | 后期需要拆分基础详情、画像、套餐记录、订单/开课信息等接口。 |

### 5.3 教练 `src/pages/coaches`

| 文件路径 | 作用 | 主要使用位置/关联模块 | 后期接口接入关注点 |
|---|---|---|---|
| `src/pages/coaches/index.ts` | 教练页面集中导出。 | `router/index.tsx`。 | 无。 |
| `src/pages/coaches/CoachesLayout.tsx` | 教练模块嵌套路由出口。 | `/coaches`。 | 可放模块级 loading/error。 |
| `src/pages/coaches/CoachesListPage.tsx` | 教练列表页，展示教练状态、课时等摘要。 | `useAdminData()`。 | 后期接教练列表接口，处理筛选、分页、状态字段映射。 |
| `src/pages/coaches/CoachCreatePage.tsx` | 新建教练表单，生成教练 ID 并写入 Context。 | `useAdminData()`、`utils/adminIds.ts`。 | 后期改为调用创建教练接口，ID 由后端返回。 |
| `src/pages/coaches/CoachDetailPage.tsx` | 教练详情页，展示教练基础信息、学员、开课组等关联数据。 | `useAdminData()`、`mocks/courseOpenings.ts`。 | 后期建议由后端提供教练详情与关联开课/学员聚合数据。 |

### 5.4 套餐与订单 `src/pages/commerce`

| 文件路径 | 作用 | 主要使用位置/关联模块 | 后期接口接入关注点 |
|---|---|---|---|
| `src/pages/commerce/index.ts` | 商务模块页面集中导出。 | 目前路由部分直接引用文件，仍可作为模块出口。 | 无。 |
| `src/pages/commerce/PackagesLayout.tsx` | 套餐模块嵌套路由出口。 | `/packages`。 | 可放套餐模块 loading/error。 |
| `src/pages/commerce/PackageManagementPage.tsx` | 套餐列表/管理页，显示套餐状态、价格、课时等。 | `useAdminData()`、`mocks/packages.ts`。 | 后期接套餐列表接口，处理上架/过期状态。 |
| `src/pages/commerce/PackageCreatePage.tsx` | 新建套餐表单，生成套餐 ID 并写入 Context。 | `useAdminData()`、`utils/adminIds.ts`。 | 后期改为创建套餐接口；校验规则需与后端保持一致。 |
| `src/pages/commerce/PackageDetailPage.tsx` | 套餐详情页，展示套餐结构并支持过期操作。 | `useAdminData()`、`mocks/packages.ts`。 | 后期接套餐详情和过期/下架接口。 |
| `src/pages/commerce/PackageEditPage.tsx` | 套餐编辑页，更新套餐信息或置为过期。 | `useAdminData()`。 | 后期接更新套餐接口，注意并发编辑和保存失败回滚。 |
| `src/pages/commerce/OrderManagementPage.tsx` | 订单列表页，按订单状态、学员、套餐等展示订单。 | `useAdminData()`、`mocks/orders.ts`。 | 后期接订单列表接口，处理分页、筛选、排序和开课状态联查。 |
| `src/pages/commerce/OrderCreatePage.tsx` | 新建订单入口，复用 `OrderForm`。 | `useAdminData()`、`OrderForm.tsx`。 | 后期调用创建订单接口，支付状态由后端规则确认。 |
| `src/pages/commerce/OrderEditPage.tsx` | 编辑订单入口，复用 `OrderForm`。 | `useAdminData()`、`OrderForm.tsx`。 | 后期调用更新订单接口，注意已关闭/已退款订单是否可编辑。 |
| `src/pages/commerce/OrderDetailPage.tsx` | 订单详情页，展示支付、退款、关闭、开课关联等，并触发关闭/退款操作。 | `useAdminData()`、`mocks/courseOpenings.ts`、`mocks/packages.ts`。 | 后期重点接关闭订单、退款、支付凭证查看、订单开课状态接口。 |
| `src/pages/commerce/OrderForm.tsx` | 订单创建/编辑表单组件，处理学员、套餐、支付方式、支付日期、凭证等字段。 | `OrderCreatePage`、`OrderEditPage`。 | 后期支付凭证不应继续使用 `dataUrl`，应接文件上传接口并保存文件 ID/URL。 |

### 5.5 开课管理 `src/pages/courseOpenings`

| 文件路径 | 作用 | 主要使用位置/关联模块 | 后期接口接入关注点 |
|---|---|---|---|
| `src/pages/courseOpenings/index.ts` | 开课管理页面集中导出。 | `router/index.tsx`。 | 无。 |
| `src/pages/courseOpenings/CourseOpeningsLayout.tsx` | 开课管理模块布局，包含子导航和 `Outlet`。 | `/course-openings`。 | 可放模块级接口状态。 |
| `src/pages/courseOpenings/CourseOpeningGroupsPage.tsx` | 开课组列表页，展示组、容量、状态、教练、订单等。 | `useAdminData()`、`mocks/courseOpenings.ts`。 | 后期接开课组列表接口，容量和状态建议由后端返回或统一规则计算。 |
| `src/pages/courseOpenings/CourseOpeningGroupDetailPage.tsx` | 开课组详情页，支持添加/移除/替换订单、开课、换教练、删除开课组等。 | `useAdminData()`。 | 后期重点接添加学员订单、移除订单、换课、改教练、开课、删除组等写接口。 |
| `src/pages/courseOpenings/CourseOpeningCoachPage.tsx` | 按教练视角查看开课组和授课安排。 | `useAdminData()`。 | 后期可接教练排课/开课组聚合接口。 |
| `src/pages/courseOpenings/CourseOpeningOrdersPage.tsx` | 按订单视角查看开课状态，辅助把已完成订单加入开课组。 | `useAdminData()`、`mocks/courseOpenings.ts`。 | 后期接可开课订单列表、订单开课状态接口。 |
| `src/pages/courseOpenings/courseOpeningViewHelpers.ts` | 开课管理展示辅助函数，用于从教练、套餐、订单等数据拼接展示信息。 | 开课管理多个页面。 | 后期如果后端返回聚合字段，可减少这里的前端拼接。 |

### 5.6 消息 `src/pages/messages`

| 文件路径 | 作用 | 主要使用位置/关联模块 | 后期接口接入关注点 |
|---|---|---|---|
| `src/pages/messages/MessagesLayout.tsx` | 消息模块布局，包含发布和历史子路由。 | `/messages`。 | 可放消息模块 loading/error。 |
| `src/pages/messages/MessagePublishPage.tsx` | 消息发布页，选择图标、标题、正文和收件人，支持保存草稿和发送。 | `messageService.ts`、`mocks/messageRecipients.ts`。 | 后期接收件人搜索、草稿保存、消息发送接口。 |
| `src/pages/messages/MessageHistoryPage.tsx` | 消息历史页，从本地记录读取已发送消息。 | `messageService.ts`。 | 后期接消息历史列表接口，处理分页和详情。 |
| `src/pages/messages/components/MessageIconPicker.tsx` | 系统消息图标选择器。 | `MessagePublishPage`、`types/message.ts`。 | 若后端限制图标枚举，需要与接口枚举同步。 |
| `src/pages/messages/components/RecipientGroupPicker.tsx` | 消息收件人选择组件，支持学员/教练分组选择。 | `MessagePublishPage`、`mocks/messageRecipients.ts`。 | 后期收件人列表应从接口获取，注意搜索和大数据量分页。 |

### 5.7 其他页面

| 文件路径 | 作用 | 主要使用位置/关联模块 | 后期接口接入关注点 |
|---|---|---|---|
| `src/pages/approvals/ApprovalsPage.tsx` | 审批页，目前展示请假审批 mock 数据和审批操作 UI。 | `/approvals`、`mocks/leaveRequests.ts`。 | 后期接请假/审批列表、同意、拒绝接口。 |
| `src/pages/settings/SettingsPage.tsx` | 设置页，当前主要处理主题切换等本地设置。 | `/settings`、`utils/theme.ts`。 | 如果后期有用户偏好接口，可同步主题设置到后端。 |

## 6. 组件文件：`src/components`

### 6.1 通用 UI 组件

| 文件路径 | 作用 | 主要使用位置/关联模块 | 后期接口接入关注点 |
|---|---|---|---|
| `src/components/ui/Button.tsx` | 通用按钮组件，封装按钮样式变体。 | 表单、页面操作区。 | 无。 |
| `src/components/ui/EmptyState.tsx` | 空状态组件。 | 列表无数据场景。 | 接口接入后用于接口返回空列表。 |
| `src/components/ui/FeaturePlaceholder.tsx` | 功能占位组件，用于暂未完成页面。 | 部分页面或模块占位。 | 接口完成后可逐步移除占位。 |
| `src/components/ui/Field.tsx` | 表单字段展示/包装组件。 | 表单页面。 | 接口校验错误可结合字段错误展示。 |
| `src/components/ui/PageHeader.tsx` | 页面标题和操作区组件。 | 多数页面顶部。 | 无。 |
| `src/components/ui/ResourceListColumnHead.tsx` | 资源列表列头组件。 | 列表页。 | 后期如支持服务端排序，可加排序状态。 |
| `src/components/ui/SectionCard.tsx` | 内容分区容器组件。 | 详情页、表单页、统计页。 | 无。 |
| `src/components/ui/StatCard.tsx` | 统计卡片组件。 | 仪表盘和概览区域。 | 接口统计数据加载时可加入骨架态。 |

### 6.2 导航组件

| 文件路径 | 作用 | 主要使用位置/关联模块 | 后期接口接入关注点 |
|---|---|---|---|
| `src/components/navigation/AcademyBrand.tsx` | 品牌区域组件，展示 logo 和名称。 | `Sidebar`、响应式导航。 | 无。 |
| `src/components/navigation/Sidebar.tsx` | 桌面侧边栏导航。 | `AdminLayout`、`constants/navigation.ts`。 | 如后期有权限菜单，需要按权限过滤。 |
| `src/components/navigation/TabletNav.tsx` | 平板断点导航。 | `AdminLayout`。 | 同上。 |
| `src/components/navigation/MobileNav.tsx` | 移动端导航。 | `AdminLayout`。 | 同上。 |

### 6.3 仪表盘、学员、消息组件

| 文件路径 | 作用 | 主要使用位置/关联模块 | 后期接口接入关注点 |
|---|---|---|---|
| `src/components/dashboard/StudentOverviewPanel.tsx` | 学员概览面板，展示摘要数据。 | `DashboardStudentsPage`。 | 后期数据来自学员统计接口。 |
| `src/components/dashboard/StudentAnalyticsCharts.tsx` | 学员统计图表组件，使用 Recharts。 | `DashboardStudentsPage`、`mocks/dashboard.ts`。 | 后期替换为接口返回的图表数据结构，或增加转换函数。 |
| `src/components/students/StudentBadgeWall.tsx` | 学员徽章墙展示组件。 | `StudentManagePage`、`mocks/studentProfiles.ts`。 | 后期可接学员成就/徽章接口。 |
| `src/components/students/StudentPackagesSection.tsx` | 学员套餐记录展示组件。 | `StudentManagePage`、`mocks/studentProfiles.ts`。 | 后期接学员套餐/订单/课时记录接口。 |
| `src/components/students/StudentProgressOverview.tsx` | 学员能力、进步趋势和训练指标展示组件。 | `StudentManagePage`、`mocks/studentProfiles.ts`。 | 后期接学员成长档案或训练评估接口。 |
| `src/components/messages/SystemInboxMessageIcon.tsx` | 系统消息图标渲染组件。 | 消息发布、消息历史。 | 与后端消息图标枚举保持一致。 |

## 7. Mock 数据文件：`src/mocks`

| 文件路径 | 作用 | 主要使用位置/关联模块 | 后期接口接入关注点 |
|---|---|---|---|
| `src/mocks/students.ts` | 学员列表 mock，定义 `StudentListItem`、学员状态标准化、初始列表和按 ID 查询。 | `AdminDataContext.tsx`、学员列表/详情、ID 工具。 | 接学员列表、学员详情、创建学员接口；状态枚举需与后端统一。 |
| `src/mocks/studentProfiles.ts` | 学员详情画像 mock，包含徽章、家长、教练、能力维度、进步趋势、套餐档案等复杂数据，并可从列表项生成详情。 | `StudentManagePage`、学员详情组件。 | 建议拆成学员详情、成长档案、徽章、套餐记录等多个接口或后端聚合接口。 |
| `src/mocks/coaches.ts` | 教练列表 mock，定义 `CoachListItem`、初始教练列表和按 ID 查询。 | `AdminDataContext.tsx`、教练列表/详情、ID 工具。 | 接教练列表、教练详情、创建教练接口。 |
| `src/mocks/packages.ts` | 套餐 mock，定义套餐状态、套餐字段、完整性判断、可售判断、价格/课时格式化和初始套餐列表。 | `AdminDataContext.tsx`、套餐页、订单表单、开课容量计算。 | 接套餐列表、详情、创建、编辑、上架/过期接口；前后端需统一套餐状态和容量规则。 |
| `src/mocks/orders.ts` | 订单 mock，定义订单状态、支付方式、支付凭证、订单字段、支付完成判断、订单状态推导和初始订单列表。 | `AdminDataContext.tsx`、订单页、开课页、收入看板。 | 接订单列表、详情、创建、编辑、关闭、退款、支付凭证上传/查看接口。 |
| `src/mocks/courseOpenings.ts` | 开课组 mock，定义订单开课状态、开课组状态、容量/剩余名额/展示状态/按订单查组等工具。 | `AdminDataContext.tsx`、开课管理、订单详情、收入看板。 | 接开课组列表、详情、开课、加人、移除、换课、换教练、删除接口。 |
| `src/mocks/dashboard.ts` | 仪表盘 mock，包含指标卡、洞察、时间范围、学员统计图表数据。 | `DashboardStudentsPage`、`StudentAnalyticsCharts`。 | 后期接统计接口，建议由后端返回聚合后的指标和图表序列。 |
| `src/mocks/leaveRequests.ts` | 请假审批 mock，定义申请人角色、审批状态和初始请假记录。 | `ApprovalsPage`。 | 接审批列表、批准、拒绝接口。 |
| `src/mocks/messageRecipients.ts` | 消息收件人 mock，提供学员和教练收件人列表。 | `MessagePublishPage`、`MessageHistoryPage`、`RecipientGroupPicker`。 | 接收件人搜索/列表接口，大量数据时避免一次性拉全量。 |

## 8. 服务、类型与工具

### 8.1 服务层 `src/services`

| 文件路径 | 作用 | 主要使用位置/关联模块 | 后期接口接入关注点 |
|---|---|---|---|
| `src/services/messageService.ts` | 当前用 `localStorage` 模拟消息草稿、发送记录、读取历史和生成消息 ID。 | `MessagePublishPage`、`MessageHistoryPage`。 | 后期改为真实消息 API；保留函数名可减少页面改动。需要处理鉴权、分页、发送失败、草稿同步。 |

### 8.2 类型 `src/types`

| 文件路径 | 作用 | 主要使用位置/关联模块 | 后期接口接入关注点 |
|---|---|---|---|
| `src/types/dashboard.ts` | 仪表盘指标、趋势、时间范围、学员统计数据结构类型。 | 仪表盘 mock 和图表组件。 | 接统计接口时作为前端 ViewModel 类型，必要时新增 DTO 转换。 |
| `src/types/message.ts` | 消息收件人、图标选项、消息编辑器、草稿、已发送消息记录类型。 | 消息页面、消息服务、图标组件。 | 与消息 API 的字段、图标枚举、收件人模型对齐。 |

### 8.3 工具函数 `src/utils`

| 文件路径 | 作用 | 主要使用位置/关联模块 | 后期接口接入关注点 |
|---|---|---|---|
| `src/utils/adminIds.ts` | 根据现有 mock 列表生成下一个学员、教练、套餐、订单、开课组 ID，并生成教练姓名缩写。 | 新建学员/教练/套餐/订单/开课组。 | 接后端后业务 ID 应由后端生成；前端只保留展示辅助函数。 |
| `src/utils/bizStatusPills.ts` | 根据业务状态返回状态标签 class。 | 学员、订单、开课组、教练状态展示。 | 后端状态枚举变化时需要同步映射。 |
| `src/utils/cn.ts` | 简单 className 拼接工具，过滤空值。 | 多个组件。 | 无。 |
| `src/utils/internalReturnPath.ts` | 清洗内部返回路径，避免跳转到外部地址。 | 详情页返回、编辑完成跳转等。 | 接登录/鉴权后仍可复用。 |
| `src/utils/navigation.ts` | 记录各导航分组最近访问路径，用于从主导航回到上次子页面。 | 导航组件。 | 无。 |
| `src/utils/orderDateTime.ts` | 订单日期时间格式化、存储值与 input datetime-local 值转换。 | 订单表单、订单展示。 | 接口需明确时间字段时区和格式，避免本地时间/UTC 混用。 |
| `src/utils/theme.ts` | 主题选项、主题读取、应用和初始化，使用本地存储。 | `main.tsx`、`SettingsPage`。 | 如果用户偏好接后端，需要增加远端同步策略。 |

## 9. 样式文件：`src/styles`

样式加载顺序是：`src/main.tsx` 先加载 `tokens.css`，再加载 `globals.css`。`globals.css` 内部先引入 Tailwind，再按顺序引入基础样式、业务组件样式和 vendor 覆盖。

| 文件路径 | 作用 | 主要使用位置/关联模块 | 后期接口接入关注点 |
|---|---|---|---|
| `src/styles/tokens.css` | 全局设计变量，如字体、颜色、阴影、渐变、主题变量。 | 全站样式。 | 无。 |
| `src/styles/globals.css` | 样式聚合入口，引入 Tailwind 和所有 CSS 文件。 | `main.tsx`。 | 新增 CSS 文件需在这里引入。 |
| `src/styles/base.document.css` | HTML/body/root 等基础文档样式。 | 全站。 | 无。 |
| `src/styles/components.admin-layout.css` | 后台整体布局样式。 | `AdminLayout`。 | 无。 |
| `src/styles/components.approvals.css` | 审批页样式。 | `ApprovalsPage`。 | 无。 |
| `src/styles/components.badge-wall.css` | 学员徽章墙样式。 | `StudentBadgeWall`。 | 无。 |
| `src/styles/components.button.css` | 通用按钮样式。 | `Button`。 | 无。 |
| `src/styles/components.coach-detail.css` | 教练详情页样式。 | `CoachDetailPage`。 | 无。 |
| `src/styles/components.commerce.css` | 套餐、订单等商务模块样式。 | `pages/commerce/*`。 | 无。 |
| `src/styles/components.course-openings.css` | 开课管理模块样式。 | `pages/courseOpenings/*`。 | 无。 |
| `src/styles/components.dashboard-shell.css` | 仪表盘页面外壳与导航样式。 | `DashboardPage`。 | 无。 |
| `src/styles/components.dashboard-stats.css` | 仪表盘统计图表与指标样式。 | 仪表盘页面和图表组件。 | 无。 |
| `src/styles/components.empty-state.css` | 空状态样式。 | `EmptyState`。 | 无。 |
| `src/styles/components.feature-placeholder.css` | 功能占位样式。 | `FeaturePlaceholder`。 | 无。 |
| `src/styles/components.field.css` | 表单字段样式。 | `Field`、表单页面。 | 接口校验错误展示可能扩展这里。 |
| `src/styles/components.form-shell.css` | 表单页面外壳样式。 | 新建/编辑类页面。 | 无。 |
| `src/styles/components.inline-icons.css` | 行内图标样式。 | 多个页面的小图标。 | 无。 |
| `src/styles/components.message-publish.css` | 消息发布页样式。 | `MessagePublishPage`。 | 无。 |
| `src/styles/components.message-ui.css` | 消息模块通用 UI 样式。 | 消息发布、历史、图标组件。 | 无。 |
| `src/styles/components.navigation.css` | 侧边栏、平板、移动导航样式。 | 导航组件。 | 无。 |
| `src/styles/components.page-header.css` | 页面头部样式。 | `PageHeader`。 | 无。 |
| `src/styles/components.recipient-group.css` | 收件人选择器样式。 | `RecipientGroupPicker`。 | 无。 |
| `src/styles/components.resource-list.css` | 资源列表样式。 | 学员、教练、套餐、订单等列表。 | 接口分页组件样式可能放这里或新增文件。 |
| `src/styles/components.route-layout.css` | 路由布局小样式。 | `StudentsLayout`、`CoachesLayout` 等。 | 无。 |
| `src/styles/components.section-card.css` | 分区卡片样式。 | `SectionCard`。 | 无。 |
| `src/styles/components.settings.css` | 设置页样式。 | `SettingsPage`。 | 无。 |
| `src/styles/components.stat-card.css` | 统计卡样式。 | `StatCard`。 | 无。 |
| `src/styles/components.student-detail.css` | 学员详情页样式。 | `StudentManagePage`、学员详情组件。 | 无。 |
| `src/styles/components.system-message-icon.css` | 系统消息图标样式。 | `SystemInboxMessageIcon`、消息图标选择器。 | 无。 |
| `src/styles/vendors.recharts.css` | Recharts 图表库的主题覆盖样式。 | 仪表盘图表。 | 无。 |

## 10. 当前 Mock 数据如何进入页面

### 10.1 通过 `AdminDataContext` 进入全局状态的数据

这些数据会被 `AdminDataProvider` 初始化为 React state，页面通过 `useAdminData()` 使用：

| Mock 文件 | Context 状态 | 当前写操作 |
|---|---|---|
| `src/mocks/students.ts` | `students` | `addStudent` |
| `src/mocks/coaches.ts` | `coaches` | `addCoach` |
| `src/mocks/packages.ts` | `packages` | `addPackage`、`updatePackage`、`expirePackage` |
| `src/mocks/orders.ts` | `orders` | `addOrder`、`updateOrder`、`closeOrder`、`refundOrder` |
| `src/mocks/courseOpenings.ts` | `courseOpeningGroups` | `addCourseOpeningGroup`、`appendOrdersToCourseOpeningGroup`、`removeOrderFromCourseOpeningGroup`、`replaceCourseOpeningGroupOrder`、`reassignCourseOpeningGroupCoach`、`deleteCourseOpeningGroup` |

注意：这些写操作都只改浏览器内存里的 React state。刷新页面后，数据会回到 mock 初始值。

### 10.2 页面或组件直接读取的 mock

| Mock 文件 | 读取位置 | 说明 |
|---|---|---|
| `src/mocks/dashboard.ts` | `DashboardStudentsPage`、`StudentAnalyticsCharts` | 学员统计图表和概览数据。 |
| `src/mocks/leaveRequests.ts` | `ApprovalsPage` | 请假审批数据。 |
| `src/mocks/messageRecipients.ts` | `MessagePublishPage`、`MessageHistoryPage` | 消息收件人候选列表。 |
| `src/mocks/studentProfiles.ts` | `StudentManagePage`、学员详情组件 | 学员画像、徽章、成长趋势、套餐详情等。 |

### 10.3 `localStorage` 模拟的服务

`src/services/messageService.ts` 当前不是后端请求，而是用浏览器 `localStorage` 模拟：

| 函数 | 作用 | 后期替换方向 |
|---|---|---|
| `getDraft` | 读取消息草稿。 | 调用草稿详情接口或本地草稿策略。 |
| `saveDraft` | 保存消息草稿。 | 调用保存草稿接口。 |
| `clearDraft` | 清除草稿。 | 调用删除草稿接口或清理本地缓存。 |
| `listSentMessages` | 读取已发送消息历史。 | 调用消息历史分页接口。 |
| `getSentMessage` | 按 ID 查询已发送消息。 | 调用消息详情接口。 |
| `sendMessage` | 模拟发送消息并写入历史。 | 调用真实发送接口。 |

## 11. 后期拿到接口文档后的接入步骤

### 11.1 先确认接口合同

拿到接口文档后，不建议直接在页面里写 `fetch`。先确认这些内容：

- Base URL、环境区分方式、是否需要代理。
- 鉴权方式：Token、Cookie、Header 名称、过期处理。
- 通用响应结构：成功字段、错误字段、错误码、错误信息。
- 分页结构：页码/页大小、总数、游标或 offset。
- 时间格式：ISO 字符串、时间戳、本地时间还是 UTC。
- 枚举值：学员状态、教练状态、套餐状态、订单状态、支付方式、开课状态。
- 文件上传：支付凭证上传字段、返回文件 ID 还是 URL。
- 写操作语义：新增、编辑、关闭、退款、开课、换课、改教练是否幂等，失败如何提示。

### 11.2 建议新增服务层，而不是页面直接请求

建议在 `src/services/` 中逐步增加业务 service：

| 建议文件 | 负责接口 |
|---|---|
| `studentService.ts` | 学员列表、详情、新建、编辑、成长档案。 |
| `coachService.ts` | 教练列表、详情、新建、排课/关联学员。 |
| `packageService.ts` | 套餐列表、详情、新建、编辑、上架/过期。 |
| `orderService.ts` | 订单列表、详情、新建、编辑、关闭、退款、支付凭证。 |
| `courseOpeningService.ts` | 开课组列表、详情、开课、添加订单、移除订单、换课、改教练、删除。 |
| `messageService.ts` | 在现有文件基础上替换草稿、发送、历史接口。 |

推荐保留页面当前使用的前端类型作为 ViewModel。如果后端 DTO 字段和前端展示字段不完全一致，增加转换函数：

- `StudentDto -> StudentListItem`
- `OrderDto -> OrderListItem`
- `CourseOpeningGroupDto -> CourseOpeningGroup`

这样页面不会直接绑死后端字段名，后端小改动时只需调整 service 或 mapper。

### 11.3 推荐迁移顺序

1. 新增通用请求封装，例如 `src/services/httpClient.ts`，统一处理 base URL、鉴权 header、JSON 解析、错误格式。
2. 先接只读接口：学员列表、教练列表、套餐列表、订单列表、开课组列表。
3. 再接详情接口：学员详情、教练详情、订单详情、套餐详情、开课组详情。
4. 再接简单写操作：新增学员、新增教练、新增套餐、新增订单。
5. 最后接复杂写操作：关闭订单、退款、开课组加人、移除订单、换课、改教练、删除开课组。
6. 对尚未接接口的模块继续保留 mock，并在代码或文档中标记“待接入”。
7. 当某个业务域完全接入后，再考虑删除对应 mock 初始数据，避免过早删除导致页面无法回退演示。

### 11.4 `AdminDataContext` 的改造方向

当前 `AdminDataContext` 同时承担“数据仓库”和“写操作”。接接口后有两种可行路线：

| 路线 | 做法 | 适用情况 |
|---|---|---|
| 渐进式保留 Context | Context 内调用 service，成功后刷新或更新本地 state。 | 改动小，适合当前项目。 |
| 引入数据请求库 | 使用专门的数据请求/缓存库管理列表、详情、mutation。 | 接口多、分页多、缓存和刷新规则复杂时再考虑。 |

当前项目建议先走“渐进式保留 Context”，这样页面改动最小。等接口数量和状态复杂度明显上升后，再评估是否引入数据请求库。

## 12. API 接入检查清单

接入每个业务模块时，可以按下面清单检查：

- 环境变量：是否配置 API base URL，例如 `VITE_API_BASE_URL`。
- 请求封装：是否统一处理 JSON、错误码、网络错误、超时。
- 鉴权：是否统一附带 token/cookie，登录过期是否能跳转或提示。
- Loading：列表、详情、保存按钮是否有加载状态。
- Empty：接口返回空列表时是否显示空状态。
- Error：接口失败时是否显示可理解的错误信息。
- 分页：列表是否支持 page/pageSize/total 或后端要求的分页方式。
- 筛选和搜索：筛选参数是否与后端字段一致。
- 枚举映射：前端中文状态与后端状态码是否有明确转换。
- 时间字段：提交和展示是否统一处理本地时间与 UTC。
- 新增/编辑：提交成功后是否刷新列表或跳转详情。
- 关闭订单：是否有关闭原因、状态限制、重复点击保护。
- 退款：是否校验退款金额、退款原因、订单状态。
- 开课：是否校验人数容量、套餐、教练、订单状态。
- 换课：是否处理原订单和新订单的互斥关系。
- 改教练：是否检查教练可用状态和排课冲突。
- 删除：是否有确认、失败回滚和权限限制。
- 文件上传：支付凭证是否通过上传接口获得文件 ID/URL，而不是继续保存 `dataUrl`。
- Mock 标记：未接接口的模块是否仍明确使用 mock，避免误认为已接后端。

## 13. 接口接入后的验收建议

接口接入不是只看页面能打开，还应验证业务路径：

- 学员：列表加载、筛选、新建、详情打开。
- 教练：列表加载、新建、详情关联开课组。
- 套餐：列表、详情、新建、编辑、过期。
- 订单：列表、详情、新建、编辑、关闭、退款、凭证查看。
- 开课：查看可开课订单、创建/维护开课组、添加订单、移除订单、换课、改教练、开课。
- 消息：收件人加载、保存草稿、发送、历史列表。
- 审批：请假列表、同意、拒绝。
- 设置：主题切换仍正常。

每完成一个业务域，建议至少运行：

```bash
npm run lint
npm run build
```

文档-only 修改通常不需要构建；真实接口接入或业务代码变更后需要构建验证。
