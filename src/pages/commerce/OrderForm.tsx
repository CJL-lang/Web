import { useId, useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "../../components/ui/Button";
import { InputField, TextareaField } from "../../components/ui/Field";
import {
  ORDER_STATUSES,
  PAYMENT_METHODS,
  requiresConfirmedPayment,
  type OrderListItem,
  type OrderStatus,
  type PaymentMethod,
} from "../../mocks/orders";
import type { PackageListItem } from "../../mocks/packages";
import type { StudentListItem } from "../../mocks/students";
import {
  formatLocalDateTimeMinute,
  storedToDatetimeLocalValue,
} from "../../utils/orderDateTime";

export type OrderFormPayload = Omit<
  OrderListItem,
  "id" | "createdAt" | "updatedAt"
>;

interface OrderFormProps {
  students: StudentListItem[];
  packages: PackageListItem[];
  initialOrder?: OrderListItem;
  submitLabel: string;
  cancelTo: string;
  onSubmit: (payload: OrderFormPayload) => void;
}

interface FieldErrors {
  studentId?: string;
  packageId?: string;
  amount?: string;
  paymentMethod?: string;
  paymentDate?: string;
}

function parseAmount(input: string) {
  return Number.parseInt(input.trim(), 10);
}

export function OrderForm({
  cancelTo,
  initialOrder,
  onSubmit,
  packages,
  students,
  submitLabel,
}: OrderFormProps) {
  const studentSelectId = useId();
  const packageSelectId = useId();
  const statusSelectId = useId();
  const paymentSelectId = useId();

  const defaultPackageId = initialOrder?.packageId ?? packages[0]?.id ?? "";
  const defaultPackage = packages.find((p) => p.id === defaultPackageId);
  const initialStatus = initialOrder?.status ?? "待支付";

  const [studentId, setStudentId] = useState(
    initialOrder?.studentId ?? students[0]?.id ?? "",
  );
  const [packageId, setPackageId] = useState(defaultPackageId);
  const [amountInput, setAmountInput] = useState(
    initialOrder ? String(initialOrder.amount) : String(defaultPackage?.price ?? ""),
  );
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    initialStatus === "待支付"
      ? "待确认"
      : (initialOrder?.paymentMethod ?? "待确认"),
  );
  const [paymentDate, setPaymentDate] = useState(
    storedToDatetimeLocalValue(initialOrder?.paymentDate ?? ""),
  );
  const [note, setNote] = useState(initialOrder?.note ?? "");
  const [errors, setErrors] = useState<FieldErrors>({});

  const validate = (): boolean => {
    const next: FieldErrors = {};
    const amount = parseAmount(amountInput);

    if (!studentId) {
      next.studentId = "请选择学员";
    }
    if (!packageId) {
      next.packageId = "请选择套餐";
    }
    if (!amountInput.trim() || Number.isNaN(amount)) {
      next.amount = "请输入有效订单金额";
    } else if (amount <= 0) {
      next.amount = "订单金额需大于 0";
    }
    if (requiresConfirmedPayment(status)) {
      if (paymentMethod === "待确认") {
        next.paymentMethod = "请选择支付方式";
      }
      if (!paymentDate) {
        next.paymentDate = "请选择订单支付时间";
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handlePackageChange = (nextPackageId: string) => {
    setPackageId(nextPackageId);
    const nextPackage = packages.find((p) => p.id === nextPackageId);
    if (nextPackage) {
      setAmountInput(String(nextPackage.price));
    }
    setErrors((current) => ({ ...current, packageId: undefined }));
  };

  const handleStatusChange = (nextStatus: OrderStatus) => {
    setStatus(nextStatus);
    if (nextStatus === "待支付") {
      setPaymentMethod("待确认");
      setPaymentDate("");
    }
    setErrors((current) => ({
      ...current,
      paymentDate: undefined,
      paymentMethod: undefined,
    }));
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    onSubmit({
      studentId,
      packageId,
      amount: parseAmount(amountInput),
      status,
      orderDate:
        initialOrder?.orderDate ?? formatLocalDateTimeMinute(new Date()),
      paymentMethod: status === "待支付" ? "待确认" : paymentMethod,
      paymentDate: status === "待支付" ? undefined : paymentDate || undefined,
      note: note.trim() || undefined,
    });
  };

  return (
    <div className="c-form-shell">
      <div className="c-form-shell__stack">
        <div className="c-field-shell">
          <div className="c-field-shell__label-row">
            <label className="c-field-shell__label" htmlFor={studentSelectId}>
              学员
            </label>
          </div>
          <select
            className="c-field-input"
            id={studentSelectId}
            onChange={(e) => {
              setStudentId(e.target.value);
              setErrors((current) => ({ ...current, studentId: undefined }));
            }}
            value={studentId}
          >
            <option value="">请选择学员</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name} · {student.id}
              </option>
            ))}
          </select>
          {errors.studentId ? (
            <span className="c-field-shell__error">{errors.studentId}</span>
          ) : null}
        </div>

        <div className="c-field-shell">
          <div className="c-field-shell__label-row">
            <label className="c-field-shell__label" htmlFor={packageSelectId}>
              套餐
            </label>
            <span className="c-field-shell__hint">切换套餐会带出默认价格</span>
          </div>
          <select
            className="c-field-input"
            id={packageSelectId}
            onChange={(e) => handlePackageChange(e.target.value)}
            value={packageId}
          >
            <option value="">请选择套餐</option>
            {packages.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} · {item.lessonCount} 节
              </option>
            ))}
          </select>
          {errors.packageId ? (
            <span className="c-field-shell__error">{errors.packageId}</span>
          ) : null}
        </div>

        <InputField
          autoComplete="off"
          error={errors.amount}
          inputMode="numeric"
          label="订单金额"
          min={1}
          onChange={(e) => {
            setAmountInput(e.target.value);
            setErrors((current) => ({ ...current, amount: undefined }));
          }}
          type="number"
          value={amountInput}
        />

        <div className="c-field-shell">
          <div className="c-field-shell__label-row">
            <label className="c-field-shell__label" htmlFor={statusSelectId}>
              订单状态
            </label>
          </div>
          <select
            autoComplete="off"
            className="c-field-input"
            id={statusSelectId}
            onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
            value={status}
          >
            {ORDER_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="c-field-shell">
          <div className="c-field-shell__label-row">
            <label className="c-field-shell__label" htmlFor={paymentSelectId}>
              支付方式
            </label>
          </div>
          <select
            className="c-field-input"
            disabled={status === "待支付"}
            id={paymentSelectId}
            onChange={(e) => {
              setPaymentMethod(e.target.value as PaymentMethod);
              setErrors((current) => ({
                ...current,
                paymentMethod: undefined,
              }));
            }}
            value={paymentMethod}
          >
            {PAYMENT_METHODS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.paymentMethod ? (
            <span className="c-field-shell__error">{errors.paymentMethod}</span>
          ) : null}
        </div>

        <InputField
          disabled={status === "待支付"}
          error={errors.paymentDate}
          label="订单支付时间"
          onChange={(e) => {
            setPaymentDate(e.target.value);
            setErrors((current) => ({ ...current, paymentDate: undefined }));
          }}
          step={60}
          type="datetime-local"
          value={paymentDate}
        />

        <TextareaField
          label="备注"
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          value={note}
        />

        <div className="c-form-shell__actions">
          <Button type="button" onClick={handleSubmit}>
            {submitLabel}
          </Button>
          <Link className="c-button-link-secondary" to={cancelTo}>
            取消
          </Link>
        </div>
      </div>
    </div>
  );
}
