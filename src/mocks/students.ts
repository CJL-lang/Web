/** 列表与筛选使用的学员在读状态（仅两类） */
export type StudentEnrollmentStatus = "正式学员" | "已过期";

const LEGACY_TO_ENROLLMENT: Record<string, StudentEnrollmentStatus> = {
  进行中: "正式学员",
  待回访: "正式学员",
  续费中: "正式学员",
  暂停: "已过期",
};

/** 将历史状态或脏数据统一到正式学员｜已过期（列表、c-context 等均可用） */
export function normalizeEnrollmentStatus(raw: string): StudentEnrollmentStatus {
  if (raw === "正式学员" || raw === "已过期") {
    return raw;
  }
  return LEGACY_TO_ENROLLMENT[raw] ?? "正式学员";
}

export function normalizeStudentListItem(
  item: StudentListItem
): StudentListItem {
  const status = normalizeEnrollmentStatus(item.status);
  return status === item.status ? item : { ...item, status };
}

export interface StudentListItem {
  id: string;
  name: string;
  status: StudentEnrollmentStatus;
  coach: string;
  packageName: string;
  /** 若在列表中填写，则档案页优先使用；否则由生成逻辑推断 */
  gender?: "男" | "女";
  age?: number;
}

/** 种子数据；运行时列表请用 AdminDataContext */
export const INITIAL_STUDENT_LIST: StudentListItem[] = [
  {
    id: "ST-1024",
    name: "林嘉禾",
    status: "正式学员",
    coach: "陈教练",
    packageName: "青少年基础成长套餐",
  },
  {
    id: "ST-1028",
    name: "赵以宁",
    status: "正式学员",
    coach: "王教练",
    packageName: "亲子体验套餐",
  },
  {
    id: "ST-1035",
    name: "周亦晨",
    status: "正式学员",
    coach: "刘教练",
    packageName: "私教进阶突破套餐",
  },
  {
    id: "ST-1042",
    name: "陈语桐",
    status: "已过期",
    coach: "黄教练",
    packageName: "短杆专项提升套餐",
  },
  {
    id: "ST-1046",
    name: "顾思远",
    status: "正式学员",
    coach: "陈教练",
    packageName: "青少年基础成长套餐",
  },
  {
    id: "ST-1051",
    name: "沈若琳",
    status: "正式学员",
    coach: "刘教练",
    packageName: "短期集训营",
  },
  {
    id: "ST-1055",
    name: "韩子墨",
    status: "正式学员",
    coach: "王教练",
    packageName: "亲子体验套餐",
  },
  {
    id: "ST-1059",
    name: "苏晚晴",
    status: "正式学员",
    coach: "黄教练",
    packageName: "私教进阶突破套餐",
  },
  {
    id: "ST-1063",
    name: "程一诺",
    status: "正式学员",
    coach: "刘教练",
    packageName: "青少年基础成长套餐",
  },
  {
    id: "ST-1068",
    name: "叶知秋",
    status: "已过期",
    coach: "陈教练",
    packageName: "短杆专项提升套餐",
  },
  {
    id: "ST-1072",
    name: "方景行",
    status: "正式学员",
    coach: "王教练",
    packageName: "下场实战包",
  },
  {
    id: "ST-1076",
    name: "江心悦",
    status: "正式学员",
    coach: "黄教练",
    packageName: "青少年基础成长套餐",
  },
  {
    id: "ST-1080",
    name: "陆承宇",
    status: "正式学员",
    coach: "陈教练",
    packageName: "私教进阶突破套餐",
  },
  {
    id: "ST-1084",
    name: "白舒扬",
    status: "正式学员",
    coach: "刘教练",
    packageName: "私教进阶突破套餐",
  },
  {
    id: "ST-1089",
    name: "孟清和",
    status: "正式学员",
    coach: "黄教练",
    packageName: "亲子体验套餐",
  },
  {
    id: "ST-1093",
    name: "秦书瑶",
    status: "正式学员",
    coach: "王教练",
    packageName: "青少年基础成长套餐",
  },
];

/** @deprecated 静态快照；页面请使用 AdminDataContext 中的 students */
export const studentList: StudentListItem[] = INITIAL_STUDENT_LIST;

export function getStudentById(id: string): StudentListItem | undefined {
  return studentList.find((s) => s.id === id);
}
