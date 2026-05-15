import {
  ArrowLeft,
  ChevronDown,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";
import {
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Link } from "react-router-dom";

import { Button } from "../../components/ui/Button";
import { PageHeader } from "../../components/ui/PageHeader";
import { SectionCard } from "../../components/ui/SectionCard";
import {
  DEFAULT_SUBJECTIVE_MEDAL_RULE,
  INITIAL_HONOR_BADGE_TEMPLATES,
  INITIAL_MEDAL_TEMPLATES,
  type HonorBadgeTemplate,
  type MedalTemplate,
} from "../../mocks/badgeTemplates";
import { cn } from "../../utils/cn";

interface MedalTemplateErrors {
  label?: string;
  levelStart?: string;
  levelEnd?: string;
  rule?: string;
}

interface BadgeTemplateErrors {
  label?: string;
}

interface TemplateFormErrors {
  medals: Record<string, MedalTemplateErrors>;
  badges: Record<string, BadgeTemplateErrors>;
  summary?: string;
}

const EMPTY_ERRORS: TemplateFormErrors = {
  medals: {},
  badges: {},
};

type TemplateSection = "medals" | "badges";

const BADGE_TEMPLATE_TAB_MEDALS_ID = "badge-template-tab-medals";
const BADGE_TEMPLATE_TAB_BADGES_ID = "badge-template-tab-badges";
const BADGE_TEMPLATE_PANEL_MEDALS_ID = "badge-template-panel-medals";
const BADGE_TEMPLATE_PANEL_BADGES_ID = "badge-template-panel-badges";

function cloneMedalTemplates() {
  return structuredClone(INITIAL_MEDAL_TEMPLATES);
}

function cloneBadgeTemplates() {
  return structuredClone(INITIAL_HONOR_BADGE_TEMPLATES);
}

function hasFormErrors(errors: TemplateFormErrors) {
  return (
    Object.keys(errors.medals).length > 0 ||
    Object.keys(errors.badges).length > 0 ||
    Boolean(errors.summary)
  );
}

function createCustomBadgeTemplate(templates: HonorBadgeTemplate[]) {
  const existingLabels = new Set(templates.map((item) => item.label.trim()));
  let nextNumber = templates.length + 1;
  let nextLabel = `自定义勋章 ${nextNumber}`;

  while (existingLabels.has(nextLabel)) {
    nextNumber += 1;
    nextLabel = `自定义勋章 ${nextNumber}`;
  }

  return {
    id: `custom-badge-${Date.now()}`,
    label: nextLabel,
  };
}

function createCustomMedalTemplate(templates: MedalTemplate[]): MedalTemplate {
  const existingLabels = new Set(templates.map((item) => item.label.trim()));
  let nextNumber = templates.length + 1;
  let nextLabel = `自定义奖牌 ${nextNumber}`;

  while (existingLabels.has(nextLabel)) {
    nextNumber += 1;
    nextLabel = `自定义奖牌 ${nextNumber}`;
  }

  return {
    id: `custom-medal-${Date.now()}`,
    label: nextLabel,
    levelStart: 1,
    levelEnd: 10,
    ruleType: "subjective",
    rule: DEFAULT_SUBJECTIVE_MEDAL_RULE,
  };
}

function formatLevelRange(template: Pick<MedalTemplate, "levelStart" | "levelEnd">) {
  return `L${template.levelStart}-L${template.levelEnd}`;
}

function parseLevelInput(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function BadgeTemplateSettingsPage() {
  const [medalTemplates, setMedalTemplates] = useState<MedalTemplate[]>(
    cloneMedalTemplates,
  );
  const [badgeTemplates, setBadgeTemplates] = useState<HonorBadgeTemplate[]>(
    cloneBadgeTemplates,
  );
  const [errors, setErrors] = useState<TemplateFormErrors>(EMPTY_ERRORS);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [openMedalIds, setOpenMedalIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [activeTemplateSection, setActiveTemplateSection] =
    useState<TemplateSection>("medals");

  const toggleMedalOpen = (id: string) => {
    setOpenMedalIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const summaryTabs = useMemo(
    () =>
      [
        {
          key: "medals" as const,
          label: "奖牌项目",
          value: `${medalTemplates.length} 项`,
          tabId: BADGE_TEMPLATE_TAB_MEDALS_ID,
          panelId: BADGE_TEMPLATE_PANEL_MEDALS_ID,
        },
        {
          key: "badges" as const,
          label: "勋章模板",
          value: `${badgeTemplates.length} 个`,
          tabId: BADGE_TEMPLATE_TAB_BADGES_ID,
          panelId: BADGE_TEMPLATE_PANEL_BADGES_ID,
        },
      ] as const,
    [badgeTemplates.length, medalTemplates.length],
  );

  const clearFeedback = () => {
    setStatusMessage(null);
    setErrors(EMPTY_ERRORS);
  };

  const updateMedalTemplate = (
    id: string,
    patch: Partial<
      Pick<MedalTemplate, "label" | "levelStart" | "levelEnd" | "rule">
    >,
  ) => {
    clearFeedback();
    setMedalTemplates((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  };

  const addMedalTemplate = () => {
    clearFeedback();
    const nextMedal = createCustomMedalTemplate(medalTemplates);
    setMedalTemplates((prev) => [...prev, nextMedal]);
    setOpenMedalIds((prev) => new Set(prev).add(nextMedal.id));
    setActiveTemplateSection("medals");
  };

  const removeMedalTemplate = (id: string) => {
    clearFeedback();
    setMedalTemplates((prev) => prev.filter((item) => item.id !== id));
    setOpenMedalIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const updateBadgeTemplate = (id: string, label: string) => {
    clearFeedback();
    setBadgeTemplates((prev) =>
      prev.map((item) => (item.id === id ? { ...item, label } : item)),
    );
  };

  const addBadgeTemplate = () => {
    clearFeedback();
    setBadgeTemplates((prev) => [...prev, createCustomBadgeTemplate(prev)]);
  };

  const removeBadgeTemplate = (id: string) => {
    clearFeedback();
    setBadgeTemplates((prev) => prev.filter((item) => item.id !== id));
  };

  const validate = () => {
    const nextErrors: TemplateFormErrors = {
      medals: {},
      badges: {},
    };

    medalTemplates.forEach((item) => {
      const itemErrors: MedalTemplateErrors = {};

      if (item.label.trim() === "") {
        itemErrors.label = "请输入技能项目名称";
      }

      if (!Number.isInteger(item.levelStart) || item.levelStart <= 0) {
        itemErrors.levelStart = "请输入正整数";
      }

      if (!Number.isInteger(item.levelEnd) || item.levelEnd <= 0) {
        itemErrors.levelEnd = "请输入正整数";
      } else if (
        Number.isInteger(item.levelStart) &&
        item.levelStart > 0 &&
        item.levelStart > item.levelEnd
      ) {
        itemErrors.levelEnd = "结束等级不能小于起始等级";
      }

      if (item.rule.trim() === "") {
        itemErrors.rule = "请输入项目规则";
      }

      if (Object.keys(itemErrors).length > 0) {
        nextErrors.medals[item.id] = itemErrors;
      }
    });

    const badgeNameMap = new Map<string, string>();

    badgeTemplates.forEach((item) => {
      const itemErrors: BadgeTemplateErrors = {};
      const normalizedLabel = item.label.trim();
      const duplicateSource = badgeNameMap.get(normalizedLabel);

      if (normalizedLabel === "") {
        itemErrors.label = "请输入勋章名称";
      } else if (duplicateSource != null) {
        itemErrors.label = "勋章名称不能重复";
        nextErrors.badges[duplicateSource] = {
          ...(nextErrors.badges[duplicateSource] ?? {}),
          label: "勋章名称不能重复",
        };
      } else {
        badgeNameMap.set(normalizedLabel, item.id);
      }

      if (Object.keys(itemErrors).length > 0) {
        nextErrors.badges[item.id] = itemErrors;
      }
    });

    if (hasFormErrors(nextErrors)) {
      nextErrors.summary = "请先修正标红字段后再保存。";
    }

    return nextErrors;
  };

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    if (hasFormErrors(nextErrors)) {
      setOpenMedalIds((prev) => {
        const next = new Set(prev);
        Object.keys(nextErrors.medals).forEach((id) => next.add(id));
        return next;
      });
      if (Object.keys(nextErrors.medals).length > 0) {
        setActiveTemplateSection("medals");
      } else if (Object.keys(nextErrors.badges).length > 0) {
        setActiveTemplateSection("badges");
      }
      setStatusMessage(null);
      return;
    }

    setStatusMessage("已保存：当前模板仅在本页面 mock 状态中生效。");
  };

  const handleReset = () => {
    setMedalTemplates(cloneMedalTemplates());
    setBadgeTemplates(cloneBadgeTemplates());
    setErrors(EMPTY_ERRORS);
    setOpenMedalIds(new Set());
    setActiveTemplateSection("medals");
    setStatusMessage("已恢复 mock 初始模板。");
  };

  return (
    <>
      <PageHeader
        eyebrow="Settings / Templates"
        title="奖牌与勋章模板设置"
        actions={
          <Link className="c-button-link-secondary c-badge-template-back-link" to="/settings">
            <ArrowLeft aria-hidden className="c-badge-template-action-icon" />
            返回设置
          </Link>
        }
      />

      <section
        aria-label="模板编辑分区"
        className="c-badge-template-summary"
        role="tablist"
      >
        {summaryTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            id={tab.tabId}
            role="tab"
            aria-controls={tab.panelId}
            aria-selected={activeTemplateSection === tab.key}
            className="c-badge-template-summary__item"
            onClick={() => setActiveTemplateSection(tab.key)}
          >
            <span className="c-badge-template-summary__label">
              {tab.label}
            </span>
            <strong className="c-badge-template-summary__value">
              {tab.value}
            </strong>
          </button>
        ))}
      </section>

      <form className="c-badge-template-form" onSubmit={handleSave}>
        <SectionCard
          aria-labelledby={BADGE_TEMPLATE_TAB_MEDALS_ID}
          eyebrow="Medals"
          hidden={activeTemplateSection !== "medals"}
          id={BADGE_TEMPLATE_PANEL_MEDALS_ID}
          role="tabpanel"
          title="奖牌等级模板"
          action={
            <Button
              className="c-badge-template-action-button"
              type="button"
              variant="secondary"
              onClick={addMedalTemplate}
            >
              <Plus aria-hidden className="c-badge-template-action-icon" />
              添加奖牌
            </Button>
          }
        >
          {medalTemplates.length > 0 ? (
            <div className="c-badge-template-medal-list">
            {medalTemplates.map((template, index) => {
              const itemErrors = errors.medals[template.id] ?? {};
              const panelId = `medal-template-panel-${template.id}`;
              const triggerId = `medal-template-trigger-${template.id}`;
              const isOpen = openMedalIds.has(template.id);

              return (
                <article
                  key={template.id}
                  className={cn(
                    "c-badge-template-medal-item",
                    isOpen && "c-badge-template-medal-item--expanded",
                  )}
                >
                  <button
                    id={triggerId}
                    type="button"
                    className="c-badge-template-medal-item__toggle"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleMedalOpen(template.id)}
                  >
                    <div className="c-badge-template-medal-item__title">
                      <span className="c-badge-template-index">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <span className="c-badge-template-medal-item__name">
                          {template.label.trim() || "未命名奖牌"}
                        </span>
                        <p className="c-badge-template-medal-item__meta">
                          {formatLevelRange(template)}
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      aria-hidden
                      className="c-badge-template-medal-item__chevron"
                    />
                  </button>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    hidden={!isOpen}
                    className="c-badge-template-medal-item__panel"
                  >
                    <div className="c-badge-template-field-grid">
                      <label className="c-badge-template-field">
                        <span className="c-badge-template-field__label">
                          技能项目
                        </span>
                        <input
                          aria-invalid={Boolean(itemErrors.label)}
                          className="c-field-input"
                          value={template.label}
                          onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            updateMedalTemplate(template.id, {
                              label: event.target.value,
                            })
                          }
                        />
                        {itemErrors.label ? (
                          <span className="c-badge-template-field__error">
                            {itemErrors.label}
                          </span>
                        ) : null}
                      </label>

                      <label className="c-badge-template-field">
                        <span className="c-badge-template-field__label">
                          起始等级
                        </span>
                        <input
                          aria-invalid={Boolean(itemErrors.levelStart)}
                          className="c-field-input"
                          inputMode="numeric"
                          min={1}
                          step={1}
                          type="number"
                          value={template.levelStart}
                          onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            updateMedalTemplate(template.id, {
                              levelStart: parseLevelInput(event.target.value),
                            })
                          }
                        />
                        {itemErrors.levelStart ? (
                          <span className="c-badge-template-field__error">
                            {itemErrors.levelStart}
                          </span>
                        ) : null}
                      </label>

                      <label className="c-badge-template-field">
                        <span className="c-badge-template-field__label">
                          结束等级
                        </span>
                        <input
                          aria-invalid={Boolean(itemErrors.levelEnd)}
                          className="c-field-input"
                          inputMode="numeric"
                          min={1}
                          step={1}
                          type="number"
                          value={template.levelEnd}
                          onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            updateMedalTemplate(template.id, {
                              levelEnd: parseLevelInput(event.target.value),
                            })
                          }
                        />
                        {itemErrors.levelEnd ? (
                          <span className="c-badge-template-field__error">
                            {itemErrors.levelEnd}
                          </span>
                        ) : null}
                      </label>

                      <label className="c-badge-template-field c-badge-template-field--full">
                        <span className="c-badge-template-field__label">
                          项目规则
                        </span>
                        <textarea
                          aria-invalid={Boolean(itemErrors.rule)}
                          className="c-field-textarea c-badge-template-rule-input"
                          value={template.rule}
                          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                            updateMedalTemplate(template.id, {
                              rule: event.target.value,
                            })
                          }
                        />
                        {itemErrors.rule ? (
                          <span className="c-badge-template-field__error">
                            {itemErrors.rule}
                          </span>
                        ) : null}
                      </label>
                    </div>
                    <div className="c-badge-template-medal-item__panel-actions">
                      <Button
                        className="c-badge-template-action-button"
                        type="button"
                        variant="danger"
                        onClick={() => removeMedalTemplate(template.id)}
                      >
                        <Trash2 aria-hidden className="c-badge-template-action-icon" />
                        删除奖牌
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
            </div>
          ) : (
            <p className="c-badge-template-empty">
              暂无奖牌模板，可点击“添加奖牌”创建。
            </p>
          )}
        </SectionCard>

        <SectionCard
          aria-labelledby={BADGE_TEMPLATE_TAB_BADGES_ID}
          eyebrow="Badges"
          hidden={activeTemplateSection !== "badges"}
          id={BADGE_TEMPLATE_PANEL_BADGES_ID}
          role="tabpanel"
          title="勋章文字模板"
          action={
            <Button
              className="c-badge-template-action-button"
              type="button"
              variant="secondary"
              onClick={addBadgeTemplate}
            >
              <Plus aria-hidden className="c-badge-template-action-icon" />
              添加勋章
            </Button>
          }
        >
          {badgeTemplates.length > 0 ? (
            <div className="c-badge-template-badge-list">
              {badgeTemplates.map((template) => {
                const itemErrors = errors.badges[template.id] ?? {};

                return (
                  <div key={template.id} className="c-badge-template-badge-row">
                    <label className="c-badge-template-field c-badge-template-badge-row__field">
                      <span className="c-badge-template-field__label">
                        勋章名称
                      </span>
                      <input
                        aria-invalid={Boolean(itemErrors.label)}
                        className="c-field-input"
                        value={template.label}
                        onChange={(event: ChangeEvent<HTMLInputElement>) =>
                          updateBadgeTemplate(template.id, event.target.value)
                        }
                      />
                      {itemErrors.label ? (
                        <span className="c-badge-template-field__error">
                          {itemErrors.label}
                        </span>
                      ) : null}
                    </label>

                    <button
                      aria-label={`删除${template.label || "勋章模板"}`}
                      className="c-badge-template-icon-button"
                      title="删除勋章模板"
                      type="button"
                      onClick={() => removeBadgeTemplate(template.id)}
                    >
                      <Trash2 aria-hidden className="c-badge-template-action-icon" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="c-badge-template-empty">
              暂无勋章文字模板，可点击“添加勋章”创建。
            </p>
          )}
        </SectionCard>

        <div className="c-badge-template-footer">
          <div aria-live="polite" className="c-badge-template-feedback">
            {errors.summary ? (
              <p className="c-badge-template-status c-badge-template-status--error">
                {errors.summary}
              </p>
            ) : null}
            {statusMessage ? (
              <p className="c-badge-template-status c-badge-template-status--success">
                {statusMessage}
              </p>
            ) : null}
          </div>

          <div className="c-badge-template-footer__actions">
            <Button
              className="c-badge-template-action-button"
              type="button"
              variant="secondary"
              onClick={handleReset}
            >
              <RotateCcw aria-hidden className="c-badge-template-action-icon" />
              重置 mock
            </Button>
            <Button className="c-badge-template-action-button" type="submit">
              <Save aria-hidden className="c-badge-template-action-icon" />
              保存模板
            </Button>
          </div>
        </div>
      </form>
    </>
  );
}
