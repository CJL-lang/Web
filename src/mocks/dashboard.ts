import type {
  DashboardMetric,
  DashboardModuleTab,
  DashboardTimeRange,
  DashboardTimeRangeOption,
  InsightItem,
  StudentStatsDataset,
} from "../types/dashboard";

export const dashboardMetrics: DashboardMetric[] = [
  {
    id: "students",
    label: "学员总数",
    value: "1,286",
    caption: "本月新增 54 人，续课率保持稳定",
    trend: "up",
  },
  {
    id: "coaches",
    label: "教练总数",
    value: "46",
    caption: "全职 28 人，兼职 18 人",
    trend: "neutral",
  },
  {
    id: "revenue",
    label: "本月营收",
    value: "¥368,000",
    caption: "较上月增长 12.6%",
    trend: "up",
  },
];

export const dashboardInsights: InsightItem[] = [
  {
    id: "classes",
    title: "课程排期密度",
    value: "82%",
    description: "周末时段接近满额，适合后续增加高需求课程。",
  },
  {
    id: "retention",
    title: "复购观察",
    value: "67%",
    description: "老学员复购集中在 4-8 周窗口，可作为消息触达重点。",
  },
  {
    id: "leads",
    title: "潜在线索",
    value: "39",
    description: "高意向咨询主要来自体验课转正式课链路。",
  },
];

export const dashboardModuleTabs: DashboardModuleTab[] = [
  {
    id: "students",
    label: "学员",
    path: "/dashboard/students",
  },
  {
    id: "coaches",
    label: "教练",
    path: "/dashboard/coaches",
  },
  {
    id: "revenue",
    label: "营收",
    path: "/dashboard/revenue",
  },
];

export const dashboardTimeRanges: DashboardTimeRangeOption[] = [
  {
    id: "30d",
    label: "近30天",
  },
  {
    id: "12m",
    label: "近12个月",
  },
  {
    id: "term",
    label: "本学期",
  },
];

