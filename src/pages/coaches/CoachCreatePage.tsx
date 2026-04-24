import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../../components/ui/Button";
import { InputField } from "../../components/ui/Field";
import { PageHeader } from "../../components/ui/PageHeader";
import type { CoachListItem } from "../../mocks/coaches";
import { useAdminData } from "../../context/AdminDataContext";
import { coachInitialsFromName, nextCoachId } from "../../utils/adminIds";

interface FieldErrors {
  name?: string;
  phone?: string;
  title?: string;
  focus?: string;
}

export function CoachCreatePage() {
  const navigate = useNavigate();
  const { coaches, addCoach } = useAdminData();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("");
  const [focus, setFocus] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (!name.trim()) {
      next.name = "请输入姓名（建议以「教练」结尾）";
    }
    if (!phone.trim()) {
      next.phone = "请输入联系电话";
    }
    if (!title.trim()) {
      next.title = "请输入职称";
    }
    if (!focus.trim()) {
      next.focus = "请输入列表摘要（主攻方向一行）";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }
    const id = nextCoachId(coaches);
    const trimmedName = name.trim();
    const item: CoachListItem = {
      id,
      name: trimmedName,
      status: "在职",
      focus: focus.trim(),
      initials: coachInitialsFromName(trimmedName),
      title: title.trim(),
      tagline: "学院认证教练",
      avatarUrl: "",
      phone: phone.trim(),
      sessionStatus: "空闲",
      bestScoreShort: "—",
      bio: "（待完善）",
      specialties: ["待补充"],
    };
    addCoach(item);
    navigate(`/coaches/${id}`);
  };

  return (
    <>
      <PageHeader
        description="填写基础信息即可加入教练列表；其余档案字段将使用占位默认值，后续可接接口维护。"
        eyebrow="Coaches"
        title="新建教练"
      />

      <div className="rounded-[24px] border border-[var(--color-border-subtle)] bg-[var(--color-surface-soft)] p-5 md:p-6">
        <div className="mx-auto flex max-w-xl flex-col gap-4">
          <InputField
            autoComplete="off"
            error={errors.name}
            label="姓名"
            onChange={(e) => setName(e.target.value)}
            placeholder="例如：张教练"
            value={name}
          />

          <InputField
            autoComplete="off"
            error={errors.phone}
            label="联系电话"
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
          />

          <InputField
            autoComplete="off"
            error={errors.title}
            label="职称"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例如：学院认证教练"
            value={title}
          />

          <InputField
            autoComplete="off"
            error={errors.focus}
            label="主攻方向（列表摘要）"
            onChange={(e) => setFocus(e.target.value)}
            value={focus}
          />

          <p className="m-0 text-xs text-[var(--color-text-muted)]">
            教练编号将在保存时自动生成（CH- 序号）。
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="button" onClick={handleSubmit}>
              保存并查看详情
            </Button>
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface-alt)] px-4 py-3 text-sm font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-alt-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]/60"
              to="/coaches"
            >
              取消
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
