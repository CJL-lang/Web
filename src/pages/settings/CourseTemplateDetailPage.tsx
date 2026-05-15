import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import {
  Link,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";

import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { SectionCard } from "../../components/ui/SectionCard";
import { useSettingsTemplates } from "../../context/SettingsTemplateContext";
import {
  COURSE_TEMPLATE_TYPES,
  type CourseTemplate,
  type CourseTemplateType,
} from "../../mocks/templateSettings";

interface CourseTemplateErrors {
  name?: string;
  defaultDurationMinutes?: string;
  maxStudents?: string;
  goal?: string;
  focus?: string;
}

function parsePositiveInteger(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function hasFieldErrors(errors: CourseTemplateErrors) {
  return Object.keys(errors).length > 0;
}

export function CourseTemplateDetailPage() {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const {
    courseTemplates,
    updateCourseTemplate,
    removeCourseTemplate,
  } = useSettingsTemplates();

  const template = useMemo(
    () => courseTemplates.find((item) => item.id === templateId),
    [courseTemplates, templateId],
  );

  const [errors, setErrors] = useState<CourseTemplateErrors>({});
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (templateId == null || template == null) {
    return <Navigate replace to="/settings/courses" />;
  }

  const validate = (item: CourseTemplate): CourseTemplateErrors => {
    const itemErrors: CourseTemplateErrors = {};
    const normalizedName = item.name.trim();

    if (normalizedName === "") {
      itemErrors.name = "请输入课程模板名称";
    } else {
      const dup = courseTemplates.find(
        (t) => t.id !== item.id && t.name.trim() === normalizedName,
      );
      if (dup != null) {
        itemErrors.name = "课程模板名称不能重复";
      }
    }

    if (
      !Number.isInteger(item.defaultDurationMinutes) ||
      item.defaultDurationMinutes <= 0
    ) {
      itemErrors.defaultDurationMinutes = "请输入正整数";
    }
    if (!Number.isInteger(item.maxStudents) || item.maxStudents <= 0) {
      itemErrors.maxStudents = "请输入正整数";
    }
    if (item.goal.trim() === "") {
      itemErrors.goal = "请输入课程目标";
    }
    if (item.focus.trim() === "") {
      itemErrors.focus = "请输入教学重点";
    }

    return itemErrors;
  };

  const clearFeedback = () => {
    setStatusMessage(null);
    setSummaryError(null);
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const itemErrors = validate(template);
    setErrors(itemErrors);

    if (hasFieldErrors(itemErrors)) {
      setSummaryError("请先修正标红字段后再保存。");
      setStatusMessage(null);
      return;
    }

    setSummaryError(null);
    setStatusMessage("已保存：当前模板仅在本页面 mock 状态中生效。");
  };

  const handleRemove = () => {
    removeCourseTemplate(template.id);
    void navigate("/settings/courses");
  };

  return (
    <>
      <PageHeader
        eyebrow="Settings / Templates / Courses"
        title={template.name.trim() || "未命名课程模板"}
        actions={
          <Link
            className="c-button-link-secondary c-template-editor-back-link"
            to="/settings/courses"
          >
            <ArrowLeft aria-hidden className="c-template-editor-action-icon" />
            返回列表
          </Link>
        }
      />

      <form className="c-template-editor-form" onSubmit={handleSave}>
        <SectionCard eyebrow="Course template" title="课程模板">
          <div className="c-template-editor-field-grid c-template-editor-field-grid--course">
              <label className="c-template-editor-field">
                <span className="c-template-editor-field__label">课程名称</span>
                <input
                  aria-invalid={Boolean(errors.name)}
                  className="c-field-input"
                  value={template.name}
                  onChange={(event) => {
                    clearFeedback();
                    setErrors({});
                    updateCourseTemplate(template.id, {
                      name: event.target.value,
                    });
                  }}
                />
                {errors.name ? (
                  <span className="c-template-editor-field__error">
                    {errors.name}
                  </span>
                ) : null}
              </label>

              <label className="c-template-editor-field">
                <span className="c-template-editor-field__label">课程类型</span>
                <select
                  className="c-field-input"
                  value={template.courseType}
                  onChange={(event) => {
                    clearFeedback();
                    setErrors({});
                    updateCourseTemplate(template.id, {
                      courseType: event.target.value as CourseTemplateType,
                    });
                  }}
                >
                  {COURSE_TEMPLATE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <label className="c-template-editor-field">
                <span className="c-template-editor-field__label">
                  默认时长（分钟）
                </span>
                <input
                  aria-invalid={Boolean(errors.defaultDurationMinutes)}
                  className="c-field-input"
                  inputMode="numeric"
                  min={1}
                  step={1}
                  type="number"
                  value={template.defaultDurationMinutes}
                  onChange={(event) => {
                    clearFeedback();
                    setErrors({});
                    updateCourseTemplate(template.id, {
                      defaultDurationMinutes: parsePositiveInteger(
                        event.target.value,
                      ),
                    });
                  }}
                />
                {errors.defaultDurationMinutes ? (
                  <span className="c-template-editor-field__error">
                    {errors.defaultDurationMinutes}
                  </span>
                ) : null}
              </label>

              <label className="c-template-editor-field">
                <span className="c-template-editor-field__label">人数上限</span>
                <input
                  aria-invalid={Boolean(errors.maxStudents)}
                  className="c-field-input"
                  inputMode="numeric"
                  min={1}
                  step={1}
                  type="number"
                  value={template.maxStudents}
                  onChange={(event) => {
                    clearFeedback();
                    setErrors({});
                    updateCourseTemplate(template.id, {
                      maxStudents: parsePositiveInteger(event.target.value),
                    });
                  }}
                />
                {errors.maxStudents ? (
                  <span className="c-template-editor-field__error">
                    {errors.maxStudents}
                  </span>
                ) : null}
              </label>

              <label className="c-template-editor-field c-template-editor-field--full">
                <span className="c-template-editor-field__label">课程目标</span>
                <textarea
                  aria-invalid={Boolean(errors.goal)}
                  className="c-field-textarea c-template-editor-textarea"
                  value={template.goal}
                  onChange={(event) => {
                    clearFeedback();
                    setErrors({});
                    updateCourseTemplate(template.id, {
                      goal: event.target.value,
                    });
                  }}
                />
                {errors.goal ? (
                  <span className="c-template-editor-field__error">
                    {errors.goal}
                  </span>
                ) : null}
              </label>

              <label className="c-template-editor-field c-template-editor-field--full">
                <span className="c-template-editor-field__label">教学重点</span>
                <textarea
                  aria-invalid={Boolean(errors.focus)}
                  className="c-field-textarea c-template-editor-textarea"
                  value={template.focus}
                  onChange={(event) => {
                    clearFeedback();
                    setErrors({});
                    updateCourseTemplate(template.id, {
                      focus: event.target.value,
                    });
                  }}
                />
                {errors.focus ? (
                  <span className="c-template-editor-field__error">
                    {errors.focus}
                  </span>
                ) : null}
              </label>
            </div>
        </SectionCard>

        <div className="c-template-editor-footer">
          <div aria-live="polite" className="c-template-editor-feedback">
            {summaryError ? (
              <p className="c-template-editor-status c-template-editor-status--error">
                {summaryError}
              </p>
            ) : null}
            {statusMessage ? (
              <p className="c-template-editor-status c-template-editor-status--success">
                {statusMessage}
              </p>
            ) : null}
          </div>

          <div className="c-template-editor-footer__actions">
            <Button
              className="c-template-editor-action-button"
              type="button"
              variant="danger"
              onClick={handleRemove}
            >
              <Trash2 aria-hidden className="c-template-editor-action-icon" />
              删除课程模板
            </Button>
            <Button className="c-template-editor-action-button" type="submit">
              <Save aria-hidden className="c-template-editor-action-icon" />
              保存模板
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
