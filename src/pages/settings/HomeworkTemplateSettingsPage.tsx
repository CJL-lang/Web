import { ArrowLeft, ChevronRight, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { SectionCard } from "../../components/ui/SectionCard";
import { useSettingsTemplates } from "../../context/SettingsTemplateContext";
import type { HomeworkTemplate } from "../../mocks/templateSettings";

function formatHomeworkMeta(template: HomeworkTemplate) {
  return `${template.points} 积分 · ${template.defaultDueDays} 天内提交`;
}

export function HomeworkTemplateSettingsPage() {
  const navigate = useNavigate();
  const { homeworkTemplates, addHomeworkTemplate } = useSettingsTemplates();

  const handleAdd = () => {
    const newId = addHomeworkTemplate();
    void navigate(`/settings/homework/${newId}`);
  };

  return (
    <>
      <PageHeader
        eyebrow="Settings / Templates"
        title="作业模板设置"
        actions={
          <Link className="c-button-link-secondary c-template-editor-back-link" to="/settings">
            <ArrowLeft aria-hidden className="c-template-editor-action-icon" />
            返回设置
          </Link>
        }
      />

      <section aria-label="作业模板统计" className="c-template-editor-summary">
        <div className="c-template-editor-summary__item">
          <span className="c-template-editor-summary__label">作业模板</span>
          <strong className="c-template-editor-summary__value">
            {homeworkTemplates.length} 个
          </strong>
        </div>
      </section>

      <div className="c-template-editor-form">
        <SectionCard
          eyebrow="Homework"
          title="作业模板"
          action={
            <Button
              className="c-template-editor-action-button"
              type="button"
              variant="secondary"
              onClick={handleAdd}
            >
              <Plus aria-hidden className="c-template-editor-action-icon" />
              添加作业模板
            </Button>
          }
        >
          {homeworkTemplates.length > 0 ? (
            <div className="c-template-editor-list">
              {homeworkTemplates.map((template, index) => (
                <article key={template.id} className="c-template-editor-item">
                  <Link
                    aria-label={`编辑作业模板：${template.title.trim() || "未命名作业模板"}`}
                    className="c-template-editor-item__toggle"
                    to={`/settings/homework/${template.id}`}
                  >
                    <div className="c-template-editor-item__title">
                      <span className="c-template-editor-index">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <span className="c-template-editor-item__name">
                          {template.title.trim() || "未命名作业模板"}
                        </span>
                        <p className="c-template-editor-item__meta">
                          {formatHomeworkMeta(template)}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      aria-hidden
                      className="c-template-editor-item__chevron"
                    />
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p className="c-template-editor-empty">
              暂无作业模板，可点击“添加作业模板”创建。
            </p>
          )}
        </SectionCard>
      </div>
    </>
  );
}
