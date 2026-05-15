export const COURSE_TEMPLATE_TYPES = ["私教", "小班", "专项", "体验"] as const;

export type CourseTemplateType = (typeof COURSE_TEMPLATE_TYPES)[number];

export interface CourseTemplate {
  id: string;
  name: string;
  courseType: CourseTemplateType;
  defaultDurationMinutes: number;
  maxStudents: number;
  goal: string;
  focus: string;
}

export interface TrainingPlanNodeTemplate {
  id: string;
  title: string;
  lessonStart: number;
  lessonEnd: number;
  goal: string;
  focus: string;
}

export interface TrainingPlanTemplate {
  id: string;
  name: string;
  totalLessons: number;
  applicableFor: string;
  nodes: TrainingPlanNodeTemplate[];
}

export interface HomeworkTemplate {
  id: string;
  title: string;
  description: string;
  points: number;
  defaultDueDays: number;
  submissionRequirement: string;
  gradingCriteria: string;
}

export const INITIAL_COURSE_TEMPLATES: CourseTemplate[] = [
  {
    id: "course-basic-private",
    name: "基础挥杆私教课",
    courseType: "私教",
    defaultDurationMinutes: 60,
    maxStudents: 1,
    goal: "建立稳定握杆、站姿和基础挥杆节奏。",
    focus: "握杆检查、站姿校准、半挥杆节奏、课后练习动作复盘。",
  },
  {
    id: "course-junior-group",
    name: "青少年基础小班课",
    courseType: "小班",
    defaultDurationMinutes: 90,
    maxStudents: 4,
    goal: "帮助青少年学员掌握安全规范和基础击球流程。",
    focus: "安全礼仪、热身流程、铁杆基础、推杆趣味练习。",
  },
  {
    id: "course-short-game",
    name: "短杆专项训练课",
    courseType: "专项",
    defaultDurationMinutes: 75,
    maxStudents: 2,
    goal: "提升切杆、劈起和果岭周边救球稳定性。",
    focus: "落点控制、杆面角度、距离分层、短杆数据记录。",
  },
];

export const INITIAL_TRAINING_PLAN_TEMPLATES: TrainingPlanTemplate[] = [
  {
    id: "plan-junior-foundation",
    name: "青少年基础成长计划",
    totalLessons: 12,
    applicableFor: "适用于初学或基础不稳定的青少年学员。",
    nodes: [
      {
        id: "plan-junior-foundation-node-1",
        title: "基础建立",
        lessonStart: 1,
        lessonEnd: 4,
        goal: "建立安全意识、握杆站姿和基础挥杆框架。",
        focus: "安全礼仪、站姿校准、半挥杆节奏、基础推杆。",
      },
      {
        id: "plan-junior-foundation-node-2",
        title: "稳定击球",
        lessonStart: 5,
        lessonEnd: 8,
        goal: "提升铁杆触球质量和短距离方向控制。",
        focus: "铁杆击球、方向校准、距离感、课后练习习惯。",
      },
      {
        id: "plan-junior-foundation-node-3",
        title: "综合应用",
        lessonStart: 9,
        lessonEnd: 12,
        goal: "将基础动作应用到不同球位和简单下场场景。",
        focus: "短杆救球、推杆计分、模拟下场、阶段复盘。",
      },
    ],
  },
  {
    id: "plan-short-game-boost",
    name: "短杆专项提升计划",
    totalLessons: 8,
    applicableFor: "适用于已有基础、希望稳定降低杆数的学员。",
    nodes: [
      {
        id: "plan-short-game-boost-node-1",
        title: "距离分层",
        lessonStart: 1,
        lessonEnd: 3,
        goal: "建立 15-40 码短杆距离控制体系。",
        focus: "落点区间、挥幅分层、球位变化、训练记录。",
      },
      {
        id: "plan-short-game-boost-node-2",
        title: "果岭周边处理",
        lessonStart: 4,
        lessonEnd: 6,
        goal: "提升切杆、劈起和沙坑处理的选择能力。",
        focus: "杆面选择、滚动比例、沙坑脱困、容错策略。",
      },
      {
        id: "plan-short-game-boost-node-3",
        title: "实战复盘",
        lessonStart: 7,
        lessonEnd: 8,
        goal: "将短杆技术应用到模拟下场和计分复盘。",
        focus: "一切一推目标、失误复盘、练习计划调整。",
      },
    ],
  },
];

export const INITIAL_HOMEWORK_TEMPLATES: HomeworkTemplate[] = [
  {
    id: "homework-grip-stance",
    title: "握杆与站姿打卡",
    description: "按课堂示范完成握杆、站姿和瞄准流程练习。",
    points: 5,
    defaultDueDays: 3,
    submissionRequirement: "提交 2 张正面/侧面照片或 30 秒练习视频。",
    gradingCriteria: "握杆位置、站姿稳定性、瞄准流程完整度。",
  },
  {
    id: "homework-putting-distance",
    title: "推杆距离感练习",
    description: "完成 3 组不同距离推杆练习并记录进洞或停球结果。",
    points: 8,
    defaultDueDays: 5,
    submissionRequirement: "提交练习记录表和 1 段推杆动作视频。",
    gradingCriteria: "距离控制、动作节奏、记录完整度。",
  },
  {
    id: "homework-short-game-log",
    title: "短杆落点记录",
    description: "在指定距离完成短杆落点训练，记录每球落点区间。",
    points: 10,
    defaultDueDays: 7,
    submissionRequirement: "提交落点记录和至少 1 张练习场景照片。",
    gradingCriteria: "落点稳定性、训练数量、复盘说明质量。",
  },
];
