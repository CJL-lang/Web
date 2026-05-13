import { findPackageByName } from "./packages";
import { getStudentById, type StudentListItem } from "./students";

export interface StudentFeaturedMedal {
  id: string;
  label: string;
}

export interface StudentBadgeWallItem {
  id: string;
  rank: string;
  label: string;
  levelScale: string;
}

export interface StudentBadges {
  featuredMedals: StudentFeaturedMedal[];
  badgeWall: StudentBadgeWallItem[];
}

export interface StudentParentContact {
  userId?: string;
  name: string;
  relation: string;
  phone: string;
  emergencyContact?: string;
  homeAddress?: string;
  occupation?: string;
  notes?: string;
  updatedAt?: string;
}

export interface StudentCoachProfile {
  name: string;
  title: string;
  phone: string;
  specialty: string;
}

export interface StudentAbilityAxis {
  label: string;
  value: number;
}

export interface StudentProgressMetric {
  id: string;
  label: string;
  value: string;
  helper?: string;
  progress?: number;
}

export interface StudentProgressDimensionDetail {
  id: string;
  label: string;
  score: number;
}

export interface StudentProgressDimension {
  id: string;
  title: string;
  score: number;
  summary: string;
  details: StudentProgressDimensionDetail[];
}

export interface StudentProgressTrendPoint {
  label: string;
  value: number;
}

export interface StudentProgressTrend {
  id: string;
  label: string;
  summary: string;
  changeText: string;
  points: StudentProgressTrendPoint[];
}

export interface StudentProgressOverviewSummary {
  title: string;
  subtitle: string;
  recordsLabel: string;
  lead: string;
  support: string;
}

export interface StudentProgressOverview {
  summary: StudentProgressOverviewSummary;
  metrics: StudentProgressMetric[];
  dimensions: StudentProgressDimension[];
  trends: StudentProgressTrend[];
}

/** 与家长端套餐状态 pill tone 对齐 */
export type PackageStatusTone = "success" | "active" | "muted";

/** 套餐列表与详情顶部展示的三种固定状态 */
export type PackageDisplayStatus = "已结业" | "进行中" | "已体验";

/** 列表徽章配色 → CSS：--success / --active / --muted */
export function toneForPackageStatus(
  status: PackageDisplayStatus,
): PackageStatusTone {
  if (status === "已结业") {
    return "success";
  }
  if (status === "进行中") {
    return "active";
  }
  return "muted";
}

export interface StudentPackagePeriod {
  start: string;
  end: string;
}

export interface StudentPackageOverview {
  completedLessons: number;
  totalLessons: number;
}

export interface StudentPackagePlanSummary {
  title: string;
  description: string;
}

export interface StudentPackageOutlineItem {
  id: string;
  title: string;
  description: string;
  statusLabel: string;
}

export interface StudentPackageDetail {
  period: StudentPackagePeriod;
  overview: StudentPackageOverview;
  planSummary: StudentPackagePlanSummary;
  courseOutline: StudentPackageOutlineItem[];
}

export interface StudentAdminPackage {
  id: string;
  name: string;
  status: PackageDisplayStatus;
  summary: string;
  detail: StudentPackageDetail;
  /** 命中商务目录 mock 时在弹窗展示班型「1 对 N」 */
  catalogCoachStudentRatio?: number;
}

export interface StudentFullProfile extends StudentListItem {
  age: number;
  gender: "男" | "女";
  /** 学号（展示用，可与内部 id 不同） */
  schoolNo: string;
  badges: StudentBadges;
  parents: StudentParentContact[];
  coachProfile: StudentCoachProfile;
  ability: StudentAbilityAxis[];
  progressOverview: StudentProgressOverview;
  packages: StudentAdminPackage[];
}

const coachDirectory: Record<
  string,
  Omit<StudentCoachProfile, "name">
> = {
  陈教练: {
    title: "高级教练",
    phone: "138 1234 6012",
    specialty: "青少年梯队 · 挥杆技术",
  },
  王教练: {
    title: "主教练",
    phone: "136 2468 8841",
    specialty: "成人入门 · 下场策略",
  },
  刘教练: {
    title: "资深教练",
    phone: "137 1357 2290",
    specialty: "私教强化 · 短杆",
  },
  黄教练: {
    title: "教练",
    phone: "135 9753 7736",
    specialty: "基础训练 · 体能配合",
  },
};