export const studentStatsByRange: Record<DashboardTimeRange, StudentStatsDataset> = {
  "30d": {
    summary: {
      totalStudents: {
        id: "students-total-30d",
        label: "学员总人数",
        value: "1,286",
        caption: "当前在读学员中，青少年课程占比 84%，校区整体招生基盘稳定。",
        trend: "up",
      },
      businessMetrics: [
        {
          id: "students-new-30d",
          label: "本月新增",
          value: "54",
          caption: "体验课转正贡献了新增的主要来源。",
          trend: "up",
        },
        {
          id: "students-renewal-30d",
          label: "续费率",
          value: "73%",
          caption: "L4-L6 阶段学员的续费表现最好。",
          trend: "up",
        },
        {
          id: "students-attendance-30d",
          label: "到课率",
          value: "91%",
          caption: "周末班满班率高，平日傍晚时段仍有增长空间。",
          trend: "neutral",
        },
      ],
    },
    ageBuckets: [
      { id: "5-7", label: "5-7岁", male: 86, female: 72 },
      { id: "8-10", label: "8-10岁", male: 168, female: 142 },
      { id: "11-13", label: "11-13岁", male: 194, female: 158 },
      { id: "14-16", label: "14-16岁", male: 176, female: 136 },
      { id: "17-19", label: "17-19岁", male: 84, female: 46 },
      { id: "20-22", label: "20-22岁", male: 18, female: 6 },
    ],
    genderRatio: [
      { id: "male", label: "男学员", value: 726 },
      { id: "female", label: "女学员", value: 560 },
    ],
    levelTrend: [
      { label: "第1周", L1: 136, L2: 142, L3: 128, L4: 96, L5: 82, L6: 66, L7: 42, L8: 24, L9: 12 },
      { label: "第2周", L1: 132, L2: 146, L3: 131, L4: 98, L5: 84, L6: 68, L7: 43, L8: 24, L9: 13 },
      { label: "第3周", L1: 128, L2: 150, L3: 136, L4: 102, L5: 86, L6: 69, L7: 44, L8: 26, L9: 13 },
      { label: "第4周", L1: 123, L2: 156, L3: 141, L4: 105, L5: 89, L6: 72, L7: 46, L8: 27, L9: 14 },
      { label: "第5周", L1: 119, L2: 160, L3: 145, L4: 108, L5: 92, L6: 74, L7: 47, L8: 28, L9: 15 },
      { label: "第6周", L1: 115, L2: 166, L3: 149, L4: 111, L5: 95, L6: 77, L7: 48, L8: 29, L9: 15 },
    ],
    attendanceTrend: [
      { label: "4/01", value: 142 },
      { label: "4/05", value: 168 },
      { label: "4/09", value: 156 },
      { label: "4/13", value: 184 },
      { label: "4/17", value: 173 },
      { label: "4/21", value: 191 },
      { label: "4/25", value: 186 },
      { label: "4/29", value: 198 },
    ],
  },
  "12m": {
    summary: {
      totalStudents: {
        id: "students-total-12m",
        label: "学员总人数",
        value: "1,286",
        caption: "近 12 个月学员结构保持稳定，核心增量集中在 8-16 岁青少年梯队。",
        trend: "up",
      },
      businessMetrics: [
        {
          id: "students-new-12m",
          label: "本月新增",
          value: "54",
          caption: "寒暑假前后的转化效率显著高于学期中。",
          trend: "up",
        },
        {
          id: "students-renewal-12m",
          label: "续费率",
          value: "73%",
          caption: "年度续费主力集中在阶段提升明确的中腰部等级。",
          trend: "up",
        },
        {
          id: "students-attendance-12m",
          label: "到课率",
          value: "91%",
          caption: "全年波动主要来自考试季与冬训窗口。",
          trend: "neutral",
        },
      ],
    },
    ageBuckets: [
      { id: "5-7", label: "5-7岁", male: 82, female: 68 },
      { id: "8-10", label: "8-10岁", male: 162, female: 138 },
      { id: "11-13", label: "11-13岁", male: 198, female: 162 },
      { id: "14-16", label: "14-16岁", male: 181, female: 140 },
      { id: "17-19", label: "17-19岁", male: 86, female: 48 },
      { id: "20-22", label: "20-22岁", male: 17, female: 4 },
    ],
    genderRatio: [
      { id: "male", label: "男学员", value: 726 },
      { id: "female", label: "女学员", value: 560 },
    ],
    levelTrend: [
      { label: "5月", L1: 182, L2: 164, L3: 142, L4: 104, L5: 88, L6: 70, L7: 45, L8: 25, L9: 12 },
      { label: "6月", L1: 176, L2: 168, L3: 146, L4: 108, L5: 92, L6: 72, L7: 47, L8: 26, L9: 13 },
      { label: "7月", L1: 172, L2: 173, L3: 151, L4: 112, L5: 96, L6: 75, L7: 49, L8: 28, L9: 14 },
      { label: "8月", L1: 166, L2: 178, L3: 157, L4: 116, L5: 98, L6: 78, L7: 52, L8: 30, L9: 15 },
      { label: "9月", L1: 158, L2: 184, L3: 162, L4: 121, L5: 102, L6: 82, L7: 54, L8: 31, L9: 16 },
      { label: "10月", L1: 154, L2: 188, L3: 167, L4: 124, L5: 106, L6: 84, L7: 55, L8: 32, L9: 16 },
      { label: "11月", L1: 149, L2: 193, L3: 171, L4: 128, L5: 109, L6: 87, L7: 57, L8: 33, L9: 17 },
      { label: "12月", L1: 144, L2: 198, L3: 176, L4: 132, L5: 112, L6: 90, L7: 59, L8: 34, L9: 17 },
      { label: "1月", L1: 138, L2: 201, L3: 181, L4: 136, L5: 116, L6: 93, L7: 61, L8: 35, L9: 18 },
      { label: "2月", L1: 132, L2: 195, L3: 176, L4: 133, L5: 114, L6: 92, L7: 60, L8: 35, L9: 18 },
      { label: "3月", L1: 126, L2: 189, L3: 171, L4: 130, L5: 112, L6: 90, L7: 58, L8: 34, L9: 17 },
      { label: "4月", L1: 120, L2: 184, L3: 168, L4: 128, L5: 110, L6: 88, L7: 57, L8: 33, L9: 17 },
    ],
    attendanceTrend: [
      { label: "5月", value: 156 },
      { label: "6月", value: 161 },
      { label: "7月", value: 174 },
      { label: "8月", value: 188 },
      { label: "9月", value: 171 },
      { label: "10月", value: 176 },
      { label: "11月", value: 179 },
      { label: "12月", value: 185 },
      { label: "1月", value: 192 },
      { label: "2月", value: 168 },
      { label: "3月", value: 181 },
      { label: "4月", value: 189 },
    ],
  },
  term: {
    summary: {
      totalStudents: {
        id: "students-total-term",
        label: "学员总人数",
        value: "1,286",
        caption: "本学期中高等级学员留存稳定，低等级新学员补充节奏健康。",
        trend: "up",
      },
      businessMetrics: [
        {
          id: "students-new-term",
          label: "本月新增",
          value: "54",
          caption: "校内活动和体验营仍是主要引流入口。",
          trend: "up",
        },
        {
          id: "students-renewal-term",
          label: "续费率",
          value: "73%",
          caption: "教学目标明确的班型续费表现更稳。",
          trend: "up",
        },
        {
          id: "students-attendance-term",
          label: "到课率",
          value: "91%",
          caption: "学期中段到课趋稳，家长配合度较高。",
          trend: "neutral",
        },
      ],
    },
    ageBuckets: [
      { id: "5-7", label: "5-7岁", male: 84, female: 70 },
      { id: "8-10", label: "8-10岁", male: 165, female: 140 },
      { id: "11-13", label: "11-13岁", male: 191, female: 156 },
      { id: "14-16", label: "14-16岁", male: 178, female: 139 },
      { id: "17-19", label: "17-19岁", male: 82, female: 47 },
      { id: "20-22", label: "20-22岁", male: 16, female: 5 },
    ],
    genderRatio: [
      { id: "male", label: "男学员", value: 716 },
      { id: "female", label: "女学员", value: 557 },
    ],
    levelTrend: [
      { label: "开学", L1: 146, L2: 152, L3: 132, L4: 98, L5: 84, L6: 68, L7: 45, L8: 25, L9: 12 },
      { label: "第2周", L1: 141, L2: 157, L3: 136, L4: 101, L5: 86, L6: 70, L7: 46, L8: 26, L9: 12 },
      { label: "第4周", L1: 136, L2: 163, L3: 140, L4: 104, L5: 89, L6: 73, L7: 48, L8: 27, L9: 13 },
      { label: "第6周", L1: 130, L2: 168, L3: 145, L4: 108, L5: 91, L6: 74, L7: 49, L8: 28, L9: 14 },
      { label: "第8周", L1: 125, L2: 173, L3: 149, L4: 111, L5: 94, L6: 76, L7: 50, L8: 28, L9: 14 },
      { label: "第10周", L1: 120, L2: 179, L3: 153, L4: 115, L5: 97, L6: 78, L7: 51, L8: 29, L9: 15 },
    ],
    attendanceTrend: [
      { label: "开学", value: 148 },
      { label: "第2周", value: 159 },
      { label: "第4周", value: 171 },
      { label: "第6周", value: 176 },
      { label: "第8周", value: 182 },
      { label: "第10周", value: 188 },
    ],
  },
};
