import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../../components/ui/Button";
import { InputField, TextareaField } from "../../components/ui/Field";
import { PageHeader } from "../../components/ui/PageHeader";
import type { CoachListItem } from "../../mocks/coaches";
import { useAdminData } from "../../context/AdminDataContext";
import { coachInitialsFromName, nextCoachId } from "../../utils/adminIds";

interface FieldErrors {
  name?: string;
  phone?: string;
  title?: string;
  focus?: string;
  bio?: string;
  specialties?: string;
}

export function CoachCreatePage() {
  const navigate = useNavigate();
  const { coaches, addCoach } = useAdminData();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("");
  const [focus, setFocus] = useState("");
  const [bio, setBio] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([""]);
  const [errors, setErrors] = useState<FieldErrors>({});

  const updateSpecialty = (index: number, value: string) => {
    setSpecialties((current) =>
      current.map((item, i) => (i === index ? value : item))
    );
    setErrors((current) => ({ ...current, specialties: undefined }));
  };

  const addSpecialty = () => {
    setSpecialties((current) => [...current, ""]);
  };

  const removeSpecialty = (index: number) => {
    setSpecialties((current) => {
      if (current.length === 1) {
        return [""];
      }
      return current.filter((_, i) => i !== index);
    });
  };

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
    if (!bio.trim()) {
      next.bio = "请输入简介";
    }
    const trimmedSpecialties = specialties.map((item) => item.trim()).filter(Boolean);
    if (trimmedSpecialties.length === 0) {
      next.specialties = "请至少填写一条擅长方向";
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
      tagline: "",
      avatarUrl: "",
      phone: phone.trim(),
      sessionStatus: "空闲",
      bestScoreShort: "—",
      bio: bio.trim(),
      specialties: specialties.map((item) => item.trim()).filter(Boolean),
    };
    addCoach(item);
    navigate(`/coaches/${id}`);
  };

  return (
    <>
      <PageHeader
        eyebrow="Coaches"
        title="新建教练"
      />

      <div className="c-form-shell">
        <div className="c-form-shell__stack">
          <InputField
            autoComplete="off"
            error={errors.name}
            label="姓名"
            onChange={(e) => setName(e.target.value)}
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
            value={title}
          />

          <InputField
            autoComplete="off"
            error={errors.focus}
            label="主攻方向（列表摘要）"
            onChange={(e) => setFocus(e.target.value)}
            value={focus}
          />

          <TextareaField
            error={errors.bio}
            label="简介"
            onChange={(e) => setBio(e.target.value)}
            rows={5}
            value={bio}
          />

          <div className="c-field-shell">
            <span className="c-field-shell__label-row c-field-shell__label-row--inline">
              <span className="c-field-shell__label">擅长方向</span>
              <button
                className="c-button-link-quiet"
                onClick={addSpecialty}
                type="button"
              >
                <Plus size={12} aria-hidden />
                添加一项
              </button>
            </span>

            <div className="c-package-plan-list">
              {specialties.map((specialty, index) => (
                <div className="c-package-plan-item" key={index}>
                  <div className="c-package-plan-item__field">
                    <InputField
                      autoComplete="off"
                      label={`方向 ${index + 1}`}
                      onChange={(e) => updateSpecialty(index, e.target.value)}
                      value={specialty}
                    />
                  </div>
                  <Button
                    className="c-package-plan-item__remove"
                    onClick={() => removeSpecialty(index)}
                    type="button"
                    variant="ghost"
                  >
                    <Trash2 aria-hidden size={15} />
                    删除
                  </Button>
                </div>
              ))}
            </div>

            {errors.specialties ? (
              <span className="c-field-shell__error">{errors.specialties}</span>
            ) : null}
          </div>

          <div className="c-form-shell__actions">
            <Button type="button" onClick={handleSubmit}>
              保存并查看详情
            </Button>
            <Link className="c-button-link-secondary" to="/coaches">
              取消
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
