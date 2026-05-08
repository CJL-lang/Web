import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../../components/ui/Button";
import { InputField } from "../../components/ui/Field";
import { PageHeader } from "../../components/ui/PageHeader";
import { useAdminData } from "../../context/AdminDataContext";
import { nextStudentId } from "../../utils/adminIds";

const NEW_STUDENT_STATUS = "正式学员";
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
        eyebrow="Students"
        title="新建学员"
      />

      <div className="c-form-shell">
        <div className="c-form-shell__stack">
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

          <div className="c-form-shell__actions">
            <Button type="button" onClick={handleSubmit}>
              保存并查看详情
            </Button>
            <Link className="c-button-link-secondary" to="/students">
              取消
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
