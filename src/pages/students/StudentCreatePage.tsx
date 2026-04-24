import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../../components/ui/Button";
import { InputField } from "../../components/ui/Field";
import { PageHeader } from "../../components/ui/PageHeader";
import { useAdminData } from "../../context/AdminDataContext";
import { nextStudentId } from "../../utils/adminIds";

const NEW_STUDENT_STATUS = "进行中";
const NEW_STUDENT_COACH = "待分配";
const NEW_STUDENT_PACKAGE = "待设置";

interface FieldErrors {
  name?: string;
  gender?: string;
  age?: string;
}

export function StudentCreatePage() {
  const navigate = useNavigate();
  const { students, addStudent } = useAdminData();

  const [name, setName] = useState("");
  const [gender, setGender] = useState<"" | "男" | "女">("");
  const [ageInput, setAgeInput] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (!name.trim()) {
      next.name = "请输入姓名";
    }
    if (!gender) {
      next.gender = "请选择性别";
    }
    const age = Number.parseInt(ageInput.trim(), 10);
    if (!ageInput.trim() || Number.isNaN(age)) {
      next.age = "请输入有效年龄";
    } else if (age < 3 || age > 99) {
      next.age = "年龄需在 3～99 之间";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }
    if (gender !== "男" && gender !== "女") {
      return;
    }
    const id = nextStudentId(students);
    const age = Number.parseInt(ageInput.trim(), 10);
    addStudent({
      id,
      name: name.trim(),
      status: NEW_STUDENT_STATUS,
      coach: NEW_STUDENT_COACH,
      packageName: NEW_STUDENT_PACKAGE,
      gender,
      age,
    });
    navigate(`/students/${id}`);
  };

  return (
    <>
      <PageHeader
        description="请填写学员姓名、性别与年龄；学号将在保存时自动生成。其他信息可在后续流程中补充。"
        eyebrow="Students"
        title="新建学员"
      />

      <div className="rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-soft)] p-5 md:p-6">
        <div className="mx-auto flex max-w-xl flex-col gap-4">
          <InputField
            autoComplete="name"
            error={errors.name}
            label="姓名"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />

          <label className="c-field-shell">
            <span className="c-field-shell__label-row">
              <span className="c-field-shell__label">性别</span>
            </span>
            <select
              className="c-field-input cursor-pointer"
              onChange={(e) =>
                setGender(e.target.value as "" | "男" | "女")
              }
              value={gender}
            >
              <option value="">请选择</option>
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
            {errors.gender ? (
              <span className="c-field-shell__error">{errors.gender}</span>
            ) : null}
          </label>

          <InputField
            autoComplete="off"
            error={errors.age}
            inputMode="numeric"
            label="年龄"
            max={99}
            min={3}
            onChange={(e) => setAgeInput(e.target.value)}
            type="number"
            value={ageInput}
          />

          <p className="m-0 text-xs text-[var(--color-text-muted)]">
            学号将在保存时自动生成（ST- 序号）。新建学员默认状态为「进行中」，教练与课程包为「待分配 / 待设置」，可在档案中继续完善。
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="button" onClick={handleSubmit}>
              保存并查看详情
            </Button>
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface-alt)] px-4 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-alt-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]/60"
              to="/students"
            >
              取消
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
