export interface CoachListItem {
  id: string;
  name: string;
  /** 人事状态：在职 / 休假（列表筛选） */
  status: string;
  focus: string;
  initials: string;
  title: string;
  tagline: string;
  avatarUrl: string;
  phone: string;
  /** 带教现场状态：上课中 / 空闲 */
  sessionStatus: string;
  bestScoreShort: string;
  bio: string;
  specialties: string[];
}

/** 种子数据；运行时列表请用 AdminDataContext */
export const INITIAL_COACH_LIST: CoachListItem[] = [
  {
    id: "CH-1001",
    name: "陈教练",
    status: "在职",
    focus: "青少年进阶、基础挥杆",
    initials: "陈教",
    title: "PGA 认证高级教练",
    tagline: "与你长期跟进的学院认证教练",
    avatarUrl:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    phone: "159 8888 8888",
    sessionStatus: "上课中",
    bestScoreShort: "66杆",
    bio: "拥有十余年青少年与业余选手执教经验，擅长用数据与视频复盘帮助学员建立可重复的节奏与预挥杆程序。课堂风格清晰、反馈具体，注重在实战中巩固技术要点。",
    specialties: [
      "开球与铁杆稳定与距离管理",
      "短杆触感与果岭周边救球",
      "下场策略与赛前心理准备",
    ],
  },
  {
    id: "CH-1002",
    name: "王教练",
    status: "在职",
    focus: "成人入门、下场实战",
    initials: "王教",
    title: "学院认证教练 · 下场策略",
    tagline: "侧重成人入门与实战转场节奏",
    avatarUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    phone: "138 1234 5670",
    sessionStatus: "空闲",
    bestScoreShort: "68杆",
    bio: "多年带成人零基础与进阶班，善于把复杂动作拆成可执行步骤，并在下场课中强化球道管理与情绪节奏。",
    specialties: ["成人入门与握杆站姿", "木杆与长铁节奏", "9 洞/18 洞实战策略"],
  },
  {
    id: "CH-1003",
    name: "刘教练",
    status: "在职",
    focus: "私教强化、青少年基础",
    initials: "刘教",
    title: "青少年发展教练",
    tagline: "私教与小班双线带教",
    avatarUrl:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    phone: "136 9876 5432",
    sessionStatus: "上课中",
    bestScoreShort: "67杆",
    bio: "专注青少年基础动作定型与私教强化，配合视频对比让学员看到挥杆链路变化；强调安全、趣味与可衡量的进步。",
    specialties: ["青少年基础挥杆程序", "铁杆压缩与触球质量", "一对一技术微调"],
  },
  {
    id: "CH-1004",
    name: "黄教练",
    status: "休假",
    focus: "私教强化、成人入门",
    initials: "黄教",
    title: "认证教练 · 短杆专项",
    tagline: "短杆与推杆细节打磨",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    phone: "137 0000 8899",
    sessionStatus: "空闲",
    bestScoreShort: "69杆",
    bio: "擅长果岭周边与推杆线路阅读，带教风格细致；休假结束后可继续承接私教与成人入门课。",
    specialties: ["切劈起与沙坑脱困", "推杆距离与坡度", "成人入门短杆模块"],
  },
];

/** @deprecated 静态快照；页面请使用 AdminDataContext 中的 coaches */
export const coachList: CoachListItem[] = INITIAL_COACH_LIST;

export function getCoachById(id: string): CoachListItem | undefined {
  return INITIAL_COACH_LIST.find((c) => c.id === id);
}
