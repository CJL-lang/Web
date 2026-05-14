import { useId, useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "../../components/ui/Button";
import { InputField, TextareaField } from "../../components/ui/Field";
import { cn } from "../../utils/cn";
import {
  PAYMENT_METHODS,
  deriveOrderStatus,
  type OrderListItem,
  type OrderPaymentVoucher,
  type PaymentMethod,
} from "../../mocks/orders";
import {
  formatPackageLessonCount,
  type PackageListItem,
} from "../../mocks/packages";
import type { StudentListItem } from "../../mocks/students";
import {
  formatLocalDateTimeMinute,
  storedToDatetimeLocalValue,
} from "../../utils/orderDateTime";

export type OrderFormPayload = Omit<
  OrderListItem,
  "id" | "createdAt" | "updatedAt" | "closedAt"
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
  paymentVoucher?: string;
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
  const voucherInputId = useId();

  const defaultPackageId = initialOrder?.packageId ?? packages[0]?.id ?? "";
  const defaultPackage = packages.find((p) => p.id === defaultPackageId);

  const [studentId, setStudentId] = useState(
    initialOrder?.studentId ?? students[0]?.id ?? "",
  );
  const [packageId, setPackageId] = useState(defaultPackageId);
  const [amountInput, setAmountInput] = useState(
    initialOrder ? String(initialOrder.amount) : String(defaultPackage?.price ?? ""),
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    initialOrder?.paymentMethod ?? "待确认",
  );
  const [paymentDate, setPaymentDate] = useState(
    storedToDatetimeLocalValue(initialOrder?.paymentDate ?? ""),
  );
  const [paymentVoucher, setPaymentVoucher] = useState<
    OrderPaymentVoucher | undefined
  >(initialOrder?.paymentVoucher);
  const [note, setNote] = useState(initialOrder?.note ?? "");
  const [errors, setErrors] = useState<FieldErrors>({});

  const hasPaymentMethod = paymentMethod !== "待确认";
  const hasPaymentDate = Boolean(paymentDate);
  const hasPaymentVoucher = Boolean(paymentVoucher?.dataUrl);

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
    const paymentFieldCount = [
      hasPaymentMethod,
      hasPaymentDate,
      hasPaymentVoucher,
    ].filter(Boolean).length;

    if (paymentFieldCount > 0 && paymentFieldCount < 3) {
      if (paymentMethod === "待确认") {
        next.paymentMethod = "请选择支付方式";
      }
      if (!paymentDate) {
        next.paymentDate = "请选择订单支付时间";
      }
      if (!paymentVoucher?.dataUrl) {
        next.paymentVoucher = "请上传订单凭证";
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handlePackageChange = (nextPackageId: string) => {
    setPackageId(nextPackageId);
    const nextPackage = packages.find((p) => p.id === nextPackageId);
    if (nextPackage?.price) {
      setAmountInput(String(nextPackage.price));
    }
    setErrors((current) => ({ ...current, packageId: undefined }));
  };

  const handleVoucherChange = (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setPaymentVoucher(undefined);
      setErrors((current) => ({
        ...current,
        paymentVoucher: "请上传图片格式的订单凭证",
      }));
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result !== "string") {
        setErrors((current) => ({
          ...current,
          paymentVoucher: "订单凭证读取失败，请重新上传",
        }));
        return;
      }

      setPaymentVoucher({
        fileName: file.name,
        mimeType: file.type || "image/*",
        dataUrl: reader.result,
      });
      setErrors((current) => ({ ...current, paymentVoucher: undefined }));
    });
    reader.addEventListener("error", () => {
      setErrors((current) => ({
        ...current,
        paymentVoucher: "订单凭证读取失败，请重新上传",
      }));
    });
    reader.readAsDataURL(file);
  };

  const removeVoucher = () => {
    setPaymentVoucher(undefined);
    setErrors((current) => ({ ...current, paymentVoucher: undefined }));
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    const nextPaymentVoucher = paymentVoucher?.dataUrl
      ? paymentVoucher
      : undefined;
    const nextStatus = deriveOrderStatus({
      paymentMethod,
      paymentDate: paymentDate || undefined,
      paymentVoucher: nextPaymentVoucher,
    });

    onSubmit({
      studentId,
      packageId,
      amount: parseAmount(amountInput),
      status: nextStatus,
      orderDate:
        initialOrder?.orderDate ?? formatLocalDateTimeMinute(new Date()),
      paymentMethod: nextStatus === "已完成" ? paymentMethod : "待确认",
      paymentDate: nextStatus === "已完成" ? paymentDate || undefined : undefined,
      paymentVoucher: nextStatus === "已完成" ? nextPaymentVoucher : undefined,
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
                {item.name || "未命名套餐"} ·{" "}
                {formatPackageLessonCount(item.lessonCount)}
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
            <span className="c-field-shell__label">支付方式</span>
          </div>
          <div
            className="c-order-payment-methods"
            role="radiogroup"
            aria-label="支付方式"
          >
            {PAYMENT_METHODS.map((item) => (
              <button
                key={item}
                aria-checked={paymentMethod === item}
                className={cn(
                  "c-order-payment-methods__option",
                  paymentMethod === item &&
                    "c-order-payment-methods__option--active",
                )}
                role="radio"
                type="button"
                onClick={() => {
                  setPaymentMethod(item);
                  setErrors((current) => ({
                    ...current,
                    paymentMethod: undefined,
                  }));
                }}
              >
                {item}
              </button>
            ))}
          </div>
          {errors.paymentMethod ? (
            <span className="c-field-shell__error">{errors.paymentMethod}</span>
          ) : null}
        </div>

        <InputField
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

        <div className="c-field-shell">
          <div className="c-field-shell__label-row">
            <label className="c-field-shell__label" htmlFor={voucherInputId}>
              订单凭证
            </label>
            <span className="c-field-shell__hint">支持上传一张图片</span>
          </div>
          <input
            accept="image/*"
            className="c-field-input c-order-voucher-input"
            id={voucherInputId}
            onChange={(e) => handleVoucherChange(e.target.files)}
            type="file"
          />
          {paymentVoucher ? (
            <div className="c-order-voucher-preview">
              <img
                alt="订单凭证预览"
                className="c-order-voucher-preview__image"
                src={paymentVoucher.dataUrl}
              />
              <div className="c-order-voucher-preview__meta">
                <span className="c-order-voucher-preview__name">
                  {paymentVoucher.fileName}
                </span>
                <Button type="button" variant="secondary" onClick={removeVoucher}>
                  移除凭证
                </Button>
              </div>
            </div>
          ) : null}
          {errors.paymentVoucher ? (
            <span className="c-field-shell__error">{errors.paymentVoucher}</span>
          ) : null}
        </div>

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
