# Golf Academy Admin（高尔夫学院后台）

面向高尔夫学院运营的 **React + Vite** 管理端：统计看板、学员/教练管理、消息发布、审批与设置。业务数据当前以 **Mock** 与 **`AdminDataProvider`**（Context）为主，便于演示与后端对接前的原型。

---

## 目录

- [开发与运行](#dev)
- [路由一览](#routes)
- [源码结构（速查）](#structure)
- [数据与状态](#data)
- [附录：文件索引](#appendix)

---

<a id="dev"></a>

## 开发与运行

**环境**：Node.js **20 LTS+**；`npm` / `pnpm` / `yarn` 均可。

**常用命令**：

| 命令 | 作用 |
|------|------|
| `npm install` | 安装依赖 |
| `npm run dev` | 本地开发（默认端口 **5173**，`vite.config` 中 `host: 0.0.0.0` 可局域网访问） |
| `npm run build` | `tsc -b` + 生产打包，输出 **`dist/`** |
| `npm run preview` | 本地预览打包结果 |
| `npm run lint` | ESLint（`eslint.config.js`） |

---

<a id="routes"></a>

## 路由一览

**入口**：`/` → 重定向到 `/dashboard`；仪表盘默认子页为 **`/dashboard/students`**。

**全局导航文案**（侧栏与各断点）在 **`src/constants/navigation.ts`**；路由表在 **`src/router/index.tsx`**。

| 模块 | 路径 | 说明 |
|------|------|------|
| 仪表盘 | `/dashboard` | 嵌套子路由容器 |
| 仪表盘 | `/dashboard/students` | 学员维度统计与图表 |
| 仪表盘 | `/dashboard/coaches` | 教练维度统计 |
| 仪表盘 | `/dashboard/revenue` | 收入相关图表 |
| 消息 | `/messages` | 发布运营消息 |
| 学员 | `/students` | 列表 |
| 学员 | `/students/new` | 新建 |
| 学员 | `/students/:studentId` | 详情与管理 |
| 教练 | `/coaches` | 列表 |
| 教练 | `/coaches/new` | 新建 |
| 教练 | `/coaches/:coachId` | 详情 |
| 其他 | `/approvals` | 审批（如请假） |
| 其他 | `/settings` | 设置 |

---

<a id="structure"></a>

## 源码结构（速查）

```
src/
├── main.tsx, App.tsx          # 入口与 RouterProvider
├── router/index.tsx           # 全部路由定义
├── layouts/AdminLayout.tsx    # 侧栏 + 响应式导航 + Outlet + AdminDataProvider
├── pages/                     # 按业务分子目录（dashboard / students / coaches / messages / …）
├── components/                # navigation、dashboard、students、messages、ui 等可复用块
├── context/AdminDataContext.tsx
├── constants/navigation.ts
├── mocks/                     # 列表与详情等示例数据
├── types/                     # dashboard、message 等类型
├── utils/                     # cn、adminIds（递增 ST-/CH- 编号）
└── styles/
    ├── tokens.css             # 设计变量（先于 globals 加载）
    └── globals.css            # Tailwind + 聚合各 components.*.css
```

**样式加载顺序**：`main.tsx` 中先 **`tokens.css`**，再 **`globals.css`**（内含 Tailwind 与逐层 `@import` 的组件样式）。

---

<a id="data"></a>

## 数据与状态

- **学员 / 教练列表**：`AdminDataProvider` 内存维护，初始数据来自 `mocks/`；`addStudent` / `addCoach` 写入；**刷新页面会重置**。
- **新建 ID**：`src/utils/adminIds.ts`（`nextStudentId`、`nextCoachId` 等）。
- **接入真实 API**：可逐步替换 Context 数据源，类型可沉淀在 `src/types/` 或共享包。

---

<a id="appendix"></a>

## 附录：分目录文件说明

以下为逐文件说明，按需展开；日常开发优先看上文 **源码结构（速查）** 即可。小节使用 `<details>` 折叠；在 **GitHub** 上会显示为可点击展开，本地部分预览可能仍会显示原始标签。

<details>
<summary><strong>展开：根目录与配置文件</strong></summary>

| 文件 | 说明 |
|------|------|
| `package.json` | 依赖与脚本 |
| `package-lock.json` | npm 锁版本 |
| `index.html` | 页面壳、`#root`、入口 `main.tsx` |
| `vite.config.ts` | React + Tailwind 插件、dev server |
| `tsconfig.json` | 引用 `tsconfig.app.json` |
| `tsconfig.app.json` | 应用 TS 严格选项与 include |
| `eslint.config.js` | ESLint 扁平配置，忽略 `dist` |

`dist/` 为 **`npm run build`** 产物，部署静态站点时用该目录。

</details>

<details>
<summary><strong>展开：src 入口、路由、布局</strong></summary>

| 文件 | 说明 |
|------|------|
| `main.tsx` | `StrictMode`、挂载根节点；引入 `tokens.css` → `globals.css` |
| `App.tsx` | `RouterProvider` |
| `vite-env.d.ts` | Vite 类型 |
| `router/index.tsx` | `createBrowserRouter`，根布局 `AdminLayout`，各子路由与重定向 |
| `layouts/AdminLayout.tsx` | Sidebar / TabletNav / MobileNav；主区包 `AdminDataProvider` + `Outlet` |

</details>

<details>
<summary><strong>展开：pages（页面）</strong></summary>

**`pages/dashboard/`**  
`DashboardPage`（子路由 `Outlet`）、`DashboardStudentsPage`、`DashboardCoachesPage`、`DashboardRevenuePage`；`index.ts` 集中导出。

**`pages/students/`**  
`StudentsLayout`、`StudentsListPage`、`StudentCreatePage`、`StudentManagePage`；`index.ts` 导出。

**`pages/coaches/`**  
`CoachesLayout`、`CoachesListPage`、`CoachCreatePage`、`CoachDetailPage`；`index.ts` 导出。

**`pages/messages/`**  
`MessagePublishPage`；`components/RecipientGroupPicker`、`MessageIconPicker`。

**其他**  
`approvals/ApprovalsPage.tsx`、`settings/SettingsPage.tsx`。

</details>

<details>
<summary><strong>展开：components（组件）</strong></summary>

- **`navigation/`**：`Sidebar`、`TabletNav`、`MobileNav`、`AcademyBrand`
- **`dashboard/`**：`StudentOverviewPanel`、`StudentAnalyticsCharts`
- **`students/`**：`StudentProgressOverview`、`StudentBadgeWall`
- **`messages/`**：`SystemInboxMessageIcon`
- **`ui/`**：`Button`、`Field`、`PageHeader`、`SectionCard`、`StatCard`、`EmptyState`、`FeaturePlaceholder`

</details>

<details>
<summary><strong>展开：context · constants · utils · types · mocks</strong></summary>

| 位置 | 说明 |
|------|------|
| `context/AdminDataContext.tsx` | `AdminDataProvider`、`useAdminData()`（须在 Provider 内） |
| `constants/navigation.ts` | `navigationItems`、`NavigationItem` |
| `utils/cn.ts` | 条件 class 拼接 |
| `utils/adminIds.ts` | `nextStudentId`、`nextCoachId`、`coachInitialsFromName` |
| `types/dashboard.ts` | 仪表盘相关类型 |
| `types/message.ts` | 消息域类型 |
| `mocks/` | `students`、`studentProfiles`、`coaches`、`dashboard`、`leaveRequests`、`messageRecipients` |

</details>

<details>
<summary><strong>展开：styles（CSS 文件对照）</strong></summary>

**核心**

- `tokens.css` — 颜色、阴影、渐变等 CSS 变量  
- `globals.css` — `@import "tailwindcss"` + 下列各文件（顺序见文件内注释）  
- `base.document.css` — 文档根级排版  

**`components.*.css`（与 TSX 的 BEM 类名配合）**

| 文件 | 大致对应 |
|------|----------|
| `components.admin-layout.css` | `AdminLayout` |
| `components.route-layout.css` | `StudentsLayout` / `CoachesLayout` |
| `components.navigation.css` | 导航 |
| `components.dashboard-shell.css`、`components.dashboard-stats.css` | 仪表盘壳与统计区 |
| `components.stat-card.css` | `StatCard` |
| `components.page-header.css`、`components.section-card.css` | `PageHeader`、`SectionCard` |
| `components.field.css`、`components.form-shell.css`、`components.button.css` | 表单与按钮 |
| `components.student-detail.css`、`components.coach-detail.css`、`components.badge-wall.css` | 学员/教练详情与徽章墙 |
| `components.resource-list.css`、`components.empty-state.css`、`components.feature-placeholder.css` | 列表与占位 |
| `components.approvals.css` | 审批页 |
| `components.message-ui.css`、`components.message-publish.css`、`components.recipient-group.css`、`components.system-message-icon.css` | 消息相关 |
| `components.inline-icons.css` | 行内图标 |
| `vendors.recharts.css` | Recharts 主题覆盖 |

</details>

---

## License

MIT（见 `package.json` 或与仓库约定一致）。
