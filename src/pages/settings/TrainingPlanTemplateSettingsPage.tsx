import { ArrowLeft, ChevronRight, Plus } from "lucide-react";
import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { SectionCard } from "../../components/ui/SectionCard";
import { useSettingsTemplates } from "../../context/SettingsTemplateContext";
import type { TrainingPlanTemplate } from "../../mocks/templateSettings";

function formatPlanMeta(template: TrainingPlanTemplate) {
  return `${template.totalLessons} 课时 · ${template.nodes.length} 个阶段`;
}

export function TrainingPlanTemplateSettingsPage() {
  const navigate = useNavigate();
  const { trainingPlanTemplates, addTrainingPlanTemplate } = useSettingsTemplates();

  const nodeCount = useMemo(
    () =>
      trainingPlanTemplates.reduce((sum, item) => sum + item.nodes.length, 0),
    [trainingPlanTemplates],
  );

  const handleAdd = () => {
    const newId = addTrainingPlanTemplate();
    void navigate(`/settings/training-plans/${newId}`);
  };

  return (
    <>
      <PageHeader
        eyebrow="Settings / Templates"
        title="培养计划模板设置"
        actions={
          <Link className="c-button-link-secondary c-template-editor-back-link" to="/settings">
            <ArrowLeft aria-hidden className="c-template-editor-action-icon" />
            返回设置
          </Link>
        }
      />

      <section aria-label="培养计划模板统计" className="c-template-editor-summary">
        <div className="c-template-editor-summary__item">
          <span className="c-template-editor-summary__label">培养计划模板</span>
          <strong className="c-template-editor-summary__value">
            {trainingPlanTemplates.length} 个
          </strong>
        </div>
        <div className="c-template-editor-summary__item">
          <span className="c-template-editor-summary__label">阶段节点</span>
          <strong className="c-template-editor-summary__value">
            {nodeCount} 个
          </strong>
        </div>
      </section>

      <div className="c-template-editor-form">
        <SectionCard
          eyebrow="Training Plans"
          title="培养计划模板"
          action={
            <Button
              className="c-template-editor-action-button"
              type="button"
              variant="secondary"
              onClick={handleAdd}
            >
              <Plus aria-hidden className="c-template-editor-action-icon" />
              添加培养计划
            </Button>
          }
        >
          {trainingPlanTemplates.length > 0 ? (
            <div className="c-template-editor-list">
              {trainingPlanTemplates.map((template, index) => (
                <article key={template.id} className="c-template-editor-item">
                  <Link
                    aria-label={`编辑培养计划：${template.name.trim() || "未命名培养计划模板"}`}
                    className="c-template-editor-item__toggle"
                    to={`/settings/training-plans/${template.id}`}
                  >
                    <div className="c-template-editor-item__title">
                      <span className="c-template-editor-index">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <span className="c-template-editor-item__name">
                          {template.name.trim() || "未命名培养计划模板"}
                        </span>
                        <p className="c-template-editor-item__meta">
                          {formatPlanMeta(template)}
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
              暂无培养计划模板，可点击“添加培养计划”创建。
            </p>
          )}
        </SectionCard>
      </div>
    </>
  );
}
