import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
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
import type { TrainingPlanTemplate } from "../../mocks/templateSettings";

interface TrainingPlanNodeErrors {
  title?: string;
  lessonStart?: string;
  lessonEnd?: string;
  goal?: string;
  focus?: string;
}

interface TrainingPlanTemplateErrors {
  name?: string;
  totalLessons?: string;
  applicableFor?: string;
  nodesSummary?: string;
  nodes: Record<string, TrainingPlanNodeErrors>;
}

function parsePositiveInteger(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function hasTemplateErrors(errors: TrainingPlanTemplateErrors) {
  return (
    Boolean(errors.name) ||
    Boolean(errors.totalLessons) ||
    Boolean(errors.applicableFor) ||
    Boolean(errors.nodesSummary) ||
    Object.keys(errors.nodes).length > 0
  );
}

function validateTrainingPlanTemplate(
  item: TrainingPlanTemplate,
  allTemplates: TrainingPlanTemplate[],
): TrainingPlanTemplateErrors {
  const itemErrors: TrainingPlanTemplateErrors = {
    nodes: {},
  };
  const normalizedName = item.name.trim();

  if (normalizedName === "") {
    itemErrors.name = "请输入培养计划名称";
  } else {
    const dup = allTemplates.find(
      (t) => t.id !== item.id && t.name.trim() === normalizedName,
    );
    if (dup != null) {
      itemErrors.name = "培养计划模板名称不能重复";
    }
  }

  if (!Number.isInteger(item.totalLessons) || item.totalLessons <= 0) {
    itemErrors.totalLessons = "请输入正整数";
  }
  if (item.applicableFor.trim() === "") {
    itemErrors.applicableFor = "请输入适用说明";
  }
  if (item.nodes.length === 0) {
    itemErrors.nodesSummary = "请至少保留一个阶段节点";
  }

  item.nodes.forEach((node) => {
    const nodeErrors: TrainingPlanNodeErrors = {};

    if (node.title.trim() === "") {
      nodeErrors.title = "请输入阶段名称";
    }
    if (!Number.isInteger(node.lessonStart) || node.lessonStart <= 0) {
      nodeErrors.lessonStart = "请输入正整数";
    } else if (
      Number.isInteger(item.totalLessons) &&
      item.totalLessons > 0 &&
      node.lessonStart > item.totalLessons
    ) {
      nodeErrors.lessonStart = "起始课时不能超过总课时";
    }
    if (!Number.isInteger(node.lessonEnd) || node.lessonEnd <= 0) {
      nodeErrors.lessonEnd = "请输入正整数";
    } else if (node.lessonStart > 0 && node.lessonStart > node.lessonEnd) {
      nodeErrors.lessonEnd = "结束课时不能小于起始课时";
    } else if (
      Number.isInteger(item.totalLessons) &&
      item.totalLessons > 0 &&
      node.lessonEnd > item.totalLessons
    ) {
      nodeErrors.lessonEnd = "结束课时不能超过总课时";
    }
    if (node.goal.trim() === "") {
      nodeErrors.goal = "请输入阶段目标";
    }
    if (node.focus.trim() === "") {
      nodeErrors.focus = "请输入训练重点";
    }

    if (Object.keys(nodeErrors).length > 0) {
      itemErrors.nodes[node.id] = nodeErrors;
    }
  });

  return itemErrors;
}

export function TrainingPlanTemplateDetailPage() {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const {
    trainingPlanTemplates,
    updateTrainingPlanTemplate,
    updateTrainingPlanNode,
    addTrainingPlanNode,
    removeTrainingPlanNode,
    removeTrainingPlanTemplate,
  } = useSettingsTemplates();

  const template = useMemo(
    () => trainingPlanTemplates.find((item) => item.id === templateId),
    [trainingPlanTemplates, templateId],
  );

  const [errors, setErrors] = useState<TrainingPlanTemplateErrors>({
    nodes: {},
  });
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (templateId == null || template == null) {
    return <Navigate replace to="/settings/training-plans" />;
  }

  const itemErrors = errors;

  const clearFeedback = () => {
    setStatusMessage(null);
    setSummaryError(null);
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateTrainingPlanTemplate(
      template,
      trainingPlanTemplates,
    );
    setErrors(nextErrors);

    if (hasTemplateErrors(nextErrors)) {
      setSummaryError("请先修正标红字段后再保存。");
      setStatusMessage(null);
      return;
    }

    setSummaryError(null);
    setStatusMessage("已保存：当前模板仅在本页面 mock 状态中生效。");
  };

  const handleRemove = () => {
    removeTrainingPlanTemplate(template.id);
    void navigate("/settings/training-plans");
  };

  return (
    <>
      <PageHeader
        eyebrow="Settings / Templates / Training plans"
        title={template.name.trim() || "未命名培养计划模板"}
        actions={
          <Link
            className="c-button-link-secondary c-template-editor-back-link"
            to="/settings/training-plans"
          >
            <ArrowLeft aria-hidden className="c-template-editor-action-icon" />
            返回列表
          </Link>
        }
      />

      <form className="c-template-editor-form" onSubmit={handleSave}>
        <SectionCard eyebrow="Training plan template" title="培养计划模板">
          <div className="c-template-editor-field-grid c-template-editor-field-grid--training-plan">
            <label className="c-template-editor-field">
              <span className="c-template-editor-field__label">计划名称</span>
              <input
                aria-invalid={Boolean(itemErrors.name)}
                className="c-field-input"
                value={template.name}
                onChange={(event) => {
                  clearFeedback();
                  setErrors({ nodes: {} });
                  updateTrainingPlanTemplate(template.id, {
                    name: event.target.value,
                  });
                }}
              />
              {itemErrors.name ? (
                <span className="c-template-editor-field__error">
                  {itemErrors.name}
                </span>
              ) : null}
            </label>

            <label className="c-template-editor-field">
              <span className="c-template-editor-field__label">总课时</span>
              <input
                aria-invalid={Boolean(itemErrors.totalLessons)}
                className="c-field-input"
                inputMode="numeric"
                min={1}
                step={1}
                type="number"
                value={template.totalLessons}
                onChange={(event) => {
                  clearFeedback();
                  setErrors({ nodes: {} });
                  updateTrainingPlanTemplate(template.id, {
                    totalLessons: parsePositiveInteger(event.target.value),
                  });
                }}
              />
              {itemErrors.totalLessons ? (
                <span className="c-template-editor-field__error">
                  {itemErrors.totalLessons}
                </span>
              ) : null}
            </label>

            <label className="c-template-editor-field c-template-editor-field--full">
              <span className="c-template-editor-field__label">适用说明</span>
              <textarea
                aria-invalid={Boolean(itemErrors.applicableFor)}
                className="c-field-textarea c-template-editor-textarea"
                value={template.applicableFor}
                onChange={(event) => {
                  clearFeedback();
                  setErrors({ nodes: {} });
                  updateTrainingPlanTemplate(template.id, {
                    applicableFor: event.target.value,
                  });
                }}
              />
              {itemErrors.applicableFor ? (
                <span className="c-template-editor-field__error">
                  {itemErrors.applicableFor}
                </span>
              ) : null}
            </label>
          </div>

          <div className="c-template-editor-node-section">
            <div className="c-template-editor-node-section__header">
              <div>
                <h3 className="c-template-editor-node-section__title">
                  阶段节点
                </h3>
                {itemErrors.nodesSummary ? (
                  <p className="c-template-editor-node-section__error">
                    {itemErrors.nodesSummary}
                  </p>
                ) : null}
              </div>
              <Button
                className="c-template-editor-action-button"
                type="button"
                variant="secondary"
                onClick={() => {
                  clearFeedback();
                  setErrors({ nodes: {} });
                  addTrainingPlanNode(template.id);
                }}
              >
                <Plus aria-hidden className="c-template-editor-action-icon" />
                添加阶段
              </Button>
            </div>

            {template.nodes.length > 0 ? (
              <div className="c-template-editor-node-list">
                {template.nodes.map((node, nodeIndex) => {
                  const nodeErrors = itemErrors.nodes[node.id] ?? {};

                  return (
                    <article
                      key={node.id}
                      className="c-template-editor-node-card"
                    >
                      <div className="c-template-editor-node-card__head">
                        <span className="c-template-editor-node-card__index">
                          阶段 {nodeIndex + 1}
                        </span>
                        <button
                          aria-label={`删除${node.title || "阶段节点"}`}
                          className="c-template-editor-icon-button"
                          title="删除阶段节点"
                          type="button"
                          onClick={() => {
                            clearFeedback();
                            setErrors({ nodes: {} });
                            removeTrainingPlanNode(template.id, node.id);
                          }}
                        >
                          <Trash2
                            aria-hidden
                            className="c-template-editor-action-icon"
                          />
                        </button>
                      </div>

                      <div className="c-template-editor-field-grid c-template-editor-field-grid--node">
                        <label className="c-template-editor-field">
                          <span className="c-template-editor-field__label">
                            阶段名称
                          </span>
                          <input
                            aria-invalid={Boolean(nodeErrors.title)}
                            className="c-field-input"
                            value={node.title}
                            onChange={(event) => {
                              clearFeedback();
                              setErrors({ nodes: {} });
                              updateTrainingPlanNode(template.id, node.id, {
                                title: event.target.value,
                              });
                            }}
                          />
                          {nodeErrors.title ? (
                            <span className="c-template-editor-field__error">
                              {nodeErrors.title}
                            </span>
                          ) : null}
                        </label>

                        <label className="c-template-editor-field">
                          <span className="c-template-editor-field__label">
                            起始课时
                          </span>
                          <input
                            aria-invalid={Boolean(nodeErrors.lessonStart)}
                            className="c-field-input"
                            inputMode="numeric"
                            min={1}
                            step={1}
                            type="number"
                            value={node.lessonStart}
                            onChange={(event) => {
                              clearFeedback();
                              setErrors({ nodes: {} });
                              updateTrainingPlanNode(template.id, node.id, {
                                lessonStart: parsePositiveInteger(
                                  event.target.value,
                                ),
                              });
                            }}
                          />
                          {nodeErrors.lessonStart ? (
                            <span className="c-template-editor-field__error">
                              {nodeErrors.lessonStart}
                            </span>
                          ) : null}
                        </label>

                        <label className="c-template-editor-field">
                          <span className="c-template-editor-field__label">
                            结束课时
                          </span>
                          <input
                            aria-invalid={Boolean(nodeErrors.lessonEnd)}
                            className="c-field-input"
                            inputMode="numeric"
                            min={1}
                            step={1}
                            type="number"
                            value={node.lessonEnd}
                            onChange={(event) => {
                              clearFeedback();
                              setErrors({ nodes: {} });
                              updateTrainingPlanNode(template.id, node.id, {
                                lessonEnd: parsePositiveInteger(
                                  event.target.value,
                                ),
                              });
                            }}
                          />
                          {nodeErrors.lessonEnd ? (
                            <span className="c-template-editor-field__error">
                              {nodeErrors.lessonEnd}
                            </span>
                          ) : null}
                        </label>

                        <label className="c-template-editor-field c-template-editor-field--full">
                          <span className="c-template-editor-field__label">
                            阶段目标
                          </span>
                          <textarea
                            aria-invalid={Boolean(nodeErrors.goal)}
                            className="c-field-textarea c-template-editor-textarea"
                            value={node.goal}
                            onChange={(event) => {
                              clearFeedback();
                              setErrors({ nodes: {} });
                              updateTrainingPlanNode(template.id, node.id, {
                                goal: event.target.value,
                              });
                            }}
                          />
                          {nodeErrors.goal ? (
                            <span className="c-template-editor-field__error">
                              {nodeErrors.goal}
                            </span>
                          ) : null}
                        </label>

                        <label className="c-template-editor-field c-template-editor-field--full">
                          <span className="c-template-editor-field__label">
                            训练重点
                          </span>
                          <textarea
                            aria-invalid={Boolean(nodeErrors.focus)}
                            className="c-field-textarea c-template-editor-textarea"
                            value={node.focus}
                            onChange={(event) => {
                              clearFeedback();
                              setErrors({ nodes: {} });
                              updateTrainingPlanNode(template.id, node.id, {
                                focus: event.target.value,
                              });
                            }}
                          />
                          {nodeErrors.focus ? (
                            <span className="c-template-editor-field__error">
                              {nodeErrors.focus}
                            </span>
                          ) : null}
                        </label>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="c-template-editor-empty">
                暂无阶段节点，可点击“添加阶段”创建。
              </p>
            )}
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
              删除培养计划
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