function seedFromStudentId(id: string): number {
  const tail = id.replace(/^ST-/, "");
  let n = 0;
  for (let i = 0; i < tail.length; i += 1) {
    n += tail.charCodeAt(i);
  }
  return n;
}

function coachProfileFromRosterName(name: string): StudentCoachProfile {
  const meta = coachDirectory[name];
  if (meta) {
    return { name, ...meta };
  }
  return {
    name,
    title: "教练",
    phone: "—",
    specialty: "—",
  };
}

function defaultAbility(seed: number): StudentAbilityAxis[] {
  const bump = (base: number) =>
    Math.min(98, Math.max(38, base + (seed % 17) - 8));
  return [
    { label: "挥杆稳定", value: bump(62 + (seed % 7)) },
    { label: "短杆", value: bump(58 + (seed % 11)) },
    { label: "木杆", value: bump(55 + (seed % 13)) },
    { label: "推杆", value: bump(60 + (seed % 9)) },
    { label: "体能", value: bump(52 + (seed % 15)) },
    { label: "规则理解", value: bump(48 + (seed % 12)) },
  ];
}

function clampScore(base: number, seed: number, min = 1, max = 10) {
  return Math.max(min, Math.min(max, base + (seed % 3) - 1));
}

function formatAverage(value: number) {
  return `${value.toFixed(1)} 分`;
}

function formatDelta(delta: number) {
  return `${delta >= 0 ? "+" : ""}${delta.toFixed(1)} 分`;
}

function buildDetailScores(
  seed: number,
  labels: string[],
  baseScores: number[],
): StudentProgressDimensionDetail[] {
  return labels.map((label, index) => ({
    id: `${label}-${index}`.toLowerCase(),
    label,
    score: clampScore(baseScores[index] ?? 6, seed + index),
  }));
}

function averageScore(items: StudentProgressDimensionDetail[]) {
  if (items.length === 0) {
    return 0;
  }
  return items.reduce((sum, item) => sum + item.score, 0) / items.length;
}

