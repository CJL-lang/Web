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
import type { HomeworkTemplate } from "../../mocks/templateSettings";

interface HomeworkTemplateErrors {
  title?: string;
  description?: string;
  points?: string;
  defaultDueDays?: string;
  submissionRequirement?: string;
  gradingCriteria?: string;
}

function parsePositiveInteger(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function hasFieldErrors(errors: HomeworkTemplateErrors) {
  return Object.keys(errors).length > 0;
}

export function HomeworkTemplateDetailPage() {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const {
    homeworkTemplates,
    updateHomeworkTemplate,
    removeHomeworkTemplate,
  } = useSettingsTemplates();

  const template = useMemo(
    () => homeworkTemplates.find((item) => item.id === templateId),
    [homeworkTemplates, templateId],
  );

  const [errors, setErrors] = useState<HomeworkTemplateErrors>({});
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (templateId == null || template == null) {
    return <Navigate replace to="/settings/homework" />;
  }

  const validate = (item: HomeworkTemplate): HomeworkTemplateErrors => {
    const itemErrors: HomeworkTemplateErrors = {};
    const normalizedTitle = item.title.trim();

    if (normalizedTitle === "") {
      itemErrors.title = "请输入作业标题";
    } else {
      const dup = homeworkTemplates.find(
        (t) => t.id !== item.id && t.title.trim() === normalizedTitle,
      );
      if (dup != null) {
        itemErrors.title = "作业模板标题不能重复";
      }
    }

    if (item.description.trim() === "") {
      itemErrors.description = "请输入作业说明";
    }
    if (!Number.isInteger(item.points) || item.points <= 0) {
      itemErrors.points = "请输入正整数";
    }
    if (!Number.isInteger(item.defaultDueDays) || item.defaultDueDays <= 0) {
      itemErrors.defaultDueDays = "请输入正整数";
    }
    if (item.submissionRequirement.trim() === "") {
      itemErrors.submissionRequirement = "请输入提交要求";
    }
    if (item.gradingCriteria.trim() === "") {
      itemErrors.gradingCriteria = "请输入评分要点";
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
    removeHomeworkTemplate(template.id);
    void navigate("/settings/homework");
  };

  return (
    <>
      <PageHeader
        eyebrow="Settings / Templates / Homework"
        title={template.title.trim() || "未命名作业模板"}
        actions={
          <Link
            className="c-button-link-secondary c-template-editor-back-link"
            to="/settings/homework"
          >
            <ArrowLeft aria-hidden className="c-template-editor-action-icon" />
            返回列表
          </Link>
        }
      />

      <form className="c-template-editor-form" onSubmit={handleSave}>
        <SectionCard eyebrow="Homework template" title="作业模板">
          <div className="c-template-editor-field-grid c-template-editor-field-grid--homework">
              <label className="c-template-editor-field">
                <span className="c-template-editor-field__label">作业标题</span>
                <input
                  aria-invalid={Boolean(errors.title)}
                  className="c-field-input"
                  value={template.title}
                  onChange={(event) => {
                    clearFeedback();
                    setErrors({});
                    updateHomeworkTemplate(template.id, {
                      title: event.target.value,
                    });
                  }}
                />
                {errors.title ? (
                  <span className="c-template-editor-field__error">
                    {errors.title}
                  </span>
                ) : null}
              </label>

              <label className="c-template-editor-field">
                <span className="c-template-editor-field__label">积分</span>
                <input
                  aria-invalid={Boolean(errors.points)}
                  className="c-field-input"
                  inputMode="numeric"
                  min={1}
                  step={1}
                  type="number"
                  value={template.points}
                  onChange={(event) => {
                    clearFeedback();
                    setErrors({});
                    updateHomeworkTemplate(template.id, {
                      points: parsePositiveInteger(event.target.value),
                    });
                  }}
                />
                {errors.points ? (
                  <span className="c-template-editor-field__error">
                    {errors.points}
                  </span>
                ) : null}
              </label>

              <label className="c-template-editor-field">
                <span className="c-template-editor-field__label">
                  默认截止天数
                </span>
                <input
                  aria-invalid={Boolean(errors.defaultDueDays)}
                  className="c-field-input"
                  inputMode="numeric"
                  min={1}
                  step={1}
                  type="number"
                  value={template.defaultDueDays}
                  onChange={(event) => {
                    clearFeedback();
                    setErrors({});
                    updateHomeworkTemplate(template.id, {
                      defaultDueDays: parsePositiveInteger(event.target.value),
                    });
                  }}
                />
                {errors.defaultDueDays ? (
                  <span className="c-template-editor-field__error">
                    {errors.defaultDueDays}
                  </span>
                ) : null}
              </label>

              <label className="c-template-editor-field c-template-editor-field--full">
                <span className="c-template-editor-field__label">作业说明</span>
                <textarea
                  aria-invalid={Boolean(errors.description)}
                  className="c-field-textarea c-template-editor-textarea"
                  value={template.description}
                  onChange={(event) => {
                    clearFeedback();
                    setErrors({});
                    updateHomeworkTemplate(template.id, {
                      description: event.target.value,
                    });
                  }}
                />
                {errors.description ? (
                  <span className="c-template-editor-field__error">
                    {errors.description}
                  </span>
                ) : null}
              </label>

              <label className="c-template-editor-field c-template-editor-field--full">
                <span className="c-template-editor-field__label">提交要求</span>
                <textarea
                  aria-invalid={Boolean(errors.submissionRequirement)}
                  className="c-field-textarea c-template-editor-textarea"
                  value={template.submissionRequirement}
                  onChange={(event) => {
                    clearFeedback();
                    setErrors({});
                    updateHomeworkTemplate(template.id, {
                      submissionRequirement: event.target.value,
                    });
                  }}
                />
                {errors.submissionRequirement ? (
                  <span className="c-template-editor-field__error">
                    {errors.submissionRequirement}
                  </span>
                ) : null}
              </label>

              <label className="c-template-editor-field c-template-editor-field--full">
                <span className="c-template-editor-field__label">评分要点</span>
                <textarea
                  aria-invalid={Boolean(errors.gradingCriteria)}
                  className="c-field-textarea c-template-editor-textarea"
                  value={template.gradingCriteria}
                  onChange={(event) => {
                    clearFeedback();
                    setErrors({});
                    updateHomeworkTemplate(template.id, {
                      gradingCriteria: event.target.value,
                    });
                  }}
                />
                {errors.gradingCriteria ? (
                  <span className="c-template-editor-field__error">
                    {errors.gradingCriteria}
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
              删除作业模板
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
