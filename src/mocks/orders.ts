export const ORDER_STATUSES = ["待支付", "进行中", "已完成", "已取消"] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_METHODS = [
  "待确认",
  "微信",
  "支付宝",
  "银行转账",
  "现金",
  "其他",
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export interface OrderListItem {
  id: string;
  studentId: string;
  packageId: string;
  amount: number;
  status: OrderStatus;
  /** Local wall time minute precision, e.g. `2026-03-12T10:18` */
  orderDate: string;
  paymentMethod: PaymentMethod;
  /** Minute precision when payment is confirmed */
  paymentDate?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export function requiresConfirmedPayment(status: OrderStatus): boolean {
  return status === "进行中" || status === "已完成";
}

export const INITIAL_ORDER_LIST: OrderListItem[] = [
  {
    id: "ORD-1001",
    studentId: "ST-1024",
    packageId: "PKG-1",
    amount: 3980,
    status: "进行中",
    orderDate: "2026-03-12T10:18",
    paymentMethod: "微信",
    paymentDate: "2026-03-12T10:18",
    note: "春季班续费，家长已确认课表。",
    createdAt: "2026-03-12T02:18:00.000Z",
    updatedAt: "2026-03-12T02:18:00.000Z",
  },
  {
    id: "ORD-1002",
    studentId: "ST-1042",
    packageId: "PKG-2",
    amount: 2680,
    status: "已完成",
    orderDate: "2026-01-08T14:24",
    paymentMethod: "支付宝",
    paymentDate: "2026-01-08T14:24",
    note: "短杆专项课包已结清。",
    createdAt: "2026-01-08T06:24:00.000Z",
    updatedAt: "2026-02-28T09:30:00.000Z",
  },
  {
    id: "ORD-1003",
    studentId: "ST-1055",
    packageId: "PKG-4",
    amount: 1280,
    status: "待支付",
    orderDate: "2026-05-10T11:42",
    paymentMethod: "待确认",
    note: "亲子体验课，等待家长确认付款。",
    createdAt: "2026-05-10T03:42:00.000Z",
    updatedAt: "2026-05-10T03:42:00.000Z",
  },
  {
    id: "ORD-1004",
    studentId: "ST-1080",
    packageId: "PKG-3",
    amount: 6800,
    status: "已取消",
    orderDate: "2026-04-18T16:15",
    paymentMethod: "待确认",
    note: "排期冲突，已转为后续再沟通。",
    createdAt: "2026-04-18T08:15:00.000Z",
    updatedAt: "2026-04-20T01:10:00.000Z",
  },
];