function defaultProgressOverview(seed: number): StudentProgressOverview {
  const dimensions: StudentProgressDimension[] = [
    {
      id: "swingMechanics",
      title: "挥杆力学",
      summary: "是目前最稳的一项，动作结构已经进入可稳定复现阶段。",
      details: buildDetailScores(
        seed + 1,
        ["握杆", "站姿", "上杆", "下杆", "触球"],
        [8, 7, 7, 6, 8],
      ),
      score: 0,
    },
    {
      id: "shortGame",
      title: "短杆技术",
      summary: "下一阶段优先补强，重点先把触地和落点控制拉稳。",
      details: buildDetailScores(
        seed + 2,
        ["切杆", "劈起", "沙坑", "距离感", "停球"],
        [6, 6, 5, 7, 6],
      ),
      score: 0,
    },
    {
      id: "putting",
      title: "推杆技术",
      summary: "线路判断不错，接下来需要提升中距离推进的稳定性。",
      details: buildDetailScores(
        seed + 3,
        ["瞄线", "节奏", "距离", "短推", "抗压"],
        [8, 7, 8, 7, 6],
      ),
      score: 0,
    },
    {
      id: "physical",
      title: "体能基础",
      summary: "基础够用，但高强度训练后稳定性还有提升空间。",
      details: buildDetailScores(
        seed + 4,
        ["稳定", "灵活", "爆发", "耐力", "平衡"],
        [6, 7, 5, 6, 6],
      ),
      score: 0,
    },
    {
      id: "mental",
      title: "心理素质",
      summary: "训练状态进入得更快了，比赛场景还要继续积累信心。",
      details: buildDetailScores(
        seed + 5,
        ["专注", "复位", "决策", "抗压", "节奏"],
        [7, 7, 6, 6, 7],
      ),
      score: 0,
    },
    {
      id: "courseManagement",
      title: "球场管理",
      summary: "策略意识开始成形，攻守选择还可以再更果断。",
      details: buildDetailScores(
        seed + 6,
        ["开球策略", "攻果岭", "失误控制", "选杆", "复盘"],
        [6, 6, 7, 6, 7],
      ),
      score: 0,
    },
  ].map((dimension) => ({
    ...dimension,
    score: Number(averageScore(dimension.details).toFixed(1)),
  }));

  const strongest = [...dimensions].sort((a, b) => b.score - a.score)[0];
  const focus = [...dimensions].sort((a, b) => a.score - b.score)[0];
  const average =
    dimensions.reduce((sum, item) => sum + item.score, 0) /
    Math.max(1, dimensions.length);

  const trends: StudentProgressTrend[] = [
    {
      id: "swingMechanics",
      label: "挥杆力学",
      summary: "起杆到下杆的节奏已经连续三周保持稳定抬升。",
      changeText: formatDelta(1.2),
      points: [
        { label: "Week 1", value: 5.8 },
        { label: "Week 2", value: 6.1 },
        { label: "Week 3", value: 6.4 },
        { label: "Week 4", value: 6.8 },
        { label: "Week 5", value: 7.0 },
      ],
    },
    {
      id: "shortGame",
      label: "短杆技术",
      summary: "触地反馈有进步，但不同草况下的落点离散还偏大。",
      changeText: formatDelta(0.6),
      points: [
        { label: "Week 1", value: 5.6 },
        { label: "Week 2", value: 5.9 },
        { label: "Week 3", value: 6.0 },
        { label: "Week 4", value: 6.1 },
        { label: "Week 5", value: 6.2 },
      ],
    },
    {
      id: "putting",
      label: "推杆技术",
      summary: "中距离推进更稳了，比赛压力下还需要更多模拟训练。",
      changeText: formatDelta(0.9),
      points: [
        { label: "Week 1", value: 6.2 },
        { label: "Week 2", value: 6.5 },
        { label: "Week 3", value: 6.7 },
        { label: "Week 4", value: 6.9 },
        { label: "Week 5", value: 7.1 },
      ],
    },
  ];

  return {
    summary: {
      title: "成长章节",
      subtitle: "六项维度 · 各项 1-10 分",
      recordsLabel: "测评记录",
      lead: `${strongest?.title ?? "当前优势"}是目前最稳的一项，下一阶段优先补强 ${focus?.title ?? "基础能力"}。`,
      support: "提升期 Week 5 / 8 已推进到当前阶段，本周目标完成 3 / 4。",
    },
    metrics: [
      {
        id: "phase",
        label: "阶段进度",
        value: "62%",
        helper: "提升期 Week 5 / 8",
        progress: 62,
      },
      {
        id: "weeklyGoal",
        label: "本周目标",
        value: "3 / 4",
        helper: "已完成 3 个训练目标",
      },
      {
        id: "focus",
        label: "优先补强",
        value: focus?.title ?? "短杆技术",
        helper: "优先提升当前短板能力",
      },
      {
        id: "average",
        label: "能力画像",
        value: formatAverage(average),
        helper: "六项维度平均分",
      },
    ],
    dimensions,
    trends,
  };
}

function clampRank(base: number, min: number, max: number, seed: number) {
  return Math.max(min, Math.min(max, base + (seed % 3) - 1));
}

function formatRank(level: number) {
  return `L${level}`;
}

