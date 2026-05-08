export interface PackageListItem {
  id: string;
  name: string;
  /** 套餐简介：适用对象、结构等，便于管理员理解与维护 */
  introduction: string;
  price: number;
  coachStudentRatio: number;
  lessonCount: number;
  improvementPlans: string[];
}

export const INITIAL_PACKAGE_LIST: PackageListItem[] = [
  {
    id: "PKG-1",
    name: "青少年基础成长套餐",
    introduction:
      "面向青少年常规进阶，小班分阶段练基础挥杆与安全规范，含课后练习要点，便于家长了解整体节奏与目标。",
    price: 3980,
    coachStudentRatio: 4,
    lessonCount: 12,
    improvementPlans: ["建立标准握杆与站姿", "掌握铁杆基础挥杆", "形成课后练习习惯"],
  },
  {
    id: "PKG-2",
    name: "短杆专项提升套餐",
    introduction:
      "聚焦切杆、沙坑与果岭周边，小班纠动作与距离感，适合已有基础、希望稳定减杆的学员。",
    price: 2680,
    coachStudentRatio: 2,
    lessonCount: 8,
    improvementPlans: ["强化切杆距离控制", "提升果岭周边救球稳定性", "建立短杆训练记录"],
  },
  {
    id: "PKG-3",
    name: "私教进阶突破套餐",
    introduction:
      "一对一技术微调与下场策略复盘，可按阶段定目标（距离、弹道、心理障碍等），适合做突破期的深度陪练。",
    price: 6800,
    coachStudentRatio: 1,
    lessonCount: 10,
    improvementPlans: ["定制挥杆技术调整", "优化下场策略与球位选择", "阶段复盘与数据跟踪"],
  },
  {
    id: "PKG-4",
    name: "亲子体验套餐",
    introduction:
      "轻量入门级体验含安全礼仪与趣味短杆/推杆，班级人数偏多、单价低，适合家庭决策前的试水与转化。",
    price: 1280,
    coachStudentRatio: 6,
    lessonCount: 4,
    improvementPlans: ["完成入门安全与礼仪训练", "体验推杆与短杆基础", "评估后续学习方向"],
  },
];
