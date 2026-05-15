export type BadgeTemplateRuleType = "objective" | "subjective";

export interface MedalTemplate {
  id: string;
  label: string;
  levelStart: number;
  levelEnd: number;
  ruleType: BadgeTemplateRuleType;
  rule: string;
}

export interface HonorBadgeTemplate {
  id: string;
  label: string;
}

export const DEFAULT_SUBJECTIVE_MEDAL_RULE =
  "由教练基于课堂表现、阶段评估和下场表现进行主观判断，可根据校区评估标准补充细则。";

export const INITIAL_MEDAL_TEMPLATES: MedalTemplate[] = [
  {
    id: "skill-irons",
    label: "铁杆",
    levelStart: 1,
    levelEnd: 9,
    ruleType: "objective",
    rule: "测试方法：用铁杆向 50、75、100 或 150 码目标击 10 球，根据学员实际距离选择目标。\n计分方式：进入 14 码宽主目标得 2 分，进入两侧 5 码副目标得 1 分。\n等级参考：L1=2 分，L2=3 分，L3=4 分，L4=5 分，L5=6 分，L6=7 分，L7=8 分，L8=9 分，L9=10 分。",
  },
  {
    id: "skill-woods",
    label: "木杆",
    levelStart: 1,
    levelEnd: 9,
    ruleType: "objective",
    rule: "测试方法：按 PDF Driver 测试口径完成 10 次开球，使用木杆完成目标通道测试。\n计分方式：球飞行或滚动穿过 30 码宽目标通道，每球得 1 分。\n等级参考：L1=2 分，L2=3 分，L3=4 分，L4=5 分，L5=6 分，L6=7 分，L7=8 分，L8=9 分，L9=10 分。",
  },
  {
    id: "skill-putting",
    label: "推杆",
    levelStart: 1,
    levelEnd: 9,
    ruleType: "objective",
    rule: "测试方法：3 颗球分别从 5、10、15 英尺起推，20 英尺推 6 颗。\n计分方式：记录全部进洞所需总推数，总推数越低等级越高。\n等级参考：L1=25 推，L2=24 推，L3=23 推，L4=22 推，L5=21 推，L6=20 推，L7=19 推，L8=18 推，L9=17 推。",
  },
  {
    id: "skill-scrambling",
    label: "救球",
    levelStart: 1,
    levelEnd: 9,
    ruleType: "objective",
    rule: "测试方法：在果岭周边不同码数完成 9 次切球或劈起救球。\n计分方式：统计切球/劈起和推杆完成 9 洞所需总杆数，总杆数越低等级越高。\n等级参考：L1=45 杆，L2=42 杆，L3=39 杆，L4=36 杆，L5=31 杆，L6=28 杆，L7=26 杆，L8=23 杆，L9=21 杆。",
  },
  {
    id: "skill-finesse-wedges",
    label: "切杆",
    levelStart: 1,
    levelEnd: 9,
    ruleType: "objective",
    rule: "测试方法：根据年龄和能力，在 15-40 码范围完成 9 次劈起或切杆。\n计分方式：按落点进入内圈/中圈/外圈分别得 3/2/1 分，分数越高等级越高。\n等级参考：L1=2 分，L2=3 分，L3=4 分，L4=5 分，L5=6 分，L6=7 分，L7=8 分，L8=9 分，L9=10 分。",
  },
  {
    id: "dimension-swing-mechanics",
    label: "挥杆力学",
    levelStart: 1,
    levelEnd: 10,
    ruleType: "subjective",
    rule: DEFAULT_SUBJECTIVE_MEDAL_RULE,
  },
  {
    id: "dimension-short-game",
    label: "短杆技术",
    levelStart: 1,
    levelEnd: 10,
    ruleType: "subjective",
    rule: DEFAULT_SUBJECTIVE_MEDAL_RULE,
  },
  {
    id: "dimension-putting",
    label: "推杆技术",
    levelStart: 1,
    levelEnd: 10,
    ruleType: "subjective",
    rule: DEFAULT_SUBJECTIVE_MEDAL_RULE,
  },
  {
    id: "dimension-physical",
    label: "体能基础",
    levelStart: 1,
    levelEnd: 10,
    ruleType: "subjective",
    rule: DEFAULT_SUBJECTIVE_MEDAL_RULE,
  },
  {
    id: "dimension-mental",
    label: "心理素质",
    levelStart: 1,
    levelEnd: 10,
    ruleType: "subjective",
    rule: DEFAULT_SUBJECTIVE_MEDAL_RULE,
  },
  {
    id: "dimension-course-management",
    label: "球场管理",
    levelStart: 1,
    levelEnd: 10,
    ruleType: "subjective",
    rule: DEFAULT_SUBJECTIVE_MEDAL_RULE,
  },
];

export const INITIAL_HONOR_BADGE_TEMPLATES: HonorBadgeTemplate[] = [
  { id: "progress", label: "进步勋章" },
  { id: "talent", label: "天赋勋章" },
];