function defaultBadges(seed: number): StudentBadges {
  return {
    featuredMedals: [
      { id: "progress", label: "进步勋章" },
      { id: "talent", label: "天赋勋章" },
    ],
    badgeWall: [
      {
        id: "skill-irons",
        rank: formatRank(clampRank(7, 1, 9, seed + 1)),
        label: "铁杆",
        levelScale: "L1-L9",
      },
      {
        id: "skill-woods",
        rank: formatRank(clampRank(6, 1, 9, seed + 2)),
        label: "木杆",
        levelScale: "L1-L9",
      },
      {
        id: "skill-putting",
        rank: formatRank(clampRank(8, 1, 9, seed + 3)),
        label: "推杆",
        levelScale: "L1-L9",
      },
      {
        id: "skill-scrambling",
        rank: formatRank(clampRank(5, 1, 9, seed + 4)),
        label: "救球",
        levelScale: "L1-L9",
      },
      {
        id: "skill-finesse-wedges",
        rank: formatRank(clampRank(4, 1, 9, seed + 5)),
        label: "切杆",
        levelScale: "L1-L9",
      },
      {
        id: "dimension-swing-mechanics",
        rank: formatRank(clampRank(6, 1, 10, seed + 6)),
        label: "挥杆力学",
        levelScale: "L1-L10",
      },
      {
        id: "dimension-short-game",
        rank: formatRank(clampRank(7, 1, 10, seed + 7)),
        label: "短杆技术",
        levelScale: "L1-L10",
      },
      {
        id: "dimension-putting",
        rank: formatRank(clampRank(8, 1, 10, seed + 8)),
        label: "推杆技术",
        levelScale: "L1-L10",
      },
      {
        id: "dimension-physical",
        rank: formatRank(clampRank(5, 1, 10, seed + 9)),
        label: "体能基础",
        levelScale: "L1-L10",
      },
      {
        id: "dimension-mental",
        rank: formatRank(clampRank(7, 1, 10, seed + 10)),
        label: "心理素质",
        levelScale: "L1-L10",
      },
      {
        id: "dimension-course-management",
        rank: formatRank(clampRank(6, 1, 10, seed + 11)),
        label: "球场管理",
        levelScale: "L1-L10",
      },
    ],
  };
}

function defaultParents(
  student: StudentListItem,
  seed: number,
): StudentParentContact[] {
  const last4 = (1000 + (seed % 9000)).toString().slice(-4);
  const areaIndex = seed % 4;
  const districts = ["浦东新区", "徐汇区", "静安区", "闵行区"];
  const occupations = ["企业管理", "医生", "金融从业者", "教师"];
  return [
    {
      userId: `mock-parent-${student.id.toLowerCase()}-1`,
      name: `${student.name.slice(0, 1)}女士`,
      relation: "母亲",
      phone: `139 1234 ${last4}`,
      emergencyContact: `139 1234 ${last4}`,
      homeAddress: `上海市${districts[areaIndex]}高尔夫社区 ${18 + (seed % 60)} 号`,
      occupation: occupations[areaIndex],
      updatedAt: "2026-05-12",
    },
  ];
}

function placeholderOutline(
  studentId: string,
  packageKey: string,
  variant: "in-progress" | "completed",
): StudentPackageOutlineItem[] {
  const p = `${studentId}-${packageKey}`;
  const thirdStatus = variant === "completed" ? "已销课" : "待上课";
  return [
    {
      id: `${p}-l1`,
      title: "第 1 节：热身与安全走线",
      description: "练习场规范、基础站姿与握杆复盘。",
      statusLabel: "已销课",
    },
    {
      id: `${p}-l2`,
      title: "第 2 节：节奏与平面",
      description: "半挥与全挥节奏，辅助录像对比。",
      statusLabel: "已销课",
    },
    {
      id: `${p}-l3`,
      title: "第 3 节：专项巩固",
      description: "根据上周数据布置打位与短杆练习。",
      statusLabel: thirdStatus,
    },
  ];
}

