export interface MessageRecipient {
  id: string;
  name: string;
}

/** 系统消息图标：原 10 类业务 + 扩展调性，用于收件列表头像渐变与图形 */
export const SYSTEM_MESSAGE_ICON_OPTIONS = [
  { kind: "booking", label: "预约", category: "业务与教学" },
  { kind: "assessment", label: "测评", category: "业务与教学" },
  { kind: "homework", label: "作业", category: "业务与教学" },
  { kind: "coachSubstitute", label: "代课", category: "业务与教学" },
  { kind: "courseUpdate", label: "课程变更", category: "业务与教学" },
  { kind: "venue", label: "场地", category: "业务与教学" },
  { kind: "packageBalance", label: "套餐余量", category: "账务与套餐" },
  { kind: "paymentSuccess", label: "支付成功", category: "账务与套餐" },
  { kind: "invoice", label: "账单", category: "账务与套餐" },
  { kind: "refund", label: "退款", category: "账务与套餐" },
  { kind: "holiday", label: "假期", category: "活动与节庆" },
  { kind: "eventOpen", label: "活动开放", category: "活动与节庆" },
  { kind: "celebration", label: "祝贺", category: "活动与节庆" },
  { kind: "policy", label: "制度", category: "公告与提醒" },
  { kind: "reminder", label: "提醒", category: "公告与提醒" },
  { kind: "urgent", label: "紧急", category: "公告与提醒" },
  { kind: "warning", label: "预警", category: "公告与提醒" },
  { kind: "maintenance", label: "维护", category: "公告与提醒" },
] as const;

export type SystemMessageIconKind =
  (typeof SYSTEM_MESSAGE_ICON_OPTIONS)[number]["kind"];

export type SystemMessageIconCategory =
  (typeof SYSTEM_MESSAGE_ICON_OPTIONS)[number]["category"];

export const SYSTEM_MESSAGE_ICON_CATEGORY_ORDER: SystemMessageIconCategory[] = [
  "业务与教学",
  "账务与套餐",
  "活动与节庆",
  "公告与提醒",
];

export const SYSTEM_MESSAGE_ICON_KINDS: SystemMessageIconKind[] =
  SYSTEM_MESSAGE_ICON_OPTIONS.map((o) => o.kind);

export interface SendMessagePayload {
  title: string;
  body: string;
  studentIds: string[];
  coachIds: string[];
  iconKind: SystemMessageIconKind;
}
