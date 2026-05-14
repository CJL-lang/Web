import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";

import { Button } from "../../components/ui/Button";
import { InputField, TextareaField } from "../../components/ui/Field";
import { PageHeader } from "../../components/ui/PageHeader";
import { useAdminData } from "../../context/AdminDataContext";
import type { PackageListItem } from "../../mocks/packages";
// 教练对学员比例选项
const RATIO_OPTIONS = [1, 2, 3, 4, 6, 8, 10] as const;
// 表单验证错误类型
interface FieldErrors {
  name?: string;
  introduction?: string;
  price?: string;
  lessonCount?: string;
  plan?: string;
}

function parsePositiveIntegerOrNull(input: string): number | null {
  const value = Number.parseInt(input.trim(), 10);
  return Number.isNaN(value) || value <= 0 ? null : value;
}

// 套餐编辑页面
export function PackageEditPage() {
  const { packageId } = useParams<{ packageId: string }>();
  const { packages } = useAdminData();
  const pkg = useMemo(
    () => (packageId ? packages.find((p) => p.id === packageId) : undefined),
    [packageId, packages]
  );
  if (!packageId || !pkg) {
    return <Navigate replace to="/packages" />;
  }
  return <PackageEditForm key={pkg.id} pkg={pkg} />;
}
// 套餐编辑表单
function PackageEditForm({ pkg }: { pkg: PackageListItem }) {
  const navigate = useNavigate();
  const { expirePackage, updatePackage } = useAdminData();

  const [name, setName] = useState(pkg.name);
  const [introduction, setIntroduction] = useState(pkg.introduction);
  const [priceInput, setPriceInput] = useState(
    pkg.price === null ? "" : String(pkg.price)
  );
  const [coachStudentRatio, setCoachStudentRatio] = useState<number>(
    pkg.coachStudentRatio
  );
  const [lessonCountInput, setLessonCountInput] = useState(
    pkg.lessonCount === null ? "" : String(pkg.lessonCount)
  );
  const [plan, setPlan] = useState(
    pkg.improvementPlans.length > 0 ? pkg.improvementPlans.join("； ") : ""
  );
  const [errors, setErrors] = useState<FieldErrors>({});

  const validate = (): boolean => {
    const next: FieldErrors = {};
    const price = Number.parseInt(priceInput.trim(), 10);
    const lessonCount = Number.parseInt(lessonCountInput.trim(), 10);

    if (!name.trim()) {
      next.name = "请输入套餐名称";
    }
    if (!introduction.trim()) {
      next.introduction = "请输入套餐简介（适用对象与结构说明）";
    }
    if (!priceInput.trim() || Number.isNaN(price)) {
      next.price = "请输入有效价格";
    } else if (price <= 0) {
      next.price = "价格需大于 0";
    }
    if (!lessonCountInput.trim() || Number.isNaN(lessonCount)) {
      next.lessonCount = "请输入有效课时数";
    } else if (lessonCount <= 0) {
      next.lessonCount = "课时数需大于 0";
    }
    if (!plan.trim()) {
      next.plan = "请填写核心提升计划";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };
// 提交表单
  const handleSubmit = () => {
    if (!validate() || !pkg) {
      return;
    }

    updatePackage(pkg.id, {
      name: name.trim(),
      introduction: introduction.trim(),
      price: Number.parseInt(priceInput.trim(), 10),
      coachStudentRatio,
      lessonCount: Number.parseInt(lessonCountInput.trim(), 10),
      improvementPlans: [plan.trim()],
      status: "已上架",
    });
    navigate(`/packages/${encodeURIComponent(pkg.id)}`);
  };

  const handleSaveDraft = () => {
    updatePackage(pkg.id, {
      name: name.trim(),
      introduction: introduction.trim(),
      price: parsePositiveIntegerOrNull(priceInput),
      coachStudentRatio,
      lessonCount: parsePositiveIntegerOrNull(lessonCountInput),
      improvementPlans: plan.trim() ? [plan.trim()] : [],
      status: "草稿",
    });
    setErrors({});
    navigate(`/packages/${encodeURIComponent(pkg.id)}`);
  };

  const handleExpirePackage = () => {
    expirePackage(pkg.id);
    navigate(`/packages/${encodeURIComponent(pkg.id)}`);
  };

  return (
    <>
      <PageHeader eyebrow="Commerce" title="编辑套餐" />

      <div className="c-form-shell">
        <div className="c-form-shell__stack">
          <InputField
            autoComplete="off"
            error={errors.name}
            label="名称"
            onChange={(e) => {
              setName(e.target.value);
              setErrors((current) => ({ ...current, name: undefined }));
            }}
            value={name}
          />

          <TextareaField
            error={errors.introduction}
            label="套餐简介"
            onChange={(e) => {
              setIntroduction(e.target.value);
              setErrors((current) => ({ ...current, introduction: undefined }));
            }}
            rows={4}
            value={introduction}
          />

          <InputField
            autoComplete="off"
            error={errors.price}
            inputMode="numeric"
            label="价格"
            min={1}
            onChange={(e) => {
              setPriceInput(e.target.value);
              setErrors((current) => ({ ...current, price: undefined }));
            }}
            type="number"
            value={priceInput}
          />

          <label className="c-field-shell">
            <span className="c-field-shell__label-row">
              <span className="c-field-shell__label">1 对几（教练对学员）</span>
            </span>
            <select
              className="c-field-input"
              onChange={(e) =>
                setCoachStudentRatio(Number.parseInt(e.target.value, 10))
              }
              value={coachStudentRatio}
            >
              {RATIO_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  1 对 {value}
                </option>
              ))}
            </select>
          </label>

          <InputField
            autoComplete="off"
            error={errors.lessonCount}
            inputMode="numeric"
            label="多少节课"
            min={1}
            onChange={(e) => {
              setLessonCountInput(e.target.value);
              setErrors((current) => ({ ...current, lessonCount: undefined }));
            }}
            type="number"
            value={lessonCountInput}
          />

          <InputField
            autoComplete="off"
            error={errors.plan}
            label="核心提升计划"
            onChange={(e) => {
              setPlan(e.target.value);
              setErrors((current) => ({ ...current, plan: undefined }));
            }}
            value={plan}
          />

          <div className="c-form-shell__actions">
            <Button type="button" onClick={handleSubmit}>
              保存修改
            </Button>
            <Button type="button" variant="secondary" onClick={handleSaveDraft}>
              保存草稿
            </Button>
            {pkg.status === "已上架" ? (
              <Button type="button" variant="danger" onClick={handleExpirePackage}>
                下架套餐
              </Button>
            ) : null}
            <Link className="c-button-link-secondary" to="/packages">
              取消
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