function defaultPackages(student: StudentListItem): StudentAdminPackage[] {
  const seed = seedFromStudentId(student.id);
  const enrollment = student.status;
  const primaryExpired = enrollment === "已过期";
  const primaryPkgStatus: PackageDisplayStatus = primaryExpired
    ? "已结业"
    : "进行中";

  const catalog = findPackageByName(student.packageName);

  const totalPrimary = catalog
    ? catalog.lessonCount
    : 14 + (seed % 12);
  const remainingPrimary = primaryExpired
    ? 0
    : Math.max(
        1,
        Math.min(4 + (seed % 8), Math.max(1, totalPrimary - 1)),
      );
  const completedPrimary = primaryExpired
    ? totalPrimary
    : totalPrimary - remainingPrimary;

  const periodPrimary = primaryExpired
    ? { start: "2024.02.01", end: "2024.12.28" }
    : { start: "2025.09.01", end: "2026.06.30" };

  const plansJoined = catalog?.improvementPlans.join("； ") ?? "";
  const planTitle = catalog
    ? "核心提升计划"
    : primaryExpired
      ? "结业归档"
      : "阶段训练计划";
  const planDescription = catalog
    ? primaryExpired
      ? `${catalog.introduction}\n\n重点：${plansJoined}\n\n共 ${totalPrimary} 节课程已结业归档。`
      : `${catalog.introduction}\n\n重点：${plansJoined}\n\n当前进度 ${completedPrimary}/${totalPrimary} 节。`
    : primaryExpired
      ? `共 ${totalPrimary} 节系统课已结业；权益已到期，可联系前台续办。`
      : `共 ${totalPrimary} 节系统课，当前进度 ${completedPrimary}/${totalPrimary}。`;

  const totalHist = 8;
  const monthStart = 6 + (seed % 3);
  const periodHist = {
    start: `2025.${String(monthStart).padStart(2, "0")}.15`,
    end: `2025.${String(Math.min(12, monthStart + 2)).padStart(2, "0")}.20`,
  };

  return [
    {
      id: `${student.id}-p1`,
      name: student.packageName,
      status: primaryPkgStatus,
      summary:
        enrollment === "已过期"
          ? "已结业归档 · 权益如需延续可联系前台"
          : "当前进行中 · 含场地与教练课时",
      ...(catalog
        ? { catalogCoachStudentRatio: catalog.coachStudentRatio }
        : {}),
      detail: {
        period: periodPrimary,
        overview: {
          completedLessons: completedPrimary,
          totalLessons: totalPrimary,
        },
        planSummary: {
          title: planTitle,
          description: planDescription,
        },
        courseOutline: placeholderOutline(
          student.id,
          "p1",
          primaryExpired ? "completed" : "in-progress",
        ),
      },
    },
    {
      id: `${student.id}-p2`,
      name: "假期集训（历史）",
      status: "已结业",
      summary: "2025 暑期 · 已完成 8/8 次",
      detail: {
        period: periodHist,
        overview: {
          completedLessons: totalHist,
          totalLessons: totalHist,
        },
        planSummary: {
          title: "假期集训营",
          description: `密集周训共 ${totalHist} 次，已全部完成。`,
        },
        courseOutline: placeholderOutline(student.id, "p2", "completed"),
      },
    },
  ];
}

function buildGeneratedProfile(student: StudentListItem): StudentFullProfile {
  const seed = seedFromStudentId(student.id);
  const gender: "男" | "女" =
    student.gender ?? (seed % 2 === 0 ? "男" : "女");
  const age = student.age ?? 9 + (seed % 9);

  return {
    ...student,
    age,
    gender,
    schoolNo: `GX-${student.id.replace(/^ST-/, "")}`,
    badges: defaultBadges(seed),
    parents: defaultParents(student, seed),
    coachProfile: coachProfileFromRosterName(student.coach),
    ability: defaultAbility(seed),
    progressOverview: defaultProgressOverview(seed),
    packages: defaultPackages(student),
  };
}

/** 个别学员的精细补丁（其余由生成逻辑补齐） */
const profilePatches: Partial<Record<string, Partial<StudentFullProfile>>> = {
  "ST-1024": {
    age: 12,
    gender: "男",
    schoolNo: "GX-2024-1024",
    badges: {
      featuredMedals: [
        { id: "progress", label: "进步勋章" },
        { id: "talent", label: "天赋勋章" },
      ],
      badgeWall: [
        { id: "skill-irons", rank: "L7", label: "铁杆", levelScale: "L1-L9" },
        { id: "skill-woods", rank: "L6", label: "木杆", levelScale: "L1-L9" },
        { id: "skill-putting", rank: "L8", label: "推杆", levelScale: "L1-L9" },
        { id: "skill-scrambling", rank: "L5", label: "救球", levelScale: "L1-L9" },
        { id: "skill-finesse-wedges", rank: "L4", label: "切杆", levelScale: "L1-L9" },
        {
          id: "dimension-swing-mechanics",
          rank: "L6",
          label: "挥杆力学",
          levelScale: "L1-L10",
        },
        {
          id: "dimension-short-game",
          rank: "L7",
          label: "短杆技术",
          levelScale: "L1-L10",
        },
        {
          id: "dimension-putting",
          rank: "L8",
          label: "推杆技术",
          levelScale: "L1-L10",
        },
        {
          id: "dimension-physical",
          rank: "L5",
          label: "体能基础",
          levelScale: "L1-L10",
        },
        {
          id: "dimension-mental",
          rank: "L7",
          label: "心理素质",
          levelScale: "L1-L10",
        },
        {
          id: "dimension-course-management",
          rank: "L6",
          label: "球场管理",
          levelScale: "L1-L10",
        },
      ],
    },
    parents: [
      {
        userId: "mock-parent-st-1024-1",
        name: "林岚",
        relation: "母亲",
        phone: "139 1234 2208",
        emergencyContact: "139 1234 2208",
        homeAddress: "上海市浦东新区世纪公园片区 28 号",
        occupation: "品牌策划",
        updatedAt: "2026-05-12",
      },
      {
        userId: "mock-parent-st-1024-2",
        name: "林峻",
        relation: "父亲",
        phone: "138 5678 9031",
        emergencyContact: "138 5678 9031",
        homeAddress: "上海市浦东新区世纪公园片区 28 号",
        occupation: "企业管理",
        updatedAt: "2026-05-12",
      },
    ],
    coachProfile: {
      name: "陈教练",
      title: "高级教练 · 梯队负责人",
      phone: "138 1234 6012",
      specialty: "青少年进阶 · 挥杆平面",
    },
    ability: [
      { label: "挥杆稳定", value: 78 },
      { label: "短杆", value: 72 },
      { label: "木杆", value: 69 },
      { label: "推杆", value: 81 },
      { label: "体能", value: 74 },
      { label: "规则理解", value: 66 },
    ],
    progressOverview: {
      summary: {
        title: "成长章节",
        subtitle: "六项维度 · 各项 1-10 分",
        recordsLabel: "测评记录",
        lead: "挥杆力学是目前最稳的一项，下一阶段优先补强短杆技术。",
        support: "提升期 Week 5 / 8 已推进到当前阶段，本周目标完成 3 / 4。",
      },
      metrics: [
        {
          id: "phase",
          label: "阶段进度",
          value: "62%",
          helper: "提升期 Week 5 / 8",
          progress: 62,
        },
        {
          id: "weeklyGoal",
          label: "本周目标",
          value: "3 / 4",
          helper: "本周训练任务已完成 3 项",
        },
        {
          id: "focus",
          label: "优先补强",
          value: "短杆技术",
          helper: "下一阶段重点提升触地与落点控制",
        },
        {
          id: "average",
          label: "能力画像",
          value: "7.2 分",
          helper: "六项维度平均分",
        },
      ],
      dimensions: [
        {
          id: "swingMechanics",
          title: "挥杆力学",
          score: 7.2,
          summary: "是目前最稳的一项，动作结构已经进入可稳定复现阶段。",
          details: [
            { id: "grip", label: "握杆", score: 8 },
            { id: "setup", label: "站姿", score: 7 },
            { id: "backswing", label: "上杆", score: 7 },
            { id: "downswing", label: "下杆", score: 6 },
            { id: "impact", label: "触球", score: 8 },
          ],
        },
        {
          id: "shortGame",
          title: "短杆技术",
          score: 6.0,
          summary: "下一阶段优先补强，重点先把触地和落点控制拉稳。",
          details: [
            { id: "chip", label: "切杆", score: 6 },
            { id: "pitch", label: "劈起", score: 6 },
            { id: "bunker", label: "沙坑", score: 5 },
            { id: "distance", label: "距离感", score: 7 },
            { id: "stop", label: "停球", score: 6 },
          ],
        },
        {
          id: "putting",
          title: "推杆技术",
          score: 7.2,
          summary: "中距离推进更稳了，比赛压力下还需要更多模拟训练。",
          details: [
            { id: "line", label: "瞄线", score: 8 },
            { id: "tempo", label: "节奏", score: 7 },
            { id: "distance", label: "距离", score: 8 },
            { id: "short", label: "短推", score: 7 },
            { id: "pressure", label: "抗压", score: 6 },
          ],
        },
        {
          id: "physical",
          title: "体能基础",
          score: 6.0,
          summary: "基础够用，但高强度训练后稳定性还有提升空间。",
          details: [
            { id: "stability", label: "稳定", score: 6 },
            { id: "mobility", label: "灵活", score: 7 },
            { id: "explosive", label: "爆发", score: 5 },
            { id: "endurance", label: "耐力", score: 6 },
            { id: "balance", label: "平衡", score: 6 },
          ],
        },
        {
          id: "mental",
          title: "心理素质",
          score: 6.6,
          summary: "训练状态进入得更快了，比赛场景还要继续积累信心。",
          details: [
            { id: "focus", label: "专注", score: 7 },
            { id: "reset", label: "复位", score: 7 },
            { id: "decision", label: "决策", score: 6 },
            { id: "pressure", label: "抗压", score: 6 },
            { id: "rhythm", label: "节奏", score: 7 },
          ],
        },
        {
          id: "courseManagement",
          title: "球场管理",
          score: 6.4,
          summary: "策略意识开始成形，攻守选择还可以再更果断。",
          details: [
            { id: "teeShot", label: "开球策略", score: 6 },
            { id: "approach", label: "攻果岭", score: 6 },
            { id: "miss", label: "失误控制", score: 7 },
            { id: "club", label: "选杆", score: 6 },
            { id: "review", label: "复盘", score: 7 },
          ],
        },
      ],
      trends: [
        {
          id: "swingMechanics",
          label: "挥杆力学",
          summary: "起杆到下杆的节奏已经连续三周保持稳定抬升。",
          changeText: "+1.2 分",
          points: [
            { label: "Week 1", value: 5.8 },
            { label: "Week 2", value: 6.1 },
            { label: "Week 3", value: 6.4 },
            { label: "Week 4", value: 6.8 },
            { label: "Week 5", value: 7.0 },
          ],
        },
        {
          id: "shortGame",
          label: "短杆技术",
          summary: "触地反馈有进步，但不同草况下的落点离散还偏大。",
          changeText: "+0.6 分",
          points: [
            { label: "Week 1", value: 5.6 },
            { label: "Week 2", value: 5.9 },
            { label: "Week 3", value: 6.0 },
            { label: "Week 4", value: 6.1 },
            { label: "Week 5", value: 6.2 },
          ],
        },
        {
          id: "putting",
          label: "推杆技术",
          summary: "中距离推进更稳了，比赛压力下还需要更多模拟训练。",
          changeText: "+0.9 分",
          points: [
            { label: "Week 1", value: 6.2 },
            { label: "Week 2", value: 6.5 },
            { label: "Week 3", value: 6.7 },
            { label: "Week 4", value: 6.9 },
            { label: "Week 5", value: 7.1 },
          ],
        },
      ],
    },
  },
};

export function getStudentProfileFromListItem(
  item: StudentListItem
): StudentFullProfile {
  const generated = buildGeneratedProfile(item);
  const patch = profilePatches[item.id];
  if (!patch) {
    return generated;
  }
  return {
    ...generated,
    ...patch,
    badges: patch.badges ?? generated.badges,
    parents: patch.parents ?? generated.parents,
    ability: patch.ability ?? generated.ability,
    progressOverview: patch.progressOverview ?? generated.progressOverview,
    packages: patch.packages ?? generated.packages,
    coachProfile: patch.coachProfile
      ? { ...generated.coachProfile, ...patch.coachProfile }
      : generated.coachProfile,
  };
}

/** 仅匹配种子 `studentList` 中学员；新建学员请用 getStudentProfileFromListItem */
export function getStudentProfile(id: string): StudentFullProfile | undefined {
  const base = getStudentById(id);
  if (!base) {
    return undefined;
  }
  return getStudentProfileFromListItem(base);
}
